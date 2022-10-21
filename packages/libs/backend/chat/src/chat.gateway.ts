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
    try {
      const bearerToken = client.handshake.headers.authorization.split(" ")[1];
      const decoded = await jwt.verify(bearerToken, jwtConstants.secret);
      const user = await this.userService.getUserByName(decoded.name);
      if (!user) return this.disconnect(client);
      client.data.user = user;
      this.userInChat.push({
        userId: client.id,
        user: user,
      });
      console.log("User: " + user.name + " joined the chat");
    } catch (err) {
      return this.disconnect(client);
    }
  }

  handleDisconnect(client: Socket) {
    console.log("User " + client.data.user.name + " leaved the chat");
    this.userInChat = this.getUserWithout(client.data.user.name);
    this.disconnect(client);
  }

  private disconnect(client: Socket) {
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

  /* --------------------------- Room event handlers -------------------------- */

  @SubscribeMessage("client:getuserrooms")
  async onGetUserRooms(client: Socket) {
    try {
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
      if (!room) throw Error("User not in room");
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
      console.log(users);
      this.server.to(client.id).emit(event, { users, status });
    } catch (err) {
      throw new WsException(err.message);
    }
  }

  @SubscribeMessage("client:selectroom")
  async onSelectRoom(client: Socket, payload: string) {
    try {
      let messages: MessageDto[];
      let userMessages: string[];
      const event = "server:getroommessages";
      const room: RoomDto = await this.roomService.getRoomByName(payload);
      if (!room) throw Error("No rooms found");
      for (let i = 0; i < this.userInChat.length; i++) {
        if (this.userInChat[i].userId === client.id) {
          this.userInChat[i].room = room;
          messages = await this.getRoomMessages(client.data.user, room);
        }
      }
      for (let i = 0; i < messages.length; i++) {
        userMessages[i] = await this.messageservice.getMessageUser(messages[i]);
      }
      return { event, data: { messages, userMessages } };
    } catch (err) {
      throw new WsException(err.message);
    }
  }

  @UsePipes(new ValidationPipe())
  @SubscribeMessage("client:createroom")
  async onCreateRoom(client: Socket, room: RoomDto) {
    try {
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
        (room.status === "PROTECTED" &&
          (await this.roomService.compareHash(
            room.password,
            payload.password
          ))) ||
        (room.status !== "PROTECTED" &&
          room.status !== Room_Status.CONVERSATION)
      ) {
        await this.roomService.addUsers(room.id, joiner);
      } else throw Error("Wrong password");
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
      return new UnauthorizedException(err);
    }
  }

  @UsePipes(new ValidationPipe())
  @SubscribeMessage("client:createconversation")
  async onCreateConversation(client: Socket, payload: UserDto) {
    try {
      const event = "server:createconversation";
      const user: UserDto = await this.userService.getUserByName(payload.name);
      const conv: RoomDto = {
        name: `conversation ${v4()}}`,
        status: Room_Status.CONVERSATION,
        convName1: client.data.user.name,
        convName2: user.name,
      };
      await this.roomService.createRoom(conv, client.data.user);
      const rooms: RoomDto[] = await this.roomService.getUserRooms(
        client.data.user.id
      );
      const userRole: string[] = await this.getUserRoles(
        client.data.user,
        rooms
      );
      const userToAdd: UserDto[] = [user];
      this.onJoinConversation(client, { conv, userToAdd });
      return { event, data: { rooms, userRole } };
    } catch (err) {
      throw new WsException(err.message);
    }
  }

  async onJoinConversation(
    client: Socket,
    payload: { conv: RoomDto; userToAdd: UserDto[] }
  ) {
    try {
      const event = "server:joinconversation";
      await this.roomService.addUsers(payload.conv.id, payload.userToAdd);
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
}
