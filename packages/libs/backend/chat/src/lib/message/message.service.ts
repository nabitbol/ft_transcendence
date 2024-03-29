import { Injectable } from "@nestjs/common";
import prisma from "@ft-transcendence/libs-backend-prisma-client";
import { MessageDto, UserDto } from "@ft-transcendence/libs-shared-types";

@Injectable()
export class MessageService {
  public async createMessage(roomId: string, userId: string, content: string) {
    try {
      await prisma.message.create({
        data: {
          content: content,
          User: {
            connect: {
              id: userId,
            },
          },
          Room: {
            connect: {
              id: roomId,
            },
          },
        },
      });
    } catch (err) {
      throw Error("Unable to create message");
    }
  }
  public async getRoomMessages(roomId: string) {
    try {
      return await prisma.message.findMany({
        where: {
          roomId: roomId,
        },
      });
    } catch (err) {
      throw Error("Rooms not found");
    }
  }

  public async getForUserRoomMessages(roomId: string, mutes: UserDto[]) {
    try {
      return await prisma.message.findMany({
        where: {
          roomId: roomId,
          NOT: mutes.map((element) => ({ userId: element.id })),
        },
      });
    } catch (err) {
      throw Error("Message not found");
    }
  }

  public async getMessageUser(message: MessageDto) {
    try {
      return await prisma.message
        .findUnique({
          where: {
            id: message.id,
          },
        })
        .User();
    } catch (err) {
      throw Error("Message not found");
    }
  }
}
