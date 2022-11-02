import { Module } from "@nestjs/common";

import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { UserModule, UserService } from "@ft-transcendence/libs-backend-user";
import {
  MatchModule,
  MatchService,
} from "@ft-transcendence/libs-backend-match";
import { GameModule } from "@ft-transcendence/libs/backend/game";
import { JwtService } from "@nestjs/jwt";
import { AuthModule } from "@ft-transcendence/libs-backend-auth";

import {
  ChatModule,
  ChatService,
  RoomService,
} from "@ft-transcendence/libs-backend-chat";

@Module({
  imports: [UserModule, MatchModule, AuthModule, GameModule, ChatModule],
  controllers: [AppController],
  providers: [
    AppService,
    UserService,
    MatchService,
    JwtService,
    ChatService,
    RoomService,
  ],
})
export class AppModule {}
