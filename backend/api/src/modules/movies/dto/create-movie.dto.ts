import {
  IsString,
  IsInt,
  IsNumber,
  IsOptional,
  IsBoolean,
  IsArray,
  IsEnum,
  MaxLength,
  Min,
  Max,
} from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { AgeRating } from "src/generated/prisma/enums";
import { Type } from "class-transformer";

export class CreateMovieDto {
  @ApiProperty({ example: "Avatar: The Way of Water" })
  @IsString()
  @MaxLength(255)
  title: string;

  @ApiProperty({ example: "avatar-the-way-of-water" })
  @IsString()
  @MaxLength(255)
  slug: string;

  @ApiProperty()
  @IsString()
  synopsis: string;

  @ApiProperty({ example: 192 })
  @IsInt()
  @Min(1)
  durationMinutes: number;

  @ApiProperty({ example: ["Ficção Científica", "Ação"], type: [String] })
  @IsArray()
  @IsString({ each: true })
  genres: string[];

  @ApiProperty({ enum: AgeRating, example: "PG13" })
  @IsEnum(AgeRating)
  ageRating: AgeRating;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(150)
  director?: string;

  @ApiPropertyOptional({ type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  cast?: string[];

  @ApiPropertyOptional()
  @IsOptional()
  worldLaunchDate?: string;

  @ApiProperty({ example: 500 })
  @IsNumber()
  @Min(0)
  basePrice: number;

  @ApiPropertyOptional({ default: true })
  @IsOptional()
  @IsBoolean()
  dynamicPricing?: boolean;

  @ApiPropertyOptional({ default: 1.0 })
  @IsOptional()
  @IsNumber()
  extraMultiplier?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  posterUrl?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  backdropUrl?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  trailerUrl?: string;

  @ApiPropertyOptional({ default: true })
  @IsOptional()
  @IsBoolean()
  active?: boolean;
}

export class CatalogQueryDto {
  @ApiPropertyOptional({ description: "Slug do cinema", example: "talatona" })
  @IsOptional()
  @IsString()
  cinema?: string;

  @ApiPropertyOptional({ description: "ID do último item da página anterior" })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  cursor?: number;

  @ApiPropertyOptional({ default: 10, maximum: 50 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(50)
  limit: number = 10;
}
