import { UserDto, UserToUpdateDto } from "@ft-transcendence/libs-shared-types";
import {
  Controller,
  Delete,
  Get,
  Post,
  Put,
  Req,
  Param,
  Body,
  ValidationPipe,
  UnauthorizedException,
  NotFoundException,
  ForbiddenException,
  UseGuards,
} from "@nestjs/common";
 
import { JwtTwoFactorGuard } from "../../../auth/src/lib/strategy/jwt-two-factor.guard";
import { UserService } from "./user.service";
import { ApiParam, ApiSecurity, ApiTags } from "@nestjs/swagger";

@UseGuards(JwtTwoFactorGuard)
@Controller("user")
@ApiSecurity("JWT-auth")
@ApiTags("User")
export class UserController {
  constructor(private userService: UserService) {}

  @Get()
  public async getUsers() {
    try {
      const users: UserDto[] = await this.userService.getUsers();
      return { users };
    } catch (err) {
      return new NotFoundException(err);
    }
  }

  // Todo in the futur delete this function
  @Post("/")
  public async createUser(@Body(new ValidationPipe()) user: UserDto) {
    try {
      await this.userService.addUser(user);
      return { response: "created sucessfuly" };
    } catch (err) {
      return new ForbiddenException(err);
    }
  }

  @Get(":name")
  @ApiParam({
    name: "name",
    required: true,
  })
  public async getUser(@Param() param) {
    try {
      const user: UserDto = await this.userService.getUserByName(param.name);
      return { user };
    } catch (err) {
      return new NotFoundException(err);
    }
  }

  @Put(":name")
  @ApiParam({
    name: "name",
    required: true,
  })
  public async updateUser(
    @Req() req,
    @Param() param,
    @Body() toUpdate: UserToUpdateDto
  ) {
    try {
      if (req.user.name !== param.name)
      {
        if(!await this.userService.getUserByName(param.name))
          throw new Error("This user doesn't exist !");
        throw new Error("You can't update this user");
      }
      await this.userService.updateUser(param.name, toUpdate);
      return { response: "updated sucessfuly" };
    } catch (err) {
      return new ForbiddenException(err);
    }
  }

  @Delete(":name")
  @ApiParam({
    name: "name",
    required: true,
  })
  public async deleteUser(@Req() req, @Param() param) {
    try {
      if (req.user.name !== param.name)
      {
        if(!await this.userService.getUserByName(param.name))
          throw new Error("This user doesn't exist !");
        throw new Error("You can't delete this user");
      }
      await this.userService.deleteUser(param.name);
      return { response: "deleted sucessfuly" };
    } catch (err) {
      return new UnauthorizedException(err);
    }
  }

  @Get(":name/friend")
  @ApiParam({
    name: "name",
    required: true,
  })
  public async getFriends(@Param() param) {
    try {
      const user: UserDto = await this.userService.getUserByName(param.name);
      const friends: UserDto[] = await this.userService.getFriends(user.name);
      friends.pop();
      return { response: friends };
    } catch (err) {
      return new NotFoundException(err);
    }
  }

  @Post(":name/friend")
  @ApiParam({
    name: "name",
    required: true,
  })
  public async addFriend(@Req() req, @Param() param) {
    try {
      const user: UserDto = await this.userService.getUserByName(req.user.name);
      const userToAdd: UserDto = await this.userService.getUserByName(
        param.name
      );
      await this.userService.addFriend(user.name, userToAdd.id, user.id);
      return { response: "added friend sucessfuly" };
    } catch (err) {
      return new NotFoundException(err);
    }
  }

  @Delete(":name/friend")
  @ApiParam({
    name: "name",
    required: true,
  })
  public async deleteFriend(@Req() req, @Param() param) {
    try {
      const user: UserDto = await this.userService.getUserByName(req.user.name);
      const userToAdd: UserDto = await this.userService.getUserByName(
        param.name
      );
      await this.userService.removeFriend(user.name, userToAdd.id, user.id);
      return { response: "deleted sucessfuly" };
    } catch (err) {
      return new UnauthorizedException(err);
    }
  }
}
