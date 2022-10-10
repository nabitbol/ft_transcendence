import { MatchDto } from "@ft-transcendence/libs-shared-types";
import { UserService } from "@ft-transcendence/libs-backend-user";
import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  ValidationPipe,
  Inject,
  UseGuards,
} from "@nestjs/common";
import { MatchService } from "./match.service";
import { JwtTwoFactorGuard } from "@ft-transcendence/libs-backend-auth";
import { ApiSecurity, ApiTags } from "@nestjs/swagger";

@UseGuards(JwtTwoFactorGuard)
@Controller("match")
@ApiSecurity("JWT-auth")
@ApiTags("match")
export class MatchController {
  constructor(private matchService: MatchService) {}

  @Inject(UserService)
  private readonly userService: UserService;

  @Get()
  public async getMatches() {
    try {
      const matches: MatchDto[] = await this.matchService.getAllMatches();
      return { matches };
    } catch (err) {
      throw Error("Users not found");
    }
  }

  @Get(":name")
  public async getUserMatches(@Param() param) {
    try {
      const id: string = await (
        await this.userService.getUserByName(param.name)
      ).id;
      const matches: MatchDto[] = await this.matchService.getUserMatches(id);
      return { matches };
    } catch (err) {
      throw Error("Users not found");
    }
  }

  @Post()
  public async addMatches(@Body(new ValidationPipe()) match: MatchDto) {
    try {
      await this.matchService.addMatches(match);
      return { response: "Match added sucessfully" };
    } catch (err) {
      throw Error("Users not found");
    }
  }
}
