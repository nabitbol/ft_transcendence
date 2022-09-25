import { Module } from "@nestjs/common";

import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { UserController, UserService } from "@ft-transcendence/user";
import { MatchController, MatchService } from "@ft-transcendence/match";

@Module({
  imports: [],
  controllers: [AppController, UserController, MatchController],
  providers: [AppService, UserService, MatchService],
})
export class AppModule {}
