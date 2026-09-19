import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { MovieStatus, ScreenFormat } from "src/generated/prisma/client";

class LocationBasicDto {
  @ApiProperty({ example: "uuid-1234" })
  id: string;

  @ApiProperty({ example: "cineize Talatona" })
  name: string;

  @ApiProperty({ example: "Luanda" })
  province: string;

  @ApiProperty({ example: "Luanda" })
  city: string;

  @ApiProperty({ example: -8.8147 })
  latitude: number;

  @ApiProperty({ example: 13.2302 })
  longitude: number;
}

class RoomBasicDto {
  @ApiProperty({ example: "uuid-1234" })
  id: string;

  @ApiProperty({ example: "Sala 1" })
  name: string;

  @ApiProperty({ enum: ScreenFormat, example: ScreenFormat.D2 })
  format: ScreenFormat;

  @ApiProperty({ type: () => LocationBasicDto })
  location: LocationBasicDto;
}

class SessionMovieBasicDto {
  @ApiProperty({ example: "uuid-1234" })
  id: string;

  @ApiProperty({ example: "uuid-1234" })
  movieId: string;

  @ApiProperty({ example: "uuid-1234" })
  roomId: string;

  @ApiProperty({ example: "NORMAL" })
  type: string;

  @ApiProperty({ example: "WEEKDAY" })
  tier: string;

  @ApiProperty({ example: "2026-03-17T18:00:00.000Z" })
  startTime: Date;

  @ApiProperty({ example: "2026-03-17T20:30:00.000Z" })
  endTime: Date;

  @ApiProperty({ example: "2026-03-10T18:00:00.000Z" })
  saleOpensAt: Date;

  @ApiProperty({ example: 3500.5 })
  price: any; // Decimal maps better to string or number, here any is acceptable or number

  @ApiProperty({ type: () => RoomBasicDto })
  room: RoomBasicDto;
}

export class MovieDetailDto {
  @ApiProperty({ example: "uuid-1234" })
  id: string;

  @ApiProperty({ example: "Spider-Man: No Way Home" })
  title: string;

  @ApiPropertyOptional({ example: "Spider-Man 3" })
  originalTitle: string | null;

  @ApiProperty({ example: "Peter Parker has his secret identity revealed..." })
  synopsis: string;

  @ApiProperty({ type: [String], example: ["Action", "Adventure"] })
  genres: string[];

  @ApiProperty({ example: "en" })
  language: string;

  @ApiPropertyOptional({ example: "pt" })
  subtitleLanguage: string | null;

  @ApiProperty({ type: [String], example: ["Tom Holland", "Zendaya"] })
  cast: string[];

  @ApiProperty({ example: "Jon Watts" })
  director: string;

  @ApiProperty({ example: "https://example.com/poster.jpg" })
  posterUrl: string;

  @ApiPropertyOptional({ example: "https://example.com/banner.jpg" })
  bannerUrl: string | null;

  @ApiPropertyOptional({ example: "https://youtube.com/watch?v=..." })
  trailerUrl: string | null;

  @ApiProperty({ example: 148 })
  durationMin: number;

  @ApiProperty({ example: "M/12" })
  ageRating: string;

  @ApiProperty({ example: true })
  featured: boolean;

  @ApiProperty({ example: "2026-03-17T10:00:00.000Z" })
  releaseDate: Date;

  @ApiProperty({ enum: MovieStatus, example: MovieStatus.ACTIVE })
  status: MovieStatus;

  @ApiProperty({ example: "2026-03-17T10:00:00.000Z" })
  createdAt: Date;

  @ApiProperty({ example: "2026-03-17T10:00:00.000Z" })
  updatedAt: Date;

  @ApiProperty({ type: () => [SessionMovieBasicDto] })
  sessionMovies: SessionMovieBasicDto[];
}
