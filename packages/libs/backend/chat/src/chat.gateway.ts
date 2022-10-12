import { UseGuards } from "@nestjs/common";
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
} from "@nestjs/websockets";
import { Socket } from "dgram";

@WebSocketGateway(8080, { cors: { origin: "https://hoppscotch.io" } })
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @SubscribeMessage("message")
  handleMessage(client: Socket, payload: any): string {
    return "Hello world!";
  }

  handleConnection(client: Socket, ...args: any[]) {
    console.log(client + "connected");
  }

  handleDisconnect(client: Socket) {
    console.log(client + "disconnected");
    client.disconnect();
  }
}
