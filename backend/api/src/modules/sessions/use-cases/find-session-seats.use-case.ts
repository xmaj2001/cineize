import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "src/shared/prisma/prisma.service";

@Injectable()
export class FindSessionSeatsUseCase {
  constructor(private readonly prisma: PrismaService) {}

  async execute(sessionId: number) {
    const session = await this.prisma.sessionMovie.findUnique({
      where: { id: sessionId },
    });

    if (!session) {
      throw new NotFoundException("Session not found");
    }

    const seats = await this.prisma.seat.findMany({
      where: { hallId: session.hallId },
    });

    const seatsData = seats.map((seat) => ({
      id: seat.id,
      row: seat.row,
      number: seat.number,
      seatType: seat.seatType,
      status: seat.status,
    }));
    return seatsData;
  }
}
