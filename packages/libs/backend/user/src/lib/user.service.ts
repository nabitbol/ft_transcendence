import { Injectable } from "@nestjs/common";
import { UserToUpdateDto, UserDto } from "@ft-transcendence/libs-shared-types";
import prisma from "@ft-transcendence/libs-backend-prisma-client";

@Injectable()
export class UserService {
  public async getUsers(): Promise<UserDto[]> {
    try {
      return await prisma.user.findMany();
    } catch (err) {
      throw Error("Users not found");
    }
  }

  public async getUserById(id: string): Promise<UserDto> {
    try {
      return await prisma.user.findFirst({
        where: {
          id: id,
        },
      });
    } catch (err) {
      throw Error("User not found");
    }
  }

  public async getUserByEmail(email: string): Promise<UserDto> {
    try {
      return await prisma.user.findFirst({
        where: {
          email: email,
        },
      });
    } catch (err) {
      throw Error("User not found");
    }
  }

  public async getUserByName(name: string): Promise<UserDto> {
    try {
      return await prisma.user.findFirst({
        where: {
          name: name,
        },
      });
    } catch (err) {
      throw Error("User not found");
    }
  }

  public async addUser(user: UserDto) {
    try {
      await prisma.user.create({ data: user });
    } catch (err) {
      throw Error("Couldn't add user");
    }
  }

  public async addFriend(name: string, firendId: string, userId: string) {
    try {
      await prisma.user.update({
        where: {
          name: name,
        },
        data: {
          friends: {
            connect: {
              id: firendId,
            },
          },
          friendsOf: {
            connect: {
              id: userId,
            },
          },
        },
      });
    } catch (err) {
      throw Error("Couldn't add friend");
    }
  }

  public async addFriendRequest(name_sender: string, user : UserDto): Promise<UserDto> {
    try {
      return await prisma.user.update({
        where: {
          name: user.name,
        },
        data: {
          friendsRequest: {
            push: name_sender,
          },
        },
      });
    } catch (err) {
      throw Error("Couldn't send friend request");
    }
  }

  public async updateUser(name: string, toUpdate: UserToUpdateDto) {
    try {
      await prisma.user.update({
        where: {
          name: name,
        },
        data: toUpdate,
      });
    } catch (err) {
      throw Error("Couldn't update user");
    }
  }

  public async deleteUser(name: string) {
    try {
      return await prisma.user.delete({
        where: {
          name: name,
        },
      });
    } catch (err) {
      throw Error("Couldn't delete user");
    }
  }

  public async removeFriend(name: string, firendId: string, userId: string) {
    try {
      await prisma.user.update({
        where: {
          name: name,
        },
        data: {
          friends: {
            disconnect: {
              id: firendId,
            },
          },
          friendsOf: {
            disconnect: {
              id: userId,
            },
          },
        },
      });
    } catch (err) {
      throw Error("Couldn't remove friend");
    }
  }

  async setTwoFactorAuthenticationStatus(name: string, status: boolean) : Promise<any> 
	{
    const user : UserToUpdateDto = new UserToUpdateDto();
    user.doubleAuth = status;
		return this.updateUser(name, user);
	  }

    async setTwoFactorAuthenticationSecret(name: string, secret: string) : Promise<any> 
	{
    const user : UserToUpdateDto = new UserToUpdateDto();
    user.doubleAuthSecret = secret;
		return this.updateUser(name, user);
	  }
}
