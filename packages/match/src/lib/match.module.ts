import { UserModule } from "@ft-transcendence/user";
import { Module } from "@nestjs/common";
import { MatchController } from "./match.controller";
import { MatchService } from "./match.service";

@Module({
  imports: [UserModule],
  controllers: [MatchController],
  providers: [MatchService],
  exports: [MatchService],
})
export class MatchModule {}
