import { Optional } from "@nestjs/common";
import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class MatchDto {
  @ApiProperty()
  @IsString()
  score: string;

  @ApiProperty({
    description: "Winner name to print",
  })
  @IsString()
  winner: string;

  @Optional()
  @ApiProperty({
    description: "Time the match was disputed",
  })
  created_at?: Date | undefined;

  @ApiProperty()
  @IsString({
    each: true,
  })
  players?: string[];
}0
