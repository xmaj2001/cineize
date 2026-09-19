import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsOptional, IsString, IsEnum, IsInt, Min } from "class-validator";
import { Type } from "class-transformer";

export enum MovieStatusFilter {
  NOW_SHOWING = "nowShowing",
  PRESALE = "presale",
  COMING_SOON = "comingSoon",
}

export class ListMoviesDto {
  @ApiPropertyOptional({
    description: "ID do cinema para filtrar sessões disponíveis",
  })
  @IsOptional()
  @IsString()
  locationId?: string;

  @ApiPropertyOptional({
    description: "Termo de pesquisa (título do filme)",
  })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({
    enum: MovieStatusFilter,
    description: "Filtrar por status",
  })
  @IsOptional()
  @IsEnum(MovieStatusFilter)
  status?: MovieStatusFilter;

  @ApiPropertyOptional({
    description: "Cursor para próxima página (ID do último filme)",
  })
  @IsOptional()
  @IsString()
  cursor?: string;

  @ApiPropertyOptional({
    description: "Itens por página (default 20)",
    default: 20,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number = 20;
}
