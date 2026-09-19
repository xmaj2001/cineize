import { type NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { ok, err, handleError } from "@/lib/api/response";
import { locationQuerySchema } from "@/lib/schemas/movies.schema";
import { MovieStatus, type Prisma } from "@/generated/prisma/client";

// ── helpers portados do backend ───────────────────────────────────────────────

type LocationFilter =
  | { room: { locationId: string } }
  | Record<string, never>;

const buildLocationFilter = (locationId?: string): LocationFilter =>
  locationId ? { room: { locationId } } : {};

const getMovieCardSelect = (
  now: Date,
  locationId?: string,
  includeSessions = true,
): Prisma.MovieSelect => ({
  id: true,
  title: true,
  posterUrl: true,
  bannerUrl: true,
  durationMin: true,
  ageRating: true,
  genres: true,
  status: true,
  language: true,
  subtitleLanguage: true,
  synopsis: true,
  ...(includeSessions && {
    sessionMovies: {
      where: {
        startTime: { gte: now },
        ...(locationId && { room: { locationId } }),
      },
      select: {
        id: true,
        type: true,
        startTime: true,
        room: {
          select: { id: true, format: true, locationId: true },
        },
      },
      orderBy: { startTime: "asc" },
    },
  }),
});

const buildNowShowingWhere = (
  now: Date,
  locationFilter: LocationFilter,
): Prisma.MovieWhereInput => ({
  releaseDate: { lte: now },
  status: { not: MovieStatus.ARCHIVED },
  sessionMovies: { some: { startTime: { gte: now }, ...locationFilter } },
});

const buildPresaleWhere = (
  now: Date,
  locationFilter: LocationFilter,
): Prisma.MovieWhereInput => ({
  releaseDate: { gt: now },
  status: { not: MovieStatus.ARCHIVED },
  sessionMovies: {
    some: { saleOpensAt: { lte: now }, startTime: { gt: now }, ...locationFilter },
  },
});

const buildComingSoonWhere = (
  now: Date,
  locationFilter: LocationFilter,
): Prisma.MovieWhereInput => ({
  releaseDate: { gt: now },
  status: { not: MovieStatus.ARCHIVED },
  NOT: {
    sessionMovies: { some: { saleOpensAt: { lte: now }, ...locationFilter } },
  },
});

// ── GET /api/movies/home ───────────────────────────────────────────────────────

/**
 * Feed da Home — devolve destaques, em cartaz, pré-venda e em breve
 * numa única resposta, filtrados pelo cinema (locationId) se enviado.
 *
 * Query params:
 *   ?locationId=uuid   (opcional)
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const parsed = locationQuerySchema.safeParse({
      locationId: searchParams.get("locationId") ?? undefined,
    });

    if (!parsed.success) {
      return err(parsed.error.errors[0]?.message ?? "Query inválido", 400);
    }

    const { locationId } = parsed.data;
    const now = new Date();
    const locationFilter = buildLocationFilter(locationId);

    const [featured, nowShowing, presale, comingSoon] = await Promise.all([
      prisma.movie.findMany({
        where: { featured: true, status: { not: MovieStatus.ARCHIVED } },
        take: 5,
        select: getMovieCardSelect(now, locationId, true),
        orderBy: { createdAt: "desc" },
      }),

      prisma.movie.findMany({
        where: buildNowShowingWhere(now, locationFilter),
        take: 12,
        select: getMovieCardSelect(now, locationId, true),
        orderBy: { createdAt: "desc" },
      }),

      prisma.movie.findMany({
        where: buildPresaleWhere(now, locationFilter),
        take: 12,
        select: getMovieCardSelect(now, locationId, true),
        orderBy: { createdAt: "desc" },
      }),

      prisma.movie.findMany({
        where: buildComingSoonWhere(now, locationFilter),
        take: 12,
        select: getMovieCardSelect(now, locationId, false),
        orderBy: { createdAt: "desc" },
      }),
    ]);

    return ok({ featured, nowShowing, presale, comingSoon });
  } catch (error) {
    return handleError(error);
  }
}
