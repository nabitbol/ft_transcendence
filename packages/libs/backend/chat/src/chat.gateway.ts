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
import {
  ConsoleLogger,
  UnauthorizedException,
  UsePipes,
  ValidationPipe,
} from "@nestjs/common";
import {
  RoomDto,
  UserDto,
  UserRoomDto,
} from "@ft-transcendence/libs-shared-types";
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
    private roomService: RoomService
  ) {}

  @WebSocketServer()
  server: Server;

  async handleConnection(client: Socket, ...args: any[]) {
    try {
      const bearerToken = client.handshake.headers.authorization.split(" ")[1];
      const decoded = await jwt.verify(bearerToken, jwtConstants.secret);
      const user = await this.userService.getUserByName(decoded.name);
      if (!user) return this.disconnect(client);
      client.data.user = user;
      console.log("User: " + user.name + " join the chat");
    } catch (err) {
      return this.disconnect(client);
    }
  }

  handleDisconnect(client: Socket) {
    console.log("deco");
    this.disconnect(client);
  }

  private disconnect(client: Socket) {
    client.emit("Error", new UnauthorizedException());
    client.disconnect();
  }

  @SubscribeMessage("chat:message")
  handleMessage(client: Socket, payload: string) {
    client.emit("chat:message", "Hello world!");
    return "hello";
  }

  getUserRoles = async (user: UserDto, rooms: RoomDto[]) => {
    const userRole: string[] = [];
    for (let i = 0; i < rooms.length; i++) {
      userRole.push(await this.roomService.getUserSatus(rooms[i].id, user));
    }
    return userRole;
  };

  /* ---------------------------------- Room ---------------------------------- */

  @SubscribeMessage("client:getuserrooms")
  async onGetUserRooms(client: Socket) {
    try {
      console.log(client.data.user);
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

  @UsePipes(new ValidationPipe())
  @SubscribeMessage("client:createroom")
  async onCreateRoom(client: Socket, room: RoomDto) {
    try {
      console.log(room);
      console.log(client.data.user);
      const event = "server:createroom";
      await this.roomService.createRoom(room, client.data.user);
      const rooms: RoomDto[] = await this.roomService.getUserRooms(
        client.data.user.id
      );
      const userRole: string[] = await this.getUserRoles(
        client.data.user,
        rooms
      );
      console.log(userRole);
      return { event, data: { rooms, userRole } };
    } catch (err) {
      throw new WsException(err.message);
    }
  }
}
