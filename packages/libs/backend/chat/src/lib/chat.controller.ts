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
  RoomDto,
  UserDto,
  UserRoomDto,
} from "@ft-transcendence/libs-shared-types";

@UseGuards(JwtTwoFactorGuard)
@Controller("chat")
@ApiSecurity("JWT-auth")
@ApiTags("Chat")
@Controller("chat")
export class ChatController {
  constructor(private roomService: RoomService) {}

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
}
