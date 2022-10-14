import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { jwtConstants } from "@ft-transcendence/libs-backend-auth";
import { UserService } from "@ft-transcendence/libs-backend-user";
import { RoomService } from "./lib/room/room.service";
import { NotFoundException, UnauthorizedException } from "@nestjs/common";
import { RoomDto } from "@ft-transcendence/libs-shared-types";
// eslint-disable-next-line @typescript-eslint/no-var-requires
const jwt = require("jsonwebtoken");

@WebSocketGateway(5555, {
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

  @SubscribeMessage("paginationRoom")
  async onPaginationRoom(client: Socket) {
    try {
      const rooms: RoomDto[] = await this.roomService.getUserRooms(
        client.data.user.id
      );
      if (!rooms) throw Error("No rooms found");
      this.server.to(client.id).emit("room", rooms);
    } catch (err) {
      client.emit("Error", new NotFoundException(err));
    }
  }
}
