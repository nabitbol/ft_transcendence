import { Module } from "@nestjs/common";

import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { UserController, UserService } from "@ft-transcendence/libs-backend-user";
import { MatchController, MatchService } from "@ft-transcendence/libs-backend-match";

@Module({
  imports: [],
  controllers: [AppController, UserController, MatchController],
  providers: [AppService, UserService, MatchService],
})
export class AppModule {}
