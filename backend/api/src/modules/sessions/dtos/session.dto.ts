import { ApiProperty } from "@nestjs/swagger";
import {
  SeatType,
  TicketStatus,
  ScreenFormat,
  SessionMovieType,
  PricingTier,
} from "src/generated/prisma/client";

export class SeatDto {
  @ApiProperty({ example: "uuid-seat-001" })
  id: string;

  @ApiProperty({ example: "A" })
  row: string;

  @ApiProperty({ example: 1 })
  number: number;

  @ApiProperty({ enum: SeatType, example: SeatType.STANDARD })
  type: SeatType;

  @ApiProperty({ enum: TicketStatus, example: TicketStatus.AVAILABLE })
  status: TicketStatus;
}

class SessionLocationDto {
  @ApiProperty({ example: "uuid-1234" })
  id: string;

  @ApiProperty({ example: "cineize Talatona" })
  name: string;

  @ApiProperty({ example: "Luanda" })
  province: string;

  @ApiProperty({ example: "Talatona" })
  city: string;
}

class SessionRoomDto {
  @ApiProperty({ example: "uuid-1234" })
  id: string;

  @ApiProperty({ example: "Sala 1" })
  name: string;

  @ApiProperty({ example: 120 })
  capacity: number;

  @ApiProperty({ enum: ScreenFormat })
  format: ScreenFormat;

  @ApiProperty({ type: () => SessionLocationDto })
  location: SessionLocationDto;
}

class SessionMovieCardDto {
  @ApiProperty({ example: "uuid-1234" })
  id: string;

  @ApiProperty({ example: "Spider-Man: No Way Home" })
  title: string;

  @ApiProperty({ example: "https://example.com/poster.jpg" })
  posterUrl: string;

  @ApiProperty({ example: 148 })
  durationMin: number;

  @ApiProperty({ example: "M/12" })
  ageRating: string;
}

export class SessionDetailDto {
  @ApiProperty({ example: "uuid-session-001" })
  id: string;

  @ApiProperty({ enum: SessionMovieType })
  type: SessionMovieType;

  @ApiProperty({ enum: PricingTier })
  tier: PricingTier;

  @ApiProperty({ example: "2026-03-17T18:00:00.000Z" })
  startTime: Date;

  @ApiProperty({ example: "2026-03-17T20:30:00.000Z" })
  endTime: Date;

  @ApiProperty({ example: "2026-03-10T18:00:00.000Z" })
  saleOpensAt: Date;

  @ApiProperty({ example: 2500 })
  price: number;

  @ApiProperty({ type: () => SessionMovieCardDto })
  movie: SessionMovieCardDto;

  @ApiProperty({ type: () => SessionRoomDto })
  room: SessionRoomDto;

  @ApiProperty({ type: () => [SeatDto] })
  seats: SeatDto[];
}
