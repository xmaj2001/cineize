import { Injectable } from "@nestjs/common";
import { SessionState } from "src/generated/prisma/enums";
import { PrismaService } from "src/shared/prisma/prisma.service";

@Injectable()
export class FindSessionsByMovieSlugAndDayUseCase {
  constructor(private readonly prisma: PrismaService) {}

  async execute(
    slug: string,
    date: string,
    cinemaId?: number,
    limit = 10,
    cursor?: number,
  ) {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);
    const sessions = await this.prisma.sessionMovie.findMany({
      where: {
        movie: { slug },
        ...(cinemaId && { hall: { cinemaId } }),
        startDateTime: { gte: startOfDay, lte: endOfDay },
        active: true,
        state: SessionState.AVAILABLE,
      },
      take: limit + 1,
      ...(cursor && { cursor: { id: cursor }, skip: 1 }),
      orderBy: [{ startDateTime: "asc" }, { id: "asc" }],
      select: {
        id: true,
        startDateTime: true,
        price: true,
        hall: {
          select: {
            format: true,
            cinema: { select: { id: true, name: true, slug: true } },
          },
        },
        movie: { select: { durationMinutes: true } },
      },
    });
    let nextCursor: number | undefined;
    if (sessions.length > limit) nextCursor = sessions.pop()!.id;
    return {
      items: sessions.map((session) => ({
        id: session.id,
        startTime: session.startDateTime,
        endTime: new Date(
          session.startDateTime.getTime() +
            session.movie.durationMinutes * 60000,
        ),
        price: session.price,
        format: session.hall.format,
        cinema: {
          id: session.hall.cinema.id,
          name: session.hall.cinema.name,
          slug: session.hall.cinema.slug,
        },
      })),
      nextCursor,
    };
  }
}
