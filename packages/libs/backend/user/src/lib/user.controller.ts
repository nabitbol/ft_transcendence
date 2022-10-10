import { UserDto, UserToUpdateDto } from "@ft-transcendence/libs-shared-types";
import {
  Controller,
  Delete,
  Get,
  Post,
  Put,
  Param,
  Body,
  ValidationPipe,
  NotFoundException,
  ForbiddenException,
  Req,
} from "@nestjs/common";
import { UserService } from "./user.service";
import { ApiParam } from "@nestjs/swagger";

@Controller("user")
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

  @Post("/")
  public async createUser(@Body(new ValidationPipe()) user: UserDto) {
    try {
      await this.userService.addUser(user);
      return { response: "created sucessfuly" };
    } catch (err) {
      return new ForbiddenException(err);
    }
  }

  @Put("/:name")
  @ApiParam({
    name: "name",
    required: true,
  })
  public async updateUser(@Param() param, @Body() toUpdate: UserToUpdateDto) {
    try {
      await this.userService.updateUser(param.name, toUpdate);
      return { response: "updated sucessfuly" };
    } catch (err) {
      return new ForbiddenException(err);
    }
  }

  @Post("/:name/friend")
  @ApiParam({
    name: "name",
    required: true,
  })
  public async addFriend(@Param() param) {
    try {
      await this.userService.getUserByName(param.name);
      return { response: "added friend sucessfuly" };
    } catch (err) {
      return new NotFoundException(err);
    }
  }

  @Post("/:name/friend_request")
  @ApiParam({
    name: "name",
    required: true,
  })
  public async addFriendRequest(@Body() request: any) {
    let user: UserDto;
      user = await this.userService.getUserByName(request.data.name_receiver);
      if (!user)
        throw new NotFoundException("This username is not associated with any account.");
      user = await this.userService.addFriendRequest(request.data.name_sender, user);
      if (!user)
        throw new ForbiddenException("You can't update this user");
      return { response: "friend request send sucessfuly" };

  }

  @Delete("/:name")
  @ApiParam({
    name: "name",
    required: true,
  })
  public async deleteUser(@Param() param) {
    try {
      await this.userService.deleteUser(param.name);
      return { response: "deleted sucessfuly" };
    } catch (err) {
      return new ForbiddenException(err);
    }
  }
}
