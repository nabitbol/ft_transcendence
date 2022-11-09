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

  public async getMatchesByUser(id: string): Promise<MatchDto[]> {
    try {
      return await prisma.match.findMany({
        where: {
          players: {
            some: {
              id: id,
            },
          },
        },
      });
    } catch (err) {
      throw Error("Users not found");
    }
  }

  public async addMatches(match: MatchDto) {
    try {
      const addedMatch: MatchDto = await prisma.match.create({
        data: {
          winner: match.winner,
          looser: match.looser,
          winnerScore: match.winnerScore,
          looserScore: match.looserScore,
          players: {
            connect: match.players.map((element) => ({ id: element })),
          },
        },
      });
      if (addedMatch)
        match.playersName.map((element) =>
          addedMatch.playersName.push(element)
        );
      await prisma.match.update({
        where: {
          id: addedMatch.id,
        },
        data: {
          playersName: addedMatch.playersName,
        },
      });
    } catch (err) {
      throw Error("Users not found");
    }
  }
}
