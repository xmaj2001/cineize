import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "src/shared/prisma/prisma.service";

@Injectable()
export class FindSessionUseCase {
  constructor(private readonly prisma: PrismaService) {}

  async execute(id: number) {
    const session = await this.prisma.sessionMovie.findUnique({
      where: { id },
      include: {
        movie: {
          select: {
            title: true,
            slug: true,
            posterUrl: true,
            backdropUrl: true,
            durationMinutes: true,
          },
        },
        hall: {
          include: {
            cinema: {
              select: {
                name: true,
                address: true,
                latitude: true,
                longitude: true,
              },
            },
            seats: {
              where: { active: true },
              select: {
                id: true,
                row: true,
                number: true,
                seatType: true,
              },
            },
          },
        },
        exhibition: true,
      },
    });
    if (!session) throw new NotFoundException(`Session #${id} not found`);

    const endTime = new Date(
      session.startDateTime.getTime() + session.movie.durationMinutes * 60000,
    );

    return {
      id: session.id,
      startTime: session.startDateTime,
      endTime,
      room: session.hall.number,
      movie: session.movie,
      cinema: session.hall.cinema,
      seats: session.hall.seats,
      price: session.price,
      format: session.hall.format,
      type: session.sessionType,
    };
  }
}
