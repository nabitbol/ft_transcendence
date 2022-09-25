import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class MatchDto {
  @ApiProperty()
  @IsString()
  score: string;

  @ApiProperty({
    description: "Winner name to print",
    default: "Draw Game",
  })
  @IsString()
  winner: string;

  @ApiProperty({
    description: "Time the match was desipute",
  })
  created_at?: Date | undefined;

  @ApiProperty()
  @IsString({
    each: true,
  })
  players?: string[];
}
