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
      return { err };
    }
  }

  @Get(":name")
  @ApiParam({
    name: "identifier",
    required: true,
  })
  public async getUser(@Param() param) {
    try {
      const user: UserDto = await this.userService.getUserById(param.name);
      return { user };
    } catch (err) {
      return { err };
    }
  }

  @Post("/")
  public async createUser(@Body(new ValidationPipe()) user: UserDto) {
    try {
      await this.userService.addUser(user);
      return { response: "created sucessfuly" };
    } catch (err) {
      return { err };
    }
  }

  @Put("/:name")
  @ApiParam({
    name: "identifier",
    required: true,
  })
  public async updateUser(@Param() param, @Body() toUpdate: UserToUpdateDto) {
    try {
      await this.userService.updateUser(param.name, toUpdate);
      return { response: "updated sucessfuly" };
    } catch (err) {
      return { err };
    }
  }

  @Post("/:name/friend")
  @ApiParam({
    name: "identifier",
    required: true,
  })
  public async addFriend(@Param() param) {
    try {
      await this.userService.getUserById(param.name);
      return { response: "added friend sucessfuly" };
    } catch (err) {
      return { err };
    }
  }

  @Delete("/:name")
  @ApiParam({
    name: "identifier",
    required: true,
  })
  public async deleteUser(@Param() param) {
    try {
      console.log(param.name);
      await this.userService.deleteUser(param.name);
      return { response: "deleted sucessfuly" };
    } catch (err) {
      return { err };
    }
  }
}
