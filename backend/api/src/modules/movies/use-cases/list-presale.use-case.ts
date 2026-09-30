import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/shared/prisma/prisma.service";
import { ExhibitionType, SessionState } from "src/generated/prisma/client";
import { CatalogInput } from "../dto/create-movie.dto";

@Injectable()
export class ListPresaleUseCase {
  constructor(private readonly prisma: PrismaService) {}

  async execute({ limit, cursor }: CatalogInput) {
    const now = new Date();

    const activePresale = {
      active: true,
      type: ExhibitionType.PRE_SALE,
      startDate: { lte: now },
      OR: [{ endDate: null }, { endDate: { gte: now } }],
    };

    const movies = await this.prisma.movie.findMany({
      where: {
        active: true,
        worldLaunchDate: { gt: now },
        exhibitions: { some: activePresale },
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
            startDateTime: { gte: now },
            exhibition: { type: ExhibitionType.PRE_SALE },
          },
          distinct: ["hallId"],
          select: {
            id: true,
            startDateTime: true,
            sessionType: true,
            price: true,
            hall: {
              select: {
                format: true,
                cinema: {
                  select: {
                    slug: true,
                  },
                },
              },
            },
          },
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
      isPreEstreia: true,
      sessions: sessionMovies.map((s) => ({
        ...s,
        cinemaSlug: s.hall.cinema.slug,
      })),
    }));

    return { items, nextCursor };
  }
}
