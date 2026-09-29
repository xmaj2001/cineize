import { Injectable } from "@nestjs/common";
import { SessionState } from "src/generated/prisma/enums";
import { PrismaService } from "src/shared/prisma/prisma.service";

@Injectable()
export class FindSessionsByMovieSlugUseCase {
  constructor(private readonly prisma: PrismaService) {}

  async execute(
    slug: string,
    limit: number,
    cursor?: number,
    cinemaId?: number,
  ) {
    const sessions = await this.prisma.sessionMovie.findMany({
      where: {
        movie: { slug },
        ...(cinemaId && { hall: { cinemaId } }),
        startDateTime: { gte: new Date() },
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
            cinema: { select: { name: true, slug: true } },
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
          name: session.hall.cinema.name,
          slug: session.hall.cinema.slug,
        },
      })),
      nextCursor,
    };
  }
}
