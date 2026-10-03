import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/shared/prisma/prisma.service";
import { Prisma, ExhibitionType } from "src/generated/prisma/client";

export interface ListFeaturedInput {
  cinemaSlug?: string;
  limit?: number;
}

export type MovieStatus = "NOW_SHOWING" | "COMING_SOON" | "PRESALE";

export interface FeaturedMovieOutput {
  id: number;
  title: string;
  slug: string;
  posterUrl: string | null;
  trailerUrl: string | null;
  headline: string | null;
  bannerUrl: string | null;
  genres: string[];
  ageRating: string;
  synopsis: string;
  durationMinutes: number;
  status: MovieStatus;
  hasSessions: boolean;
}

@Injectable()
export class ListFeaturedUseCase {
  private static readonly DEFAULT_LIMIT = 5;

  constructor(private readonly prisma: PrismaService) {}

  async execute(input: ListFeaturedInput): Promise<FeaturedMovieOutput[]> {
    const now = new Date();
    const limit = input.limit ?? ListFeaturedUseCase.DEFAULT_LIMIT;

    const cinemaScope: Prisma.FeaturedMovieWhereInput[] = [{ cinemaId: null }];
    if (input.cinemaSlug) {
      cinemaScope.push({ cinema: { slug: input.cinemaSlug } });
    }

    const sessionCinemaFilter: Prisma.SessionMovieWhereInput = input.cinemaSlug
      ? { hall: { cinema: { slug: input.cinemaSlug } } }
      : {};

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
            genres: true,
            ageRating: true,
            synopsis: true,
            durationMinutes: true,
            worldLaunchDate: true,
            // Verifica se há pré-vendas ativas
            exhibitions: {
              where: {
                active: true,
                type: ExhibitionType.PRE_SALE,
                startDate: { lte: now },
                OR: [{ endDate: null }, { endDate: { gte: now } }],
              },
              take: 1,
              select: { id: true },
            },
            // Verifica se tem sessões futuras/ativas
            sessionMovies: {
              where: {
                active: true,
                startDateTime: { gte: now },
                ...sessionCinemaFilter,
              },
              take: 1,
              select: { id: true },
            },
          },
        },
      },
    });

    const seen = new Set<number>();
    const items: FeaturedMovieOutput[] = [];

    for (const row of rows) {
      const { movie } = row;
      if (seen.has(movie.id)) continue;
      seen.add(movie.id);

      const hasSessions = movie.sessionMovies.length > 0;
      const hasActivePresale = movie.exhibitions.length > 0;
      const isFutureRelease = movie.worldLaunchDate
        ? movie.worldLaunchDate > now
        : false;

      // Determinação estrita do Status
      let status: MovieStatus;

      if (isFutureRelease) {
        status = hasActivePresale ? "PRESALE" : "COMING_SOON";
      } else {
        status = "NOW_SHOWING";
      }

      items.push({
        id: movie.id,
        title: movie.title,
        slug: movie.slug,
        posterUrl: movie.posterUrl,
        trailerUrl: movie.trailerUrl,
        headline: row.headline,
        bannerUrl: row.bannerUrl ?? movie.backdropUrl,
        genres: movie.genres,
        ageRating: movie.ageRating,
        synopsis: movie.synopsis,
        durationMinutes: movie.durationMinutes,
        status,
        hasSessions,
      });

      if (items.length === limit) break;
    }

    return items;
  }
}
