import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
} from "@nestjs/websockets";
import { Socket } from "dgram";

@WebSocketGateway(8080, {
  cors: {
    origin: ["https://hoppscotch.io", "http://localhost:4200"],
    credentials: true,
  },
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @SubscribeMessage("chat:message")
  handleMessage(client: Socket, payload: string) {
    client.emit("chat:message", "Hello world!");
  }

  handleConnection(client: Socket, ...args: any[]) {
    console.log(client + "connected");
  }

  handleDisconnect(client: Socket) {
    console.log(client + "disconnected");
    client.disconnect();
  }
}
