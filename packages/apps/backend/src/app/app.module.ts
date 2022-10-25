import { Module } from "@nestjs/common";

import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { UserModule, UserService } from "@ft-transcendence/libs-backend-user";
import {
  MatchModule,
  MatchService,
} from "@ft-transcendence/libs-backend-match";
import { AuthModule } from "@ft-transcendence/libs-backend-auth";
import { JwtService } from "@nestjs/jwt";

@Module({
  imports: [UserModule, MatchModule, AuthModule],
  controllers: [AppController],
  providers: [AppService, UserService, MatchService, JwtService],
})
export class AppModule {}
