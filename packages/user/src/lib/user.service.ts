import { Injectable } from "@nestjs/common";
import { User } from "@prisma/client";
import prisma from "@ft-transcendence/prisma-client";

@Injectable()
export class UserService {
  public getUsers(): Promise<User[]> {
    return prisma.user.findMany();
  }
}
