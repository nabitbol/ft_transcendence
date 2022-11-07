import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsException,
} from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { jwtConstants } from "@ft-transcendence/libs-backend-auth";
import { UserService } from "@ft-transcendence/libs-backend-user";
import { RoomService } from "./lib/room/room.service";
import { MessageService } from "./lib/message/message.service";
import { Cron, CronExpression } from "@nestjs/schedule";
import {
  UnauthorizedException,
  UsePipes,
  ValidationPipe,
} from "@nestjs/common";
import {
  MessageDto,
  RoomDto,
  UserDto,
  UserRoomDto,
} from "@ft-transcendence/libs-shared-types";
import { Room_Role, Room_Status } from "@prisma/client";
import { v4 } from "uuid";
// eslint-disable-next-line @typescript-eslint/no-var-requires
const jwt = require("jsonwebtoken");

@WebSocketGateway(8080, {
  cors: {
    origin: ["https://hoppscotch.io", "http://localhost:4200"],
    credentials: true,
  },
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(
    private userService: UserService,
    private roomService: RoomService,
    private messageservice: MessageService
  ) {}

  @WebSocketServer()
  server: Server;

  userInChat: { userId: string; user: UserDto; room?: RoomDto | undefined }[] =
    [];

  async handleConnection(client: Socket, ...args: any[]) {
    if(!client || client === undefined)
      return;
    try {
      const bearerToken = client.handshake.headers.authorization.split(" ")[1];
      if (bearerToken === undefined)
      {
        this.disconnect(client);
        return ;
      }
      const decoded = await jwt.verify(bearerToken, jwtConstants.secret);
      const user = await this.userService.getUserByName(decoded.name);
      if (!user || user === undefined)
      {
        this.disconnect(client);
        return ;
      }
      client.data.user = user;
      this.userInChat.push({
        userId: client.id,
        user: user,
      });
    } catch (err) {
      return this.disconnect(client);
    }
  }

  handleDisconnect(client: Socket) {
    if(!client || client === undefined)
      return;
    if (client.data.user)
      this.userInChat = this.getUserWithout(client.data.user.name);
    this.disconnect(client);
  }

  private disconnect(client: Socket) {
    if(!client || client === undefined)
      return;
    client.emit("Error", new UnauthorizedException());
    client.disconnect();
  }

  /* --------------------------------- filters -------------------------------- */

  withoutUser = (value, name: string) => {
    return value.name !== name;
  };

  withoutUserInChat = (value, name) => {
    return value.user.name !== name;
  };

  withUserInChat = (value, name) => {
    return value.user.name === name;
  };

  withUserWithId = (value, userId) => {
    return value.userId === userId;
  };

  filterItems = (array, querry, args: string[]) => {
    return array.filter((element) => querry(element, args));
  };

  /* --------------------------------- getters -------------------------------- */

  getUserWithout = (name: string) => {
    return this.filterItems(
      this.userInChat,
      this.withoutUserInChat,
      name as unknown as string[]
    );
  };

  getUserWith = (name: string) => {
    return this.filterItems(
      this.userInChat,
      this.withUserInChat,
      name as unknown as string[]
    );
  };

  getUserWithId = (userId: string) => {
    return this.filterItems(
      this.userInChat,
      this.withUserWithId,
      userId as unknown as string[]
    );
  };

  getUserRoles = async (user: UserDto, rooms: RoomDto[]) => {
    const userRole: string[] = [];
    for (let i = 0; i < rooms.length; i++) {
      userRole.push(await this.roomService.getUserSatus(rooms[i].id, user));
    }
    return userRole;
  };

  async getRoomMessages(user: UserDto, room: RoomDto) {
    const mutes: UserDto[] = await this.userService.getMutedUsers(user.name);
    const messages: MessageDto[] =
      await this.messageservice.getForUserRoomMessages(room.id, mutes);
    return messages;
  }

  /* -------------------------------- specific -------------------------------- */

  async cleanStatus(client: Socket, user: UserRoomDto, room: RoomDto) {
    if(!client || client === undefined)
      return;
    const timeMin = new Date(Date.now() - 30000);
    let isNormalRole = false;
    if (
      user.updated_at < timeMin &&
      (user.role === Room_Role.BANNED || user.role === Room_Role.MUTED)
    ) {
      await this.roomService.udpateUsersStatus(
        room.id,
        client.data.user,
        Room_Role.NORMAL
      );
      const rooms: RoomDto[] = await this.roomService.getUserRooms(
        client.data.user.id
      );
      const userRole: string[] = await this.getUserRoles(
        client.data.user,
        rooms
      );
      this.server.to(client.id).emit("server:updateroom", { rooms, userRole });
      isNormalRole = true;
    }
    return !isNormalRole ? user.role : Room_Role.NORMAL;
  }

  async emitToUsersInRoom(room: RoomDto, senderName: string, event: string) {
    const clients: Set<string> = await this.server.in(room.name).allSockets();
    const iterator = clients.values();
    const muters: UserDto[] = await this.userService.getMutedByUsers(
      senderName
    );
    let tmp;
    let clientTmp: string;
    let check: UserDto;
    for (let i = 0; i < clients.size; i++) {
      clientTmp = iterator.next().value;
      tmp = this.getUserWithId(clientTmp)[0];
      check = muters.find(({ name }) => name === tmp.user.name);
      if (!check || check.name === senderName) {
        const messages: MessageDto[] = await this.getRoomMessages(
          tmp.user,
          room
        );
        const authors: UserDto[] = [];
        for (let i = 0; i < messages.length; i++) {
          authors[i] = await this.messageservice.getMessageUser(messages[i]);
        }
        this.server.to(clientTmp).emit(event, { messages, authors });
      }
    }
  }

  async emitRoomToUser(user: UserDto) {
    const event = "server:updateroom";
    const toEmit: { userId: string; user: UserDto } = this.getUserWith(
      user.name
    )[0];
    const rooms: RoomDto[] = await this.roomService.getUserRooms(user.id);
    const userRole: string[] = await this.getUserRoles(toEmit.user, rooms);
    this.server.to(toEmit.userId).emit(event, { rooms, userRole });
  }

  async onJoinConversation(
    client: Socket,
    payload: { conv: RoomDto; userToAdd: UserDto[] }
  ) {
    if(!client || client === undefined)
      return;
    try {
      const event = "server:joinconversation";
      const tmp: RoomDto = await this.roomService.getRoomByName(
        payload.conv.name
      );
      await this.roomService.addUsers(tmp.id, payload.userToAdd);
      const rooms: RoomDto[] = await this.roomService.getUserRooms(
        payload.userToAdd[0].id
      );
      const userRole: string[] = await this.getUserRoles(
        client.data.user,
        rooms
      );
      const user: { userId: string; user: UserDto } = this.getUserWith(
        client.data.user.name
      )[0];
      client.broadcast
        .to(user.userId)
        .emit(event, { data: { rooms, userRole } });
    } catch (err) {
      throw new WsException(err.message);
    }
  }

  async onJoinPrivateRoom(
    client: Socket,
    payload: { room: RoomDto; userToAdd: UserDto[] }
  ) {
    if(!client || client === undefined)
      return;
    try {
      const event = "server:joinprivateroom";
      await this.roomService.addUsers(payload.room.id, payload.userToAdd);
      const rooms: RoomDto[] = await this.roomService.getUserRooms(
        payload.userToAdd[0].id
      );
      const userRole: string[] = await this.getUserRoles(
        payload.userToAdd[0],
        rooms
      );
      const user: { userId: string; user: UserDto } = this.getUserWith(
        payload.userToAdd[0].name
      )[0];
      this.server.to(user.userId).emit(event, { rooms, userRole });
    } catch (err) {
      throw new WsException(err.message);
    }
  }

  /* --------------------------- Room event handlers -------------------------- */

  @Cron(CronExpression.EVERY_30_SECONDS)
  async checkUsersRoles() {
    try {
      const users: UserDto[] = await this.userService.getUsers();
      if (users) {
        const timeMin = new Date(Date.now() - 30000);
        users.map(async (usersElement) => {
          const rooms: RoomDto[] = await this.roomService.getUserRooms(
            usersElement.id
          );
          rooms.map(async (roomsElement) => {
            const userRoom: UserRoomDto = await this.roomService.getUserInRoom(
              roomsElement.id,
              usersElement
            );
            if (
              userRoom.updated_at < timeMin &&
              (userRoom.role === Room_Role.BANNED ||
                userRoom.role === Room_Role.MUTED)
            ) {
              await this.roomService.udpateUsersStatus(
                roomsElement.id,
                usersElement,
                Room_Role.NORMAL
              );
            }
          });
        });
      }
    } catch (err) {
      return new WsException(err.message);
    }
  }

  @SubscribeMessage("client:disconnect")
  async onDisconnect(client: Socket) {
    try {
      if(!client || client === undefined)
        return;
      this.handleDisconnect(client);
    } catch (err) {
      throw new WsException(err.message);
    }
  }

  @SubscribeMessage("client:getuserrooms")
  async onGetUserRooms(client: Socket) {
    try {
      if(!client || client === undefined)
        return;
      const event = "server:getuserrooms";
      const rooms: RoomDto[] = await this.roomService.getUserRooms(
        client.data.user.id
      );
      if (!rooms) throw Error("No rooms found");
      const userRole: string[] = await this.getUserRoles(
        client.data.user,
        rooms
      );
      return { event, data: { rooms, userRole } };
    } catch (err) {
      throw new WsException(err.message);
    }
  }

  @SubscribeMessage("client:getusers")
  async onGetUsers(client: Socket) {
    try {
      if(!client || client === undefined)
        return;
      const event = "server:getusers";
      const tmp: UserDto[] = await this.userService.getUsers();
      const name: string = client.data.user.name;
      const users = this.filterItems(
        tmp,
        this.withoutUser,
        name as unknown as string[]
      );
      const status: string[] = [];
      for (let i = 0; i < users.length; i++) {
        if (this.getUserWith(users[i].name)[0]) status[i] = "online";
        else status[i] = "offline";
      }
      this.server.to(client.id).emit(event, { users, status });
    } catch (err) {
      throw new WsException(err.message);
    }
  }

  @SubscribeMessage("client:getroomusers")
  async onGetRoomUsers(client: Socket) {
    try {
      if(!client || client === undefined)
        return;
      let room: RoomDto;
      const event = "server:getroomusers";
      for (let i = 0; i < this.userInChat.length; i++) {
        if (
          this.userInChat[i].userId === client.id &&
          this.userInChat[i].room
        ) {
          room = this.userInChat[i].room;
        }
      }
      if (!room) throw Error("User is not in room");
      const users: UserDto[] = [];
      const user_room: UserRoomDto[] = await this.roomService.getRoomUsers(
        room.id
      );
      const status: string[] = [];
      let j = 0;
      for (let i = 0; i < user_room.length; i++) {
        const tmp = await this.userService.getUserById(user_room[i].userId);
        if (tmp.name !== client.data.user.name) {
          users[j] = tmp;
          if (this.getUserWith(users[j].name)[0]) status[j] = "online";
          else status[j] = "offline";
          j++;
        }
      }
      this.server.to(client.id).emit(event, { users, status });
    } catch (err) {
      throw new WsException(err.message);
    }
  }

  @SubscribeMessage("client:searchuser")
  async onSearchUser(
    client: Socket,
    payload: { contains: string; list: UserDto[] }
  ) {
    try {
      if(!client || client === undefined)
        return;
      const event = "server:searchuser";
      const users: UserDto[] = [];
      const status: string[] = [];
      let j = 0;
      if (payload.list) {
        for (let i = 0; i < payload.list.length; i++) {
          if (payload.list[i].name !== client.data.user.name) {
            if (payload.list[i].name.includes(payload.contains)) {
              users[j] = payload.list[i];
              if (this.getUserWith(users[j].name)[0]) status[j] = "online";
              else status[j] = "offline";
              j++;
            }
          }
        }
      }
      this.server.to(client.id).emit(event, { users, status });
    } catch (err) {
      throw new WsException(err.message);
    }
  }

  @SubscribeMessage("client:selectroom")
  async onSelectRoom(client: Socket, payload: string) {
    try {
      if(!client || client === undefined)
        return;
      let messages: MessageDto[];
      const authors: UserDto[] = [];
      const event = "server:getonselectmessages";
      const room: RoomDto = await this.roomService.getRoomByName(payload);
      if (!room) throw Error("No rooms found");
      for (let i = 0; i < this.userInChat.length; i++) {
        if (this.userInChat[i].userId === client.id) {
          if (this.userInChat[i].room)
            client.leave(this.userInChat[i].room.name);
          client.join(room.name);
          this.userInChat[i].room = room;
          const user: UserRoomDto = await this.roomService.getUserInRoom(
            room.id,
            client.data.user
          );
          user.role = await this.cleanStatus(client, user, room);
          if (user.role === "BANNED") throw Error("You are Banned");
          messages = await this.getRoomMessages(client.data.user, room);
        }
      }
      for (let i = 0; i < messages.length; i++) {
        authors[i] = await this.messageservice.getMessageUser(messages[i]);
      }
      this.server.to(client.id).emit(event, { messages, authors });
    } catch (err) {
      throw new WsException(err.message);
    }
  }

  @UsePipes(new ValidationPipe())
  @SubscribeMessage("client:createroom")
  async onCreateRoom(client: Socket, room: RoomDto) {
    try {
      if(!client || client === undefined)
        return;
      const event = "server:createroom";
      const userTest: UserDto = await this.userService.getUserByName(room.name);
      const roomTest: RoomDto = await this.roomService.getRoomByName(room.name);
      if (userTest && roomTest) throw Error("Room already exist");
      await this.roomService.createRoom(room, client.data.user);
      const rooms: RoomDto[] = await this.roomService.getUserRooms(
        client.data.user.id
      );
      const userRole: string[] = await this.getUserRoles(
        client.data.user,
        rooms
      );
      return { event, data: { rooms, userRole } };
    } catch (err) {
      throw new WsException(err.message);
    }
  }

  @UsePipes(new ValidationPipe())
  @SubscribeMessage("client:joinroom")
  async onJoinRoom(client: Socket, payload: RoomDto) {
    try {
      if(!client || client === undefined)
        return;
      const event = "server:joinroom";
      const joiner: UserDto[] = [];
      joiner[0] = await this.userService.getUserByName(client.data.user.name);
      if (!joiner[0]) throw Error("Joiner not found");
      const room: RoomDto = await this.roomService.getRoomByName(payload.name);
      const oldRooms: RoomDto[] = await this.roomService.getUserRooms(
        joiner[0].id
      );
      const check: RoomDto = oldRooms.find(({ name }) => name === payload.name);
      if (
        check &&
        (await this.roomService.getUserSatus(check.id, joiner[0])) ===
          Room_Role.BANNED
      )
        throw Error("User is ban");
      if (check) throw Error("User already in room");
      if (!room) throw Error("Room not found");
      if (
        (room.status === Room_Status.PROTECTED &&
          (await this.roomService.compareHash(
            room.password,
            payload.password
          ))) ||
        room.status === Room_Status.PUBLIC
      ) {
        await this.roomService.addUsers(room.id, joiner);
      } else if (room.status === Room_Status.PROTECTED)
        throw Error("Wrong password");
      else throw Error("You can't join this room");
      const rooms: RoomDto[] = await this.roomService.getUserRooms(
        client.data.user.id
      );
      const userRole: string[] = await this.getUserRoles(
        client.data.user,
        rooms
      );
      return { event, data: { rooms, userRole } };
    } catch (err) {
      throw new WsException(err.message);
    }
  }

  @UsePipes(new ValidationPipe())
  @SubscribeMessage("client:leaveroom")
  async onleaveRoom(client: Socket, payload: { name: string }) {
    try {
      if(!client || client === undefined)
        return;
      const event = "server:leaveroom";
      const leaver: UserDto = await this.userService.getUserByName(
        client.data.user.name
      );
      if (!leaver) throw Error("Creator not found");
      const oldRooms: RoomDto[] = await this.roomService.getUserRooms(
        leaver.id
      );
      const room: RoomDto = oldRooms.find(({ name }) => name === payload.name);
      if (!room) throw Error("Room not found");
      if (room.status === Room_Status.CONVERSATION)
        throw Error("You can't leave conversation");
      await this.roomService.removeUser(room.id, leaver);
      const rooms: RoomDto[] = await this.roomService.getUserRooms(
        client.data.user.id
      );
      const userRole: string[] = await this.getUserRoles(
        client.data.user,
        rooms
      );
      return { event, data: { rooms, userRole } };
    } catch (err) {
      throw new WsException(err.message);
    }
  }

  @UsePipes(new ValidationPipe())
  @SubscribeMessage("client:updateroom")
  async onUpdateRoom(client: Socket, room: RoomDto) {
    try {
      if(!client || client === undefined)
        return;
      const event = "server:updateroom";
      const roomTest: RoomDto = await this.roomService.getRoomByName(room.name);
      if (!roomTest) throw Error("Room doesn't exist");
      await this.roomService.updateRoom(roomTest, room.status, room.password);
      const rooms: RoomDto[] = await this.roomService.getUserRooms(
        client.data.user.id
      );
      const userRole: string[] = await this.getUserRoles(
        client.data.user,
        rooms
      );
      return { event, data: { rooms, userRole } };
    } catch (err) {
      throw new WsException(err.message);
    }
  }

  @UsePipes(new ValidationPipe())
  @SubscribeMessage("client:createconversation")
  async onCreateConversation(client: Socket, payload: { user: UserDto }) {
    try {
      if(!client || client === undefined)
        return;
      const event = "server:createconversation";
      let convs: RoomDto[] = await this.roomService.getRoomByConvName(
        client.data.user.name
      );
      let checkConvs: RoomDto = convs.find(
        ({ convName2 }) => convName2 === payload.user.name
      );
      if (checkConvs) throw Error("Conversation already exist");
      convs = await this.roomService.getRoomByConvName(payload.user.name);
      checkConvs = convs.find(
        ({ convName2 }) => convName2 === client.data.user.name
      );
      if (checkConvs) throw Error("Conversation already exist");
      const muters: UserDto[] = await this.userService.getMutedByUsers(
        client.data.user.name
      );
      const muted: UserDto[] = await this.userService.getMutedUsers(
        client.data.user.name
      );
      const checkMuters: UserDto = muters.find(
        ({ name }) => name === payload.user.name
      );
      const checkMuted: UserDto = muted.find(
        ({ name }) => name === payload.user.name
      );
      if (checkMuters) throw Error(`${checkMuters.name} blocked you`);
      if (checkMuted) throw Error(`You blocked ${checkMuted.name}`);
      const conv: RoomDto = {
        name: `conversation ${v4()}}`,
        status: Room_Status.CONVERSATION,
        convName1: client.data.user.name,
        convName2: payload.user.name,
      };
      await this.roomService.createRoom(conv, client.data.user);
      const rooms: RoomDto[] = await this.roomService.getUserRooms(
        client.data.user.id
      );
      const userRole: string[] = await this.getUserRoles(
        client.data.user,
        rooms
      );
      const userToAdd: UserDto[] = [];
      userToAdd[0] = payload.user;
      this.onJoinConversation(client, { conv, userToAdd });
      return { event, data: { rooms, userRole } };
    } catch (err) {
      throw new WsException(err.message);
    }
  }

  @SubscribeMessage("client:sendmessage")
  async onSendMessage(client: Socket, message: string) {
    try {
      if(!client || client === undefined)
        return;
      const event = "server:getmessages";
      const tmp: RoomDto = await this.getUserWith(client.data.user.name)[0]
        .room;
      if (!tmp) throw Error("User is not in room");
      const roomName: string = tmp.name;
      const rooms: RoomDto[] = await this.roomService.getUserRooms(
        client.data.user.id
      );
      const room: RoomDto = rooms.find(({ name }) => name === roomName);
      if (!room) throw Error("Room not found");
      const user = await this.roomService.getUserInRoom(
        room.id,
        client.data.user
      );
      user.role = await this.cleanStatus(client, user, room);
      if (user.role === Room_Role.BANNED) throw Error("You are Ban");
      if (user.role === Room_Role.MUTED) throw Error("You are mute");
      await this.messageservice.createMessage(
        room.id,
        client.data.user.id,
        message
      );
      this.emitToUsersInRoom(room, client.data.user.name, event);
    } catch (err) {
      throw new WsException(`Message: ${err.message}`);
    }
  }

  @UsePipes(new ValidationPipe())
  @SubscribeMessage("client:blockuser")
  async onBlockUser(client: Socket, payload: { user: UserDto }) {
    try {
      if(!client || client === undefined)
        return;
      await this.userService.muteUser(client.data.user.id, payload.user.id);
      const room: RoomDto = this.getUserWithId(client.id)[0].room;
      if (room) await this.onSelectRoom(client, room.name);
    } catch (err) {
      throw new WsException(err.message);
    }
  }

  @UsePipes(new ValidationPipe())
  @SubscribeMessage("client:unblockuser")
  async onUbBlockUser(client: Socket, payload: { user: UserDto }) {
    try {
      if(!client || client === undefined)
        return;
      await this.userService.unMuteUser(client.data.user.id, payload.user.id);
      const room: RoomDto = this.getUserWithId(client.id)[0].room;
      if (room) await this.onSelectRoom(client, room.name);
    } catch (err) {
      throw new WsException(err.message);
    }
  }

  @UsePipes(new ValidationPipe())
  @SubscribeMessage("client:updateuserrole")
  public async updateUserRole(
    client: Socket,
    payload: { user: UserDto; newRole: Room_Role }
  ) {
    try {
      if(!client || client === undefined)
        return;
      const event = "server:updateuserrole";
      const room = this.getUserWith(client.data.user.name)[0].room;
      if (!room) throw Error("User is not in Room");
      if (room.Room_Status === Room_Status.CONVERSATION)
        throw Error("You can change role in conversations");
      const updaterStatus = await this.roomService.getUserSatus(
        room.id,
        client.data.user
      );
      const toUpdateStatus = await this.roomService.getUserSatus(
        room.id,
        payload.user
      );
      if (!updaterStatus) throw Error("Unable to find updater in room");
      if (!toUpdateStatus) throw Error("Unable to find user to update in room");
      if (
        (updaterStatus == Room_Role.OWNER ||
          updaterStatus == Room_Role.ADMIN) &&
        toUpdateStatus != Room_Role.ADMIN &&
        toUpdateStatus != Room_Role.OWNER &&
        payload.newRole != Room_Role.OWNER
      ) {
        this.roomService.udpateUsersStatus(
          room.id,
          payload.user,
          payload.newRole
        );
      } else {
        throw Error("You do not have the right to do this action");
      }
      const res: string =
        payload.user.name + " is now " + payload.newRole + " in " + room.name;
      await this.emitRoomToUser(payload.user);
      return { event, data: { res } };
    } catch (err) {
      throw new WsException(err.message);
    }
  }

  @UsePipes(new ValidationPipe())
  @SubscribeMessage("client:addinprivateroom")
  async onAddToPrivateRoom(client: Socket, payload: { user: UserDto }) {
    try {
      if(!client || client === undefined)
        return;
      const event = "server:addinprivateroom";
      const room: RoomDto = this.getUserWith(client.data.user.name)[0].room;
      if (!room) throw Error("User is not in Room");
      if (room.status !== Room_Status.PRIVATE)
        throw Error("You must be in private room to add users");
      const isUserInRoom = await this.roomService.getUserInRoom(
        room.id,
        payload.user
      );
      if (isUserInRoom) throw Error("User already in room");
      const muters: UserDto[] = await this.userService.getMutedByUsers(
        client.data.user.name
      );
      const muted: UserDto[] = await this.userService.getMutedUsers(
        client.data.user.name
      );
      const checkMuters: UserDto = muters.find(
        ({ name }) => name === payload.user.name
      );
      const checkMuted: UserDto = muted.find(
        ({ name }) => name === payload.user.name
      );
      if (checkMuters) throw Error(`${checkMuters.name} blocked you`);
      if (checkMuted) throw Error(`You blocked ${checkMuted.name}`);
      const userRole = await this.roomService.getUserSatus(
        room.id,
        client.data.user
      );
      if (userRole === Room_Role.BANNED) throw Error("You are ban");
      if (userRole === Room_Role.MUTED) throw Error("You are ban");
      const userToAdd: UserDto[] = [];
      userToAdd[0] = payload.user;
      await this.onJoinPrivateRoom(client, { room, userToAdd });
      const res: string =
        payload.user.name + " added to " + room.name + " successfuly";
      return { event, data: { res } };
    } catch (err) {
      throw new WsException(err.message);
    }
  }
}
