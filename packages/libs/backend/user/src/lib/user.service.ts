import { Injectable } from "@nestjs/common";
import { UserToUpdateDto, UserDto, AchievementDto } from "@ft-transcendence/libs-shared-types";
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

  public async getFriends(name: string) {
    try {
      return await prisma.user
        .findUnique({
          where: {
            name: name,
          },
        })
        .friends();
    } catch (err) {
      throw Error("Couldn't find friends");
    }
  }

  public async addFriend(name: string, friendId: string) {
    try {
      await prisma.user.update({
        where: {
          name: name,
        },
        data: {
          friends: {
            connect: {
              id: friendId,
            },
          },
          friendsOf: {
            connect: {
              id: friendId,
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

  public async removeFriendRequest(name_to_delete: string, user : UserDto): Promise<UserDto> {
    let i = 0;
    let j = 0;
    while (user.friendsRequest[i])
    {
      if (user.friendsRequest[i] != name_to_delete)
        j++;
      i++;
    }
    const tmp : string[] = new Array(j);
    i = 0;
    j = 0;
    while (user.friendsRequest[i])
    {
      if (user.friendsRequest[i] != name_to_delete)
        tmp[j++] = user.friendsRequest[i];
      i++;
    }
    try {
      return await prisma.user.update({
        where: {
          name: user.name,
        },
        data: {
          friendsRequest: tmp,
        },
      });
    } catch (err) {
      throw Error("Couldn't remove friend request");
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

  public async removeFriend(name: string, friendId: string) {
    try {
      await prisma.user.update({
        where: {
          name: name,
        },
        data: {
          friends: {
            disconnect: {
              id: friendId,
            },
          },
          },
        },
      );
    } catch (err) {
      throw Error("Couldn't remove friend");
    }
  }

  public async swap(items: UserDto[], leftIndex: number, rightIndex: number) {
    var temp = items[leftIndex];
    items[leftIndex] = items[rightIndex];
    items[rightIndex] = temp;
    return items;
  }

  public async partition(items: UserDto[], left: number, right: number) {
    var pivot: UserDto  = items[Math.floor((right + left) / 2)],
    i: number   = left,
    j: number   = right;
    while (i <= j) {
        while (items[i].wins > pivot.wins) {
            i++;
        }
        while (items[j].wins < pivot.wins) {
            j--;
        }
        if (i <= j) {
            items = await this.swap(items, j, i);
            i++;
            j--;
        }
    }
    return i;
  }

    public async quickSort(items: UserDto[], left: number, right: number) {
    let index: number;
    if (items.length > 1) {
        index = await this.partition(items, left, right);
        if (left < index - 1) {
            await this.quickSort(items, left, index - 1);
        }
        if (index < right) {
            await this.quickSort(items, index, right);
        }
    }
    return items;
}


  public async getGeneralLadder() {
    try {
      const tmp: UserDto[] = await prisma.user.findMany();
      const response : UserDto[] = await this.quickSort(tmp, 0, tmp.length - 1)
      return response;
    } catch (err) {
      throw Error("Couldn't remove friend");
    }
  }

  public async getFriendLadder(name: string) {
    try {
      const tmp: UserDto[] = await this.getFriends(name);
      tmp.push(await this.getUserByName(name));
      const response : UserDto[] = await this.quickSort(tmp, 0, tmp.length - 1)
      return response;
    } catch (err) {
      throw Error("Couldn't remove friend");
    }
  }

  public async updateLadderLevel(users: UserDto[]) {
    try {
      let i = 0;
      while (users[i])
      {
        users[i].ladder_level = i + 1;
        await prisma.user.update({
          where: {
            name: users[i].name,
          },
          data: {
            ladder_level: users[i].ladder_level
            }
          });
        i++;
      }
      return users;
    } catch (err) {
      throw Error("Couldn't remove friend");
    }
  }

  public async getAchievement(): Promise<AchievementDto[]> {
    try {
      return await prisma.achievement.findMany();
    } catch (err) {
      throw Error("Users not found");
    }
  }

  public async updateUserAchievement(achievement: AchievementDto[], user: UserDto) {
    if (achievement.length == user.achievement.length)
      return ;
    let tmp: AchievementDto[];
    let i = 0;
    while (achievement[i])
    {
      if (achievement[i].condition <= user.wins)
        tmp.push(achievement[i]);
      i++;
    }
    user.achievement = tmp;
    try {
      await prisma.user.update({
        where: {
          name: user.name,
        },
        data: {
          achievements:{
            connect: user.achievement
          },
          }
        });
    } catch (err) {
      throw Error("Users not found");
    }
  }

  async setTwoFactorAuthenticationStatus(
    name: string,
    status: boolean
  ): Promise<any> {
    const user: UserToUpdateDto = new UserToUpdateDto();
    user.doubleAuth = status;
    return this.updateUser(name, user);
  }

  async setTwoFactorAuthenticationSecret(
    name: string,
    secret: string
  ): Promise<any> {
    const user: UserToUpdateDto = new UserToUpdateDto();
    user.doubleAuthSecret = secret;
    return this.updateUser(name, user);
  }
}
