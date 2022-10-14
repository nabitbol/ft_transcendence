import { Module } from "@nestjs/common";

import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { UserModule, UserService } from "@ft-transcendence/libs-backend-user";
import {
  MatchModule,
  MatchService,
} from "@ft-transcendence/libs-backend-match";
import { AuthModule } from "@ft-transcendence/libs-backend-auth";
import {
  ChatModule,
  ChatService,
  RoomService,
} from "@ft-transcendence/libs-backend-chat";

@Module({
  imports: [UserModule, MatchModule, AuthModule, ChatModule],
  controllers: [AppController],
  providers: [AppService, UserService, MatchService, ChatService, RoomService],
})
export class AppModule {}
