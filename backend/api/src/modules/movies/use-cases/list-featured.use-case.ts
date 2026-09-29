import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/shared/prisma/prisma.service";
import { Prisma } from "src/generated/prisma/client";

export interface ListFeaturedInput {
  cinemaSlug?: string;
  limit?: number;
}

@Injectable()
export class ListFeaturedUseCase {
  private static readonly DEFAULT_LIMIT = 5;

  constructor(private readonly prisma: PrismaService) {}

  async execute(input: ListFeaturedInput) {
    const now = new Date();
    const limit = input.limit ?? ListFeaturedUseCase.DEFAULT_LIMIT;

    // Destaque global (cinemaId null) + destaque do cinema pedido, se houver
    const cinemaScope: Prisma.FeaturedMovieWhereInput[] = [{ cinemaId: null }];
    if (input.cinemaSlug) {
      cinemaScope.push({ cinema: { slug: input.cinemaSlug } });
    }

    const rows = await this.prisma.featuredMovie.findMany({
      where: {
        active: true,
        startsAt: { lte: now },
        AND: [
          { OR: [{ endsAt: null }, { endsAt: { gte: now } }] },
          { OR: cinemaScope },
        ],
        movie: { active: true },
      },
      orderBy: [{ priority: "desc" }, { startsAt: "desc" }],
      // pede a mais para compensar duplicados removidos abaixo
      take: limit * 2,
      select: {
        headline: true,
        bannerUrl: true,
        movie: {
          select: {
            id: true,
            title: true,
            slug: true,
            posterUrl: true,
            backdropUrl: true,
            trailerUrl: true,
          },
        },
      },
    });

    // Se o mesmo filme estiver em destaque global e no cinema, fica só o de maior prioridade
    const seen = new Set<number>();
    const items: any[] = [];

    for (const row of rows) {
      if (seen.has(row.movie.id)) continue;
      seen.add(row.movie.id);

      items.push({
        id: row.movie.id,
        title: row.movie.title,
        slug: row.movie.slug,
        posterUrl: row.movie.posterUrl,
        trailerUrl: row.movie.trailerUrl,
        headline: row.headline,
        bannerUrl: row.bannerUrl ?? row.movie.backdropUrl,
      });

      if (items.length === limit) break;
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return items;
  }
}
