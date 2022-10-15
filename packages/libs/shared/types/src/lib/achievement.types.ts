import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsNumber } from "class-validator";


export type AchievementType = {
    id: string;
    title: string;
    content: string;
    image: string;
    condition: number;
};


export class AchievementDto {
    @ApiProperty()
    @IsString()
    id: string;
  
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