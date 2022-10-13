import { Module } from "@nestjs/common";
import { ChatController } from "./chat.controller";
import { ChatService } from "./chat.service";
import { ChatGateway } from "../chat.gateway";
import { RoomService } from "./room/room.service";
import { UserModule } from "@ft-transcendence/libs-backend-user";

@Module({
  imports: [UserModule],
  controllers: [ChatController],
  providers: [ChatService, ChatGateway, RoomService],
  exports: [ChatService, ChatGateway, RoomService],
})
export class ChatModule {}
