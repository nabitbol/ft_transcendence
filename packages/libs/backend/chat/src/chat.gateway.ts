import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
} from "@nestjs/websockets";
import { Socket } from "socket.io";
import { jwtConstants } from "@ft-transcendence/libs-backend-auth";
import { UserService } from "@ft-transcendence/libs-backend-user";
import { UnauthorizedException } from "@nestjs/common";
// eslint-disable-next-line @typescript-eslint/no-var-requires
const jwt = require("jsonwebtoken");

@WebSocketGateway(8080, {
  cors: {
    origin: ["https://hoppscotch.io", "http://localhost:4200"],
    credentials: true,
  },
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(private userService: UserService) {}

  @SubscribeMessage("message")
  handleMessage(client: Socket, payload: string) {
    client.emit("message", "Hello world!");
    return "hello";
  }

  async handleConnection(client: Socket, ...args: any[]) {
    try {
      const bearerToken = client.handshake.headers.authorization.split(" ")[1];
      const decoded = await jwt.verify(bearerToken, jwtConstants.secret);
      const user = await this.userService.getUserByName(decoded.name);
      if (!user) return this.disconnect(client);
      console.log("User: " + user.name + " join the chat");
    } catch (err) {
      return this.disconnect(client);
    }
  }

  handleDisconnect(client: Socket) {
    this.disconnect(client);
  }

  private disconnect(client: Socket) {
    client.emit("Error", new UnauthorizedException());
    client.disconnect();
  }
}
