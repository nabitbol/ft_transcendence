import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { MinLength, MaxLength, IsString, IsOptional } from "class-validator";
import { Room_Status, Room_Role } from "@prisma/client";

export class UserRoomDto {
  @ApiPropertyOptional()
  @IsOptional()
  id?: string | undefined;

  @ApiPropertyOptional()
  userId: string;

  @ApiPropertyOptional()
  roomId: string;

  @IsOptional()
  @ApiProperty({
    description: "Time the match was disputed",
  })
  created_at?: Date | undefined;

  @IsOptional()
  @ApiProperty({
    description: "Time the match was disputed",
  })
  updated_at?: Date | undefined;

  @IsOptional()
  @ApiProperty({
    description: "Time the match was disputed",
  })
  role?: Room_Role | undefined;
}

export class RoomDto {
  @ApiPropertyOptional()
  @IsOptional()
  id?: string | undefined;

  @ApiProperty()
  @IsString()
  @IsOptional()
  @MinLength(4)
  @MaxLength(25)
  name: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  @MinLength(2)
  password?: string | undefined;

  @IsOptional()
  @ApiProperty({
    description: "Time the match was disputed",
  })
  created_at?: Date | undefined;

  @IsOptional()
  @ApiProperty({
    description: "Time the match was disputed",
  })
  updated_at?: Date | undefined;

  @IsOptional()
  @ApiProperty({
    description: "Time the match was disputed",
  })
  status?: Room_Status | undefined;
}
