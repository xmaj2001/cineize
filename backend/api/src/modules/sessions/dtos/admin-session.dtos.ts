import { ApiProperty, ApiPropertyOptional, PartialType } from "@nestjs/swagger";
import {
    IsDateString,
    IsEnum,
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsPositive,
    IsUUID,
    Min,
} from "class-validator";
import {
    PricingTier,
    ScreenFormat,
    SeatType,
    SessionMovieType,
    TicketStatus,
} from "src/generated/prisma/client";

export class CreateSessionDto {
    @ApiProperty({ example: "uuid-movie-123" })
    @IsUUID()
    @IsNotEmpty()
    movieId: string;

    @ApiProperty({ example: "uuid-room-123" })
    @IsUUID()
    @IsNotEmpty()
    roomId: string;

    @ApiProperty({ enum: SessionMovieType, example: SessionMovieType.NORMAL })
    @IsEnum(SessionMovieType)
    type: SessionMovieType;

    @ApiProperty({ enum: PricingTier, example: PricingTier.WEEKDAY })
    @IsEnum(PricingTier)
    tier: PricingTier;

    @ApiProperty({ example: "2026-08-20T18:00:00.000+01:00" })
    @IsDateString()
    startTime: string;

    @ApiProperty({ example: "2026-08-15T08:00:00.000+01:00" })
    @IsDateString()
    saleOpensAt: string;

    @ApiProperty({ example: 3500 })
    @IsNumber()
    @IsPositive()
    price: number;
}

export class UpdateSessionDto extends PartialType(CreateSessionDto) { }

export class ListAdminSessionsDto {
    @ApiPropertyOptional({ example: "uuid-location-123" })
    @IsOptional()
    @IsUUID()
    locationId?: string;

    @ApiPropertyOptional({ example: "uuid-room-123" })
    @IsOptional()
    @IsUUID()
    roomId?: string;

    @ApiPropertyOptional({ example: "uuid-movie-123" })
    @IsOptional()
    @IsUUID()
    movieId?: string;

    @ApiPropertyOptional({ example: "2026-08-20T00:00:00.000+01:00" })
    @IsOptional()
    @IsDateString()
    date?: string;

    @ApiPropertyOptional({ default: 1 })
    @IsOptional()
    @Min(1)
    page?: number = 1;

    @ApiPropertyOptional({ default: 20 })
    @IsOptional()
    @Min(1)
    limit?: number = 20;
}

export class AdminSeatOverviewDto {
    @ApiProperty({ example: "uuid-seat-001" })
    id: string;

    @ApiProperty({ example: "A" })
    row: string;

    @ApiProperty({ example: 1 })
    number: number;

    @ApiProperty({ enum: SeatType })
    type: SeatType;

    @ApiProperty({ enum: TicketStatus })
    status: TicketStatus;

    @ApiPropertyOptional({ example: "uuid-order-123" })
    orderId?: string;

    @ApiPropertyOptional({ example: "uuid-user-123" })
    userId?: string;

    @ApiPropertyOptional({ example: "2026-08-20T18:15:00.000+01:00" })
    reservedUntil?: Date;
}

export class AdminSessionDetailDto {
    @ApiProperty({ example: "uuid-session-001" })
    id: string;

    @ApiProperty({ enum: SessionMovieType })
    type: SessionMovieType;

    @ApiProperty({ enum: PricingTier })
    tier: PricingTier;

    @ApiProperty()
    startTime: Date;

    @ApiProperty()
    endTime: Date;

    @ApiProperty()
    saleOpensAt: Date;

    @ApiProperty({ example: 3500 })
    price: number;

    @ApiProperty()
    occupancyRate: number;

    @ApiProperty()
    totalRevenue: number;

    @ApiProperty()
    ticketsSold: number;

    @ApiProperty()
    ticketsReserved: number;

    @ApiProperty()
    ticketsAvailable: number;

    @ApiProperty()
    movie: {
        id: string;
        title: string;
        posterUrl: string;
        durationMin: number;
    };

    @ApiProperty()
    room: {
        id: string;
        name: string;
        capacity: number;
        format: ScreenFormat;
        locationName: string;
    };

    @ApiProperty({ type: () => [AdminSeatOverviewDto] })
    seats: AdminSeatOverviewDto[];
}