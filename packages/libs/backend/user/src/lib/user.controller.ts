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
// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import { JwtAuthGuard } from "../../../auth/src/lib/strategy/jwt-auth.guard";
import { UserService } from "./user.service";
import { ApiParam, ApiSecurity, ApiTags } from "@nestjs/swagger";

@Controller("user")
@UseGuards(JwtAuthGuard)
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
        throw new Error("You can't update this user");
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
        throw new Error("You can't delete this user");
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
      const i: number = friends.indexOf(user);
      friends.splice(i, 1);
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
  public async addFriend(@Body() request, @Param() param) {
    try {
      const user: UserDto = await this.userService.getUserByName(param.name);
      const userToAdd: UserDto = await this.userService.getUserByName(request.name);
      await this.userService.addFriend(user.name, userToAdd.id, user.id);
      await this.userService.removeFriendRequest(userToAdd.name, user);
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
      if (request.data.name_receiver == request.data.name_sender)
        throw new ForbiddenException("You can't send yourself a friend request");


      let i: number = 0;
      const friends: UserDto[] = await this.userService.getFriends(request.data.name_sender);
      while (friends[i])
      {
        if (friends[i].name == request.data.name_receiver)
          throw new ForbiddenException("This user is already your friend");
      }

      user = await this.userService.getUserByName(request.data.name_receiver);
      if (!user)
        throw new NotFoundException("This username is not associated with any account.");
      user = await this.userService.addFriendRequest(request.data.name_sender, user);
      if (!user)
        throw new ForbiddenException("You can't update this user");
      return { response: "friend request send sucessfuly" };

  }

  @Post("/:name/remove_friend_request")
  @ApiParam({
    name: "name",
    required: true,
  })
  public async removeFriendRequest(@Body() request: any, @Param() param) {
    let user: UserDto;
      user = await this.userService.getUserByName(param.name);
      if (!user)
        throw new NotFoundException("This username is not associated with any account.");
      user = await this.userService.removeFriendRequest(request.name_to_delete, user);
      if (!user)
        throw new ForbiddenException("You can't update this user");
      return { response: "friend request send sucessfuly" };

  }

  @Get("/:name/friend_request")
  @ApiParam({
    name: "name",
    required: true,
  })
  public async getFriendRequest(@Param() param) {
      const user: UserDto = await this.userService.getUserByName(param.name);
      if (!user)
        throw new NotFoundException("This username is not associated with any account.");
      return { friendsRequest: user.friendsRequest };
  }

  @Post(":name/remove_friend")
  @ApiParam({
    name: "name",
    required: true,
  })
  public async deleteFirend(@Body() request, @Param() param) {
    try {
      console.log("HERE");
      console.log(param.name);
      console.log(request.name);
      const user: UserDto = await this.userService.getUserByName(param.name);
      const userToDel: UserDto = await this.userService.getUserByName(request.name);
      await this.userService.removeFriend(user.name, userToDel.id);
      return { response: "deleted sucessfuly" };
    } catch (err) {
      return new UnauthorizedException(err);
    }
  }
}
