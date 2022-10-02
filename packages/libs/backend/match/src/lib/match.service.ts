import { Injectable } from "@nestjs/common";
import prisma from "@ft-transcendence/libs-backend-prisma-client";
import { MatchDto } from "@ft-transcendence/libs-shared-types";

@Injectable()
export class MatchService {
  public async getAllMatches(): Promise<MatchDto[]> {
    try {
      return await prisma.match.findMany();
    } catch (err) {
      throw Error("Users not found");
    }
  }

  public async getUserMatches(id: string): Promise<MatchDto[]> {
    try {
      return await prisma.match.findMany({
        where: {
          id: id,
        },
      });
    } catch (err) {
      throw Error("Users not found");
    }
  }

  public async addMatches(match: MatchDto) {
    try {
      return await prisma.match.create({
        data: {
          winner: match.winner,
          score: match.score,
          players: {
            connect: match.players.map((element) => ({ id: element })),
          },
        },
      });
    } catch (err) {
      throw Error("Users not found");
    }
  }
}
