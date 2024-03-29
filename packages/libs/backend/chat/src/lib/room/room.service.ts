import { Injectable } from "@nestjs/common";
import {
  RoomDto,
  UserDto,
  UserRoomDto,
} from "@ft-transcendence/libs-shared-types";
import prisma from "@ft-transcendence/libs-backend-prisma-client";
import { Room_Role, Room_Status } from "@prisma/client";
import * as bcrypt from "bcrypt";

@Injectable()
export class RoomService {
  /* ---------------------------------- utils --------------------------------- */

  async hashString(textToEncrypt: string): Promise<string> {
    const saltRounds = 10;

    const salt = await bcrypt.genSalt(saltRounds);
    return await bcrypt.hash(textToEncrypt, salt);
  }

  async compareHash(hash: string, textToCompare: string): Promise<boolean> {
    return await bcrypt.compare(textToCompare, hash);
  }

  /* --------------------------------- methods -------------------------------- */

  public async getPublicRooms() {
    const status: Room_Status = Room_Status.PUBLIC;
    try {
      return await prisma.room.findMany({
        where: {
          status: status,
        },
      });
    } catch (err) {
      throw Error("Rooms not found");
    }
  }

  public async getRoomById(id: string) {
    try {
      return await prisma.room.findFirst({
        where: {
          id: id,
        },
      });
    } catch (err) {
      throw Error("Rooms not found");
    }
  }

  public async getRoomByName(name: string) {
    try {
      return await prisma.room.findFirst({
        where: {
          name: name,
        },
      });
    } catch (err) {
      throw Error("Rooms not found");
    }
  }

  public async getRoomByConvName(convName: string) {
    try {
      return await prisma.room.findMany({
        where: {
          convName1: convName,
        },
      });
    } catch (err) {
      throw Error("Rooms not found");
    }
  }

  public async addUsers(roomId: string, users: UserDto[]) {
    const tmp: UserRoomDto[] = [];
    users.map((element, index) => {
      tmp[index] = {
        role: Room_Role.NORMAL,
        updated_at: new Date(),
        userId: element.id,
        roomId: roomId,
      };
    });
    await prisma.user_Room.createMany({
      data: tmp,
    });
  }

  public async removeUser(roomId: string, user: UserDto) {
    await prisma.user_Room.deleteMany({
      where: { userId: user.id, roomId: roomId },
    });
  }

  public async createRoom(room: RoomDto, creator: UserDto, users?: UserDto[]) {
    if (room.status === Room_Status.PROTECTED) {
      if (!room.password) throw Error("No password provided");
      room.password = await this.hashString(room.password);
    }
    try {
      await prisma.room.create({
        data: {
          name: room.name,
          password: room.password,
          status: room.status,
          updated_at: room.updated_at,
          convName1: room.convName1,
          convName2: room.convName2,
          users: {
            create: [
              {
                updated_at: new Date(),
                role:
                  room.status !== Room_Status.CONVERSATION
                    ? Room_Role.OWNER
                    : Room_Role.NORMAL,
                User: {
                  connect: {
                    id: creator.id,
                  },
                },
              },
            ],
          },
        },
      });
      if (users) {
        this.addUsers(room.id, users);
      }
    } catch (err) {
      throw Error("Unable to create room");
    }
  }

  public async updateRoom(
    room: RoomDto,
    newStatus: Room_Status,
    newPassword?: string | undefined
  ) {
    if (newStatus === Room_Status.PROTECTED) {
      if (!newPassword) throw Error("No password provided");
      newPassword = await this.hashString(newPassword);
    }
    try {
      await prisma.room.update({
        where: {
          id: room.id,
        },
        data: {
          password: newPassword,
          status: newStatus,
          updated_at: new Date(),
        },
      });
    } catch (err) {
      throw Error("Unable to update room");
    }
  }

  public async getUserRooms(userId: string) {
    try {
      const rooms: RoomDto[] = [];
      const user_rooms: UserRoomDto[] = await prisma.user_Room.findMany({
        where: { userId: userId },
      });
      for (let i = 0; i < user_rooms.length; i++) {
        rooms[i] = await prisma.room.findFirst({
          where: { id: user_rooms[i].roomId },
        });
      }
      return rooms;
    } catch (err) {
      throw Error("Rooms not found");
    }
  }

  public async getRoomUsers(roomId: string) {
    try {
      return await prisma.user_Room.findMany({
        where: { roomId: roomId },
      });
    } catch (err) {
      throw Error("User not found");
    }
  }

  public async getUserSatus(roomId: string, user: UserDto) {
    try {
      return (
        await prisma.user_Room.findFirst({
          where: { roomId: roomId, userId: user.id },
        })
      ).role;
    } catch (err) {
      throw Error("Can't get user role");
    }
  }

  public async getUserInRoom(roomId: string, user: UserDto) {
    try {
      return await prisma.user_Room.findFirst({
        where: { roomId: roomId, userId: user.id },
      });
    } catch (err) {
      throw Error("Can't get user role");
    }
  }

  public async udpateUsersStatus(
    roomId: string,
    user: UserDto,
    newRole: Room_Role
  ) {
    try {
      await prisma.user_Room.updateMany({
        where: { roomId: roomId, userId: user.id },
        data: {
          updated_at: new Date(),
          role: newRole,
        },
      });
    } catch (err) {
      throw Error("Can't update user status");
    }
  }
}
