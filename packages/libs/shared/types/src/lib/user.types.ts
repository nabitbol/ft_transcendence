import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import {
  MinLength,
  MaxLength,
  IsPositive,
  IsEmail,
  IsString,
  IsOptional,
} from "class-validator";

export type UserType = {
  name: string;
  email: string;
  password: string;
  image: string;
  doubleAuth?: boolean | undefined;
  doubleAuthSecret?: string | undefined;
  wins?: number | undefined;
  losses?: number | undefined;
  ladder_level?: number | undefined;
  userRankId?: string | undefined;
  friendsRequest?: string[] | undefined
};

export type UserToUpdateType = {
  name?: string | undefined;
  email?: string | undefined;
  password?: string | undefined;
  image?: string | undefined;
  doubleAuth?: boolean | undefined;
  doubleAuthSecret?: string | undefined;
  wins?: number | undefined;
  losses?: number | undefined;
  ladder_level?: number | undefined;
  userRankId?: string | undefined;
  friendsRequest?: string[] | undefined
};

export class LoginDto {
  @ApiProperty()
  @IsString()
  @MinLength(4)
  @MaxLength(25)
  name: string;

  @ApiProperty()
  @IsString()
  @MinLength(8)
  password: string;
}

export class UserDto {
  @ApiPropertyOptional()
  @IsOptional()
  id?: string | undefined;

  @ApiProperty()
  @IsString()
  @MinLength(4)
  @MaxLength(25)
  name: string;

  @ApiProperty()
  @IsString()
  @MinLength(8)
  password: string;

  @ApiProperty()
  @IsString()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsString()
  image: string;

  @ApiPropertyOptional({
    description: "Status of the 2FA",
    default: false,
  })
  doubleAuth?: boolean | undefined;

  @ApiPropertyOptional()
  doubleAuthSecret?: string | undefined;

  @ApiPropertyOptional({
    description: "Number of won matchs",
    minimum: 0,
  })
  @IsOptional()
  @IsPositive()
  wins?: number | undefined;

  @ApiPropertyOptional({
    description: "Number of lost matchs",
    minimum: 0,
  })
  @IsOptional()
  @IsPositive()
  losses?: number | undefined;

  @ApiPropertyOptional({
    description: "Ladder level of the user",
    minimum: 1,
  })
  @IsOptional()
  @IsPositive()
  ladder_level?: number | undefined;

  @ApiPropertyOptional()
  userRankId?: string | undefined;

  @ApiPropertyOptional()
  friendsRequest?: string[] | undefined;
}

export class UserToUpdateDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MinLength(4)
  @MaxLength(25)
  name: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MinLength(8)
  password: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @IsEmail()
  email: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  image: string;

  @ApiPropertyOptional({
    description: "Status of the 2FA",
    default: false,
  })
  doubleAuth?: boolean | undefined;

  @ApiPropertyOptional()
  doubleAuthSecret?: string | undefined;

  @ApiPropertyOptional({
    description: "Number of won matchs",
    minimum: 0,
  })
  @IsOptional()
  @IsPositive()
  wins?: number | undefined;

  @ApiPropertyOptional({
    description: "Number of lost matchs",
    minimum: 0,
  })
  @IsOptional()
  @IsPositive()
  losses?: number | undefined;

  @ApiPropertyOptional({
    description: "Ladder level of the user",
    minimum: 1,
  })
  @IsOptional()
  @IsPositive()
  ladder_level?: number | undefined;

  @ApiPropertyOptional()
  userRankId?: string | undefined;

  @ApiPropertyOptional()
  friendsRequest?: string[] | undefined;
}

export class ResponseUserDto {
  @ApiPropertyOptional()
  @IsOptional()
  id?: string | undefined;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MinLength(4)
  @MaxLength(25)
  name?: string | undefined;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @IsEmail()
  email?: string | undefined;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  image?: string | undefined;

  @ApiPropertyOptional({
    description: "Status of the 2FA",
    default: false,
  })
  doubleAuth?: boolean | undefined;

  @ApiPropertyOptional({
    description: "Number of won matchs",
    minimum: 0,
  })
  @IsOptional()
  @IsPositive()
  wins?: number | undefined;

  @ApiPropertyOptional({
    description: "Number of lost matchs",
    minimum: 0,
  })
  @IsOptional()
  @IsPositive()
  losses?: number | undefined;

  @ApiPropertyOptional({
    description: "Ladder level of the user",
    minimum: 1,
  })
  @IsOptional()
  @IsPositive()
  ladder_level?: number | undefined;

  @ApiPropertyOptional()
  userRankId?: string | undefined;

  @ApiPropertyOptional()
  jwtToken?: string | undefined;

  @ApiPropertyOptional()
  friendsRequest?: string[] | undefined;
}
