import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsNumber, IsOptional } from "class-validator";

export type AchievementType = {
  id?: string | undefined;
  title: string;
  content: string;
  image: string;
  condition: number;
};

export class AchievementDto {
  @ApiProperty()
  @IsOptional()
  @IsString()
  id?: string | undefined;

  @ApiProperty()
  @IsString()
  title: string;

  @ApiProperty()
  @IsString()
  content: string;

  @ApiProperty()
  @IsString()
  image: string;

  @ApiProperty()
  @IsNumber()
  condition: number;
}
