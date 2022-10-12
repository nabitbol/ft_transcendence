import { SubscribeMessage, WebSocketGateway } from "@nestjs/websockets";
import { Socket } from "dgram";

@WebSocketGateway(8080, { cors: { origin: "https://hoppscotch.io" } })
export class ChatGateway {
  @SubscribeMessage("message")
  handleMessage(client: any, payload: any): string {
    return "Hello world!";
  }
}
