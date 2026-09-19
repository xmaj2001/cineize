import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { MovieStatus, ScreenFormat } from "src/generated/prisma/client";

export class MovieCardDto {
  @ApiProperty({ example: "uuid-1234" })
  id: string;

  @ApiProperty({ example: "Spider-Man: No Way Home" })
  title: string;

  @ApiProperty({ example: "https://example.com/poster.jpg" })
  posterUrl: string;

  @ApiPropertyOptional({ example: "https://example.com/banner.jpg" })
  bannerUrl: string | null;

  @ApiProperty({ example: 148 })
  durationMin: number;

  @ApiProperty({ example: "M/12" })
  ageRating: string;

  @ApiProperty({ type: [String], example: ["Action", "Adventure"] })
  genres: string[];

  @ApiProperty({ type: String, example: "Sinopse do filme" })
  synopsis: string;

  @ApiProperty({ enum: MovieStatus, example: MovieStatus.ACTIVE })
  status: MovieStatus;

  @ApiProperty({ example: "en" })
  language: string;

  @ApiPropertyOptional({ example: "pt" })
  subtitleLanguage: string | null;

  @ApiPropertyOptional({ type: () => [MovieCardSessionDto] })
  sessionMovies?: MovieCardSessionDto[];
}

class RoomFormatDto {
  @ApiProperty({ example: "uuid-1234" })
  id: string;

  @ApiProperty({ enum: ScreenFormat, example: ScreenFormat.D2 })
  format: ScreenFormat;

  @ApiProperty({ example: "uuid-1234" })
  locationId: string;
}

class MovieCardSessionDto {
  @ApiProperty({ example: "uuid-1234" })
  id: string;

  @ApiProperty({ example: "2026-03-17T18:00:00.000Z" })
  startTime: Date;

  @ApiProperty({ type: () => RoomFormatDto })
  room: RoomFormatDto;
}
