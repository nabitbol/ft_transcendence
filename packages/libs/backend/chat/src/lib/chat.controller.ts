import {
  Body,
  Controller,
  Get,
  Inject,
  NotFoundException,
  Param,
  Post,
  Put,
  Req,
  UnauthorizedException,
  UseGuards,
  ValidationPipe,
} from "@nestjs/common";
import { ApiParam, ApiSecurity, ApiTags } from "@nestjs/swagger";
import { RoomService } from "./room/room.service";
import { UserService } from "@ft-transcendence/libs-backend-user";
import { JwtTwoFactorGuard } from "@ft-transcendence/libs-backend-auth";
import {
  MessageDto,
  RoomDto,
  UserDto,
  UserRoomDto,
} from "@ft-transcendence/libs-shared-types";
import { MessageService } from "./message/message.service";
import { Room_Role } from "@prisma/client";

@UseGuards(JwtTwoFactorGuard)
@Controller("chat")
@ApiSecurity("JWT-auth")
@ApiTags("Chat")
@Controller("chat")
export class ChatController {
  constructor(
    private roomService: RoomService,
    private messageService: MessageService
  ) {}

  @Inject(UserService)
  private readonly userService: UserService;

  @Get("/rooms")
  public async getRooms() {
    try {
      const rooms: RoomDto[] = await this.roomService.getPublicRooms();
      return { rooms: rooms };
    } catch (err) {
      return new NotFoundException(err);
    }
  }

  @Post("/create_room")
  public async createRoom(
    @Body(new ValidationPipe()) room: RoomDto,
    @Req() req
  ) {
    try {
      const creator: UserDto = await this.userService.getUserByName(
        req.user.name
      );
      if (!creator) throw Error("Creator not found");
      await this.roomService.createRoom(room, creator);
      return { response: "Room created sucessfully" };
    } catch (err) {
      return new UnauthorizedException(err);
    }
  }

  @Get("/:name/room_users")
  @ApiParam({
    name: "name",
    required: true,
  })
  public async getRoomUsers(@Param() param) {
    try {
      const users: UserDto[] = [];
      const room: RoomDto = await this.roomService.getRoomByName(param.name);
      const user_room: UserRoomDto[] = await this.roomService.getRoomUsers(
        room.id
      );
      for (let i = 0; i < user_room.length; i++) {
        users[i] = await this.userService.getUserById(user_room[i].userId);
      }
      return { response: users };
    } catch (err) {
      return new NotFoundException(err);
    }
  }

  @Get("/user_rooms")
  public async getUserRooms(@Req() req) {
    try {
      const rooms: RoomDto[] = await this.roomService.getUserRooms(req.user.id);
      if (!rooms) throw Error("No rooms found");
      return { response: rooms };
    } catch (err) {
      return new NotFoundException(err);
    }
  }

  @Put("/:name/join_room")
  @ApiParam({ name: "name", required: true })
  public async joinRoom(
    @Param() param,
    @Req() req,
    @Body() body: { password?: string }
  ) {
    try {
      const joiner: UserDto[] = [];
      joiner[0] = await this.userService.getUserByName(req.user.name);
      if (!joiner[0]) throw Error("Joiner not found");
      const room: RoomDto = await this.roomService.getRoomByName(param.name);
      const rooms: RoomDto[] = await this.roomService.getUserRooms(
        joiner[0].id
      );
      const check: RoomDto = rooms.find(({ name }) => name === param.name);
      if (
        check &&
        (await this.roomService.getUserSatus(check.id, joiner[0])) ===
          Room_Role.BANNED
      )
        throw Error("User is ban");
      if (check) throw Error("User already in room");
      if (!room) throw Error("Room not found");
      if (
        (room.status === "PROTECTED" &&
          (await this.roomService.compareHash(room.password, body.password))) ||
        room.status !== "PROTECTED"
      ) {
        await this.roomService.addUsers(room.id, joiner);
      } else throw Error("Wrong password");
      return { response: "Joined room sucessfully" };
    } catch (err) {
      return new UnauthorizedException(err);
    }
  }

  @Put("/:name/leave_room")
  @ApiParam({ name: "name", required: true })
  public async leaveRoom(@Param() param, @Req() req) {
    try {
      const leaver: UserDto = await this.userService.getUserByName(
        req.user.name
      );
      if (!leaver) throw Error("Creator not found");
      const rooms: RoomDto[] = await this.roomService.getUserRooms(leaver.id);
      const room: RoomDto = rooms.find(({ name }) => name === param.name);
      if (!room) throw Error("Room not found");
      await this.roomService.removeUser(room.id, leaver);
      return { response: "Leaved room sucessfully" };
    } catch (err) {
      return new UnauthorizedException(err);
    }
  }

  @Put("/:name/mute_user")
  @ApiParam({ name: "name", required: true })
  public async muteUser(@Param() param, @Req() req) {
    try {
      const muter: UserDto = await this.userService.getUserByName(
        req.user.name
      );
      if (!muter) throw Error("User not found");
      const toMute: UserDto = await this.userService.getUserByName(param.name);
      if (!toMute) throw Error("User to mute not found");
      await this.userService.muteUser(muter.id, toMute.id);
      return { response: `Muted ${toMute.name} sucessfuly` };
    } catch (err) {
      return new UnauthorizedException(err);
    }
  }

  @Put("/:name/unmute_user")
  @ApiParam({ name: "name", required: true })
  public async unMuteUser(@Param() param, @Req() req) {
    try {
      const muter: UserDto = await this.userService.getUserByName(
        req.user.name
      );
      if (!muter) throw Error("User not found");
      const toMute: UserDto = await this.userService.getUserByName(param.name);
      if (!toMute) throw Error("User to mute not found");
      await this.userService.unMuteUser(muter.id, toMute.id);
      return { response: `Unmuted ${toMute.name} sucessfuly` };
    } catch (err) {
      return new UnauthorizedException(err);
    }
  }

  @Get("/:name/message")
  @ApiParam({ name: "name", required: true })
  public async getRoomMessages(@Param() param, @Req() req) {
    try {
      const user: UserDto = await this.userService.getUserByName(req.user.name);
      if (!user) throw Error("User not found");
      const mutes: UserDto[] = await this.userService.getMutedUsers(user.name);
      const room: RoomDto = await this.roomService.getRoomByName(param.name);
      if (!room) throw Error("Room not found");
      const messages: MessageDto[] =
        await this.messageService.getForUserRoomMessages(room.id, mutes);
      return { response: messages };
    } catch (err) {
      return new NotFoundException(err);
    }
  }

  @Post("/:name/create_message")
  @ApiParam({ name: "name", required: true })
  public async createMessage(
    @Param() param,
    @Req() req,
    @Body() message: MessageDto
  ) {
    try {
      const creator: UserDto = await this.userService.getUserByName(
        req.user.name
      );
      if (!creator) throw Error("Creator not found");
      const rooms: RoomDto[] = await this.roomService.getUserRooms(creator.id);
      const room: RoomDto = rooms.find(({ name }) => name === param.name);

      if (!room) throw Error("Room not found");
      const status = await this.roomService.getUserSatus(room.id, creator);
      if (status === Room_Role.BANNED) throw Error("User is nan");
      if (status === Room_Role.MUTED) throw Error("User is mute");
      await this.messageService.createMessage(
        room.id,
        creator.id,
        message.content
      );
      return { response: "Created message sucessfully" };
    } catch (err) {
      return new UnauthorizedException(err);
    }
  }

  @Put("/:name/update_user_status")
  @ApiParam({ name: "name", required: true })
  public async updateUserSatus(
    @Param() param,
    @Req() req,
    @Body() body: { userName: string; newRole: Room_Role }
  ) {
    try {
      const updater: UserDto = await this.userService.getUserByName(
        req.user.name
      );
      const toUpdate: UserDto = await this.userService.getUserByName(
        body.userName
      );
      if (!updater) throw Error("Updater not found");
      if (!toUpdate) throw Error("User to update not found");
      const room = await this.roomService.getRoomByName(param.name);
      if (!room) throw Error("Room not found");
      const updaterStatus = await this.roomService.getUserSatus(
        room.id,
        updater
      );
      const toUpdateStatus = await this.roomService.getUserSatus(
        room.id,
        toUpdate
      );
      if (!updaterStatus) throw Error("Unable to find updater in room");
      if (!toUpdateStatus) throw Error("Unable to find user to update in room");
      if (
        (updaterStatus == Room_Role.OWNER ||
          updaterStatus == Room_Role.ADMIN) &&
        toUpdateStatus != Room_Role.ADMIN &&
        toUpdateStatus != Room_Role.OWNER &&
        body.newRole != Room_Role.OWNER
      ) {
        this.roomService.udpateUsersStatus(room.id, toUpdate, body.newRole);
      } else throw Error("Udpater do not have the right to do this action");
      return { response: `${toUpdate.name} is now ${body.newRole}` };
    } catch (err) {
      return new UnauthorizedException(err);
    }
  }
}
