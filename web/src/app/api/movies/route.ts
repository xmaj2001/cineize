import { type NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { ok, err, handleError } from "@/lib/api/response";
import { listMoviesSchema } from "@/lib/schemas/movies.schema";
import { MovieStatus, type Prisma } from "@/generated/prisma/client";

// ── helpers (idênticos aos do home/route.ts — partilhados via schema) ─────────

type LocationFilter =
  | { room: { locationId: string } }
  | Record<string, never>;

const buildLocationFilter = (locationId?: string): LocationFilter =>
  locationId ? { room: { locationId } } : {};

const buildNowShowingWhere = (
  now: Date,
  locationFilter: LocationFilter,
): Prisma.MovieWhereInput => ({
  releaseDate: { lte: now },
  sessionMovies: { some: { startTime: { gte: now }, ...locationFilter } },
});

const buildPresaleWhere = (
  now: Date,
  locationFilter: LocationFilter,
): Prisma.MovieWhereInput => ({
  releaseDate: { gt: now },
  sessionMovies: {
    some: { saleOpensAt: { lte: now }, startTime: { gt: now }, ...locationFilter },
  },
});

const buildComingSoonWhere = (
  now: Date,
  locationFilter: LocationFilter,
): Prisma.MovieWhereInput => ({
  releaseDate: { gt: now },
  NOT: {
    sessionMovies: { some: { saleOpensAt: { lte: now }, ...locationFilter } },
  },
});

const calculateMovieStatus = (
  releaseDate: Date,
  sessions: { startTime: Date; saleOpensAt: Date }[],
  now: Date,
) => {
  const isReleased = releaseDate <= now;
  const hasFutureSessions = sessions.some((s) => s.startTime >= now);
  if (isReleased && hasFutureSessions) return "NOW_SHOWING";
  const hasPresaleSessions = sessions.some(
    (s) => s.saleOpensAt <= now && s.startTime > now,
  );
  if (!isReleased && hasPresaleSessions) return "PRESALE";
  return "COMING_SOON";
};

// ── GET /api/movies ────────────────────────────────────────────────────────────

/**
 * Listagem paginada de filmes com filtros.
 *
 * Query params:
 *   ?locationId=uuid
 *   ?search=texto
 *   ?status=nowShowing|presale|comingSoon
 *   ?cursor=uuid           (paginação cursor-based)
 *   ?limit=20              (default 20, máx 100)
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;

    const parsed = listMoviesSchema.safeParse({
      locationId: searchParams.get("locationId") ?? undefined,
      search: searchParams.get("search") ?? undefined,
      status: searchParams.get("status") ?? undefined,
      cursor: searchParams.get("cursor") ?? undefined,
      limit: searchParams.get("limit") ?? undefined,
    });

    if (!parsed.success) {
      return err(parsed.error.errors[0]?.message ?? "Query inválido", 400);
    }

    const { locationId, search, status, cursor, limit } = parsed.data;
    const now = new Date();
    const locationFilter = buildLocationFilter(locationId);

    // Condições base: excluir filmes arquivados
    const conditions: Prisma.MovieWhereInput[] = [
      { status: { not: MovieStatus.ARCHIVED } },
    ];

    if (search) {
      conditions.push({ title: { contains: search, mode: "insensitive" } });
    }

    // Filtros de status
    if (status === "nowShowing") {
      conditions.push(buildNowShowingWhere(now, locationFilter));
    } else if (status === "presale") {
      conditions.push(buildPresaleWhere(now, locationFilter));
    } else if (status === "comingSoon") {
      conditions.push(buildComingSoonWhere(now, locationFilter));
    } else if (locationId) {
      conditions.push({ sessionMovies: { some: { room: { locationId } } } });
    }

    const where: Prisma.MovieWhereInput = { AND: conditions };

    const items = await prisma.movie.findMany({
      where,
      include: {
        sessionMovies: {
          where: {
            startTime: { gte: now },
            ...locationFilter,
          },
          select: { startTime: true, saleOpensAt: true },
        },
      },
      orderBy: { createdAt: "desc" },
      take: limit + 1,
      ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
    });

    // Paginação cursor-based
    let nextCursor: string | undefined = undefined;
    if (items.length > limit) {
      const nextItem = items.pop();
      nextCursor = nextItem?.id;
    }

    // Mapear adicionando o displayStatus calculado
    const formattedItems = items.map((movie) => {
      const { sessionMovies, ...movieData } = movie;
      const displayStatus = calculateMovieStatus(
        movie.releaseDate,
        sessionMovies,
        now,
      );
      return { ...movieData, displayStatus };
    });

    return ok({ items: formattedItems, nextCursor: nextCursor ?? null });
  } catch (error) {
    return handleError(error);
  }
}
