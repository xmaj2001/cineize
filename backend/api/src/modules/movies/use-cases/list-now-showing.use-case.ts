import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/shared/prisma/prisma.service";
import { SessionState } from "src/generated/prisma/client";
import { CatalogInput } from "../dto/create-movie.dto";

@Injectable()
export class ListNowShowingUseCase {
  constructor(private readonly prisma: PrismaService) {}

  async execute({ limit, cursor }: CatalogInput) {
    const now = new Date();
    const weekAhead = new Date(now);
    weekAhead.setDate(weekAhead.getDate() + 7);

    const movies = await this.prisma.movie.findMany({
      where: {
        active: true,
        worldLaunchDate: { lte: now }, // já estreou (com ou sem sessões)
      },
      select: {
        id: true,
        title: true,
        slug: true,
        posterUrl: true,
        genres: true,
        durationMinutes: true,
        worldLaunchDate: true,
        sessionMovies: {
          where: {
            active: true,
            state: SessionState.AVAILABLE,
            // startDateTime: { gte: now, lte: weekAhead },
          },
          distinct: ["hallId"],
          select: { hall: { select: { format: true } } },
        },
      },
      orderBy: { id: "desc" },
      take: limit + 1,
      ...(cursor && { cursor: { id: cursor }, skip: 1 }),
    });

    const nextCursor = movies.length > limit ? movies.pop()!.id : undefined;

    const items = movies.map(({ sessionMovies, ...movie }) => ({
      ...movie,
      formats: [...new Set(sessionMovies.map((s) => s.hall.format))],
      sessions: [],
    }));

    return { items, nextCursor };
  }
}
