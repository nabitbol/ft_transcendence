import { Module } from "@nestjs/common";
import { ChatController } from "./chat.controller";
import { ChatService } from "./chat.service";
import { ChatGateway } from "../chat.gateway";
import { RoomService } from "./room/room.service";
import { UserModule } from "@ft-transcendence/libs-backend-user";
import { MessageService } from './message/message.service';

@Module({
  imports: [UserModule],
  controllers: [ChatController],
  providers: [ChatService, RoomService, ChatGateway, MessageService],
  exports: [ChatService, RoomService, ChatGateway],
})
export class ChatModule {}
