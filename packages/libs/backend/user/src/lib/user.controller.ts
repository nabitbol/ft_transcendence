import {
  AchievementDto,
  UserDto,
  UserToUpdateDto,
} from "@ft-transcendence/libs-shared-types";
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
      if (req.user.name !== param.name) {
        if (!(await this.userService.getUserByName(param.name)))
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
      if (req.user.name !== param.name) {
        if (!(await this.userService.getUserByName(param.name)))
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
      const userToAdd: UserDto = await this.userService.getUserByName(
        request.name
      );
      await this.userService.addFriend(user.name, userToAdd.id);
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

    let i = 0;
    const friends: UserDto[] = await this.userService.getFriends(
      request.data.name_sender
    );
    while (friends[i]) {
      if (friends[i].name == request.data.name_receiver)
        throw new ForbiddenException("This user is already your friend");
      i++;
    }

    user = await this.userService.getUserByName(request.data.name_receiver);
    if (!user)
      throw new NotFoundException(
        "This username is not associated with any account."
      );
    user = await this.userService.addFriendRequest(
      request.data.name_sender,
      user
    );
    if (!user) throw new ForbiddenException("You can't update this user");
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
      throw new NotFoundException(
        "This username is not associated with any account."
      );
    user = await this.userService.removeFriendRequest(
      request.name_to_delete,
      user
    );
    if (!user) throw new ForbiddenException("You can't update this user");
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
      throw new NotFoundException(
        "This username is not associated with any account."
      );
    return { friendsRequest: user.friendsRequest };
  }

  @Post(":name/remove_friend")
  @ApiParam({
    name: "name",
    required: true,
  })
  public async deleteFriend(@Body() request, @Param() param) {
    try {
      const user: UserDto = await this.userService.getUserByName(param.name);
      const userToDel: UserDto = await this.userService.getUserByName(
        request.name
      );
      await this.userService.removeFriend(user.name, userToDel.id);
      return { response: "deleted sucessfuly" };
    } catch (err) {
      return new UnauthorizedException(err);
    }
  }

  @Get(":name/general_ladder")
  @ApiParam({
    name: "name",
    required: true,
  })
  public async getGeneralLadder() {
    try {
      const response: UserDto[] = await this.userService.getGeneralLadder();
      await this.userService.updateLadderLevel(response);
      return { response: response };
    } catch (err) {
      return new UnauthorizedException(err);
    }
  }

  @Get(":name/friend_ladder")
  @ApiParam({
    name: "name",
    required: true,
  })
  public async getFriendLadder(@Param() param) {
    try {
      let i = 0;
      const response: UserDto[] = await this.userService.getFriendLadder(
        param.name
      );
      while (response[i]) {
        response[i].ladder_level = i + 1;
        i++;
      }
      return { response: response };
    } catch (err) {
      return new UnauthorizedException(err);
    }
  }

  @Get(":name/update_achievement")
  @ApiParam({
    name: "name",
    required: true,
  })
  public async updateUserAchievement(@Param() param) {
    try {
      const achievement: AchievementDto[] =
        await this.userService.getAchievement();
      const user: UserDto = await this.userService.getUserByName(param.name);
      await this.userService.updateUserAchievement(achievement, user);
    } catch (err) {
      return new UnauthorizedException(err);
    }
  }

  @Get(":name/achievement")
  @ApiParam({
    name: "name",
    required: true,
  })
  public async getAchievement() {
    try {
      const response: AchievementDto[] =
        await this.userService.getAchievement();
      console.log(response);
      return { response: response };
    } catch (err) {
      return new UnauthorizedException(err);
    }
  }

  @Get(":name/user_achievement")
  @ApiParam({
    name: "name",
    required: true,
  })
  public async getUserAchievement(@Param() param) {
    try {
      const response: AchievementDto[] =
        await this.userService.getUserAchievement(param.name);
      return { response: response };
    } catch (err) {
      return new UnauthorizedException(err);
    }
  }

  @Post("/:name/image")
  @ApiParam({
    name: "name",
    required: true,
  })
  public async changeImage(@Body() request: any, @Param() param) {
    const user: UserDto = await this.userService.getUserByName(param.name);
    if (!user)
      throw new NotFoundException(
        "This username is not associated with any account."
      );
    await this.userService.changeImage(request.file, user);
  }

  @Put("/:name/name")
  @ApiParam({
    name: "name",
    required: true,
  })
  public async changeName(@Body() request: any, @Param() param) {
    const user: UserDto = await this.userService.getUserByName(param.name);
    if (!user)
      throw new NotFoundException(
        "This username is not associated with any account."
      );
    return await this.userService.changeName(request.name, user);
  }
}
