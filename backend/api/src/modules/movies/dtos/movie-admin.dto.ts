import { ApiProperty, ApiPropertyOptional, PartialType } from "@nestjs/swagger";
import {
    IsString,
    IsOptional,
    IsArray,
    IsInt,
    IsBoolean,
    IsEnum,
    IsDateString,
    Min,
    IsUrl,
} from "class-validator";
import { MovieStatus } from "src/generated/prisma/client";

export class CreateMovieDto {
    @ApiProperty({ example: "Spider-Man: No Way Home" })
    @IsString()
    title: string;

    @ApiPropertyOptional({ example: "Spider-Man 3" })
    @IsOptional()
    @IsString()
    originalTitle?: string;

    @ApiProperty({ example: "Peter Parker tem a sua identidade revelada..." })
    @IsString()
    synopsis: string;

    @ApiProperty({ type: [String], example: ["Ação", "Aventura"] })
    @IsArray()
    @IsString({ each: true })
    genres: string[];

    @ApiProperty({ example: "en" })
    @IsString()
    language: string;

    @ApiPropertyOptional({ example: "pt" })
    @IsOptional()
    @IsString()
    subtitleLanguage?: string;

    @ApiProperty({ type: [String], example: ["Tom Holland", "Zendaya"] })
    @IsArray()
    @IsString({ each: true })
    cast: string[];

    @ApiProperty({ example: "Jon Watts" })
    @IsString()
    director: string;

    @ApiProperty({ example: "https://example.com/poster.jpg" })
    @IsUrl()
    posterUrl: string;

    @ApiPropertyOptional({ example: "https://example.com/banner.jpg" })
    @IsOptional()
    @IsUrl()
    bannerUrl?: string;

    @ApiPropertyOptional({ example: "https://youtube.com/watch?v=..." })
    @IsOptional()
    @IsUrl()
    trailerUrl?: string;

    @ApiProperty({ example: 148 })
    @IsInt()
    @Min(1)
    durationMin: number;

    @ApiProperty({ example: "M/12" })
    @IsString()
    ageRating: string;

    @ApiPropertyOptional({ example: false, default: false })
    @IsOptional()
    @IsBoolean()
    featured?: boolean;

    @ApiProperty({ example: "2026-03-17T10:00:00.000Z" })
    @IsDateString()
    releaseDate: string;

    @ApiPropertyOptional({
        enum: MovieStatus,
        default: MovieStatus.ACTIVE,
        example: MovieStatus.ACTIVE,
    })
    @IsOptional()
    @IsEnum(MovieStatus)
    status?: MovieStatus;
}

export class UpdateMovieDto extends PartialType(CreateMovieDto) { }

export class ListAdminMoviesDto {
    @ApiPropertyOptional({ description: "Termo de pesquisa no título" })
    @IsOptional()
    @IsString()
    search?: string;

    @ApiPropertyOptional({ enum: MovieStatus, description: "Filtrar por status" })
    @IsOptional()
    @IsEnum(MovieStatus)
    status?: MovieStatus;

    @ApiPropertyOptional({ description: "Página (default 1)", default: 1 })
    @IsOptional()
    @IsInt()
    @Min(1)
    page?: number = 1;

    @ApiPropertyOptional({ description: "Itens por página (default 20)", default: 20 })
    @IsOptional()
    @IsInt()
    @Min(1)
    limit?: number = 20;
}