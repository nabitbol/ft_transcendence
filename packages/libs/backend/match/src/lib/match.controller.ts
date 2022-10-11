import { MatchDto, UserDto } from "@ft-transcendence/libs-shared-types";
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
  NotFoundException,
} from "@nestjs/common";
import { MatchService } from "./match.service";
import { JwtTwoFactorGuard } from "@ft-transcendence/libs-backend-auth";
import { ApiParam, ApiSecurity, ApiTags } from "@nestjs/swagger";

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
      matches.map((element) => {
        console.log(element.playersName);
      });
      return { matches };
    } catch (err) {
      return new NotFoundException(err);
    }
  }

  @Get(":name")
  @ApiParam({
    name: "name",
    required: true,
  })
  public async getMatchesByUser(@Param() param) {
    try {
      const id: string = (await this.userService.getUserByName(param.name)).id;
      if (!id)
        throw Error("Users not found");
      const matches: MatchDto[] = await this.matchService.getMatchesByUser(id);
      return { matches };
    } catch (err) {
      return new NotFoundException(err);
    }
  }

  @Post()
  public async addMatches(@Body(new ValidationPipe()) match: MatchDto) {
    try {

      if(!await this.userService.getUserByName(match.looser) || 
          !await this.userService.getUserByName(match.winner))
      {
        throw Error("Winner or looser not found");
      }

      for (let index = 0; index < match.playersName.length; index++) {
        const tmp: UserDto = await this.userService.getUserByName(
          match.playersName[index]
        );
        if (!tmp)
          throw Error("User not found");
        match.players[index] = tmp["id"];
      }
      await this.matchService.addMatches(match);
      return { response: "Match added sucessfully" };
    } catch (err) {
      return new NotFoundException(err);
    }
  }
}
