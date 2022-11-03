import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class MessageDto {
  @ApiPropertyOptional()
  id?: string | undefined;

  @ApiPropertyOptional()
  userId: string;

  @ApiPropertyOptional()
  roomId: string;

  @ApiProperty()
  content: string;

  @ApiProperty({
    description: "Time the match was disputed",
  })
  created_at?: Date | undefined;

  @ApiProperty({
    description: "Time the match was disputed",
  })
  updated_at?: Date | undefined;
}
