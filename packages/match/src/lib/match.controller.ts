import { MatchDto } from "@ft-transcendence/types";
import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  ValidationPipe,
} from "@nestjs/common";
import { MatchService } from "./match.service";
import { UserService } from "@ft-transcendence/user";

@Controller("match")
export class MatchController {
  constructor(
    private matchService: MatchService,
    private userSevrice: UserService
  ) {}

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
      const id: string = userService.getUserByName(param.name);
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
