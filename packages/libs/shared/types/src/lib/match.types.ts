import { Optional } from "@nestjs/common";
import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsOptional, IsString } from "class-validator";

export class MatchDto {
  @ApiProperty()
  @IsOptional()
  @IsString()
  id?: string | undefined;

  @ApiProperty()
  @IsNumber()
  winnerScore: number;

  @ApiProperty()
  @IsNumber()
  looserScore: number;

  @ApiProperty({
    description: "Looser name to print",
  })
  @IsString()
  looser: string;

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
  playersName: string[];

  @ApiProperty()
  @IsString({
    each: true,
  })
  players?: string[];
}
