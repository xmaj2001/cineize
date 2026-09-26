import {
  IsInt,
  IsNumber,
  IsOptional,
  IsEnum,
  IsDateString,
  Min,
} from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { SessionType } from "src/generated/prisma/enums";

export class CreateSessionDto {
  @ApiProperty({ example: 1 })
  @IsInt()
  movieId: number;

  @ApiProperty({ example: 1, description: "ID da sala" })
  @IsInt()
  hallId: number;

  @ApiPropertyOptional({ description: "ID da exibição (prévenda, etc)" })
  @IsOptional()
  @IsInt()
  exhibitionId?: number;

  @ApiProperty({ example: "2024-09-25T15:00:00.000Z" })
  @IsDateString()
  startDateTime: string;

  @ApiPropertyOptional({ description: "Se omitido, calcula automaticamente" })
  @IsOptional()
  @IsNumber()
  @Min(0)
  price?: number;

  @ApiPropertyOptional({ enum: SessionType, default: "NORMAL" })
  @IsOptional()
  @IsEnum(SessionType)
  sessionType?: SessionType;
}
