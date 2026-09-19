import { type NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { ok, err, handleError } from "@/lib/api/response";
import { locationQuerySchema } from "@/lib/schemas/movies.schema";
import { MovieStatus } from "@/generated/prisma/client";

// ── GET /api/movies/[id] ───────────────────────────────────────────────────────

/**
 * Detalhes de um filme + sessões futuras.
 *
 * Query params:
 *   ?locationId=uuid   (opcional — filtra sessões pelo cinema)
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id: movieId } = await params;

    const { searchParams } = request.nextUrl;
    const parsed = locationQuerySchema.safeParse({
      locationId: searchParams.get("locationId") ?? undefined,
    });

    if (!parsed.success) {
      return err(parsed.error.errors[0]?.message ?? "Query inválido", 400);
    }

    const { locationId } = parsed.data;
    const now = new Date();

    // 1. Validar existência do filme (sem carregar dados pesados)
    const movieBase = await prisma.movie.findFirst({
      where: { id: movieId, status: { not: MovieStatus.ARCHIVED } },
      select: { id: true, releaseDate: true },
    });

    if (!movieBase) {
      return err("Filme não encontrado", 404);
    }

    const isFutureRelease = movieBase.releaseDate > now;

    // 2. Para filmes futuros, verificar pré-venda ativa
    let isPresaleActive = false;
    if (isFutureRelease) {
      const activePresaleSession = await prisma.sessionMovie.findFirst({
        where: {
          movieId,
          saleOpensAt: { lte: now },
          startTime: { gt: now },
          ...(locationId && { room: { locationId } }),
        },
        select: { id: true },
      });
      isPresaleActive = !!activePresaleSession;
    }

    // 3. Calcular displayStatus
    const isComingSoon = isFutureRelease && !isPresaleActive;
    const displayStatus: string = isComingSoon
      ? "COMING_SOON"
      : isFutureRelease
        ? "PRESALE"
        : "NOW_SHOWING";

    // 4. Buscar o filme completo (sem JOIN de sessões se for "em breve")
    const sessionMoviesInclude = isComingSoon
      ? false
      : {
          where: {
            startTime: { gte: now },
            ...(locationId && { room: { locationId } }),
          },
          include: {
            room: {
              select: {
                id: true,
                name: true,
                format: true,
                location: {
                  select: {
                    id: true,
                    name: true,
                    province: true,
                    city: true,
                    latitude: true,
                    longitude: true,
                  },
                },
              },
            },
          },
          orderBy: { startTime: "asc" as const },
        };

    const movie = await prisma.movie.findUnique({
      where: { id: movieId },
      include: { sessionMovies: sessionMoviesInclude },
    });

    return ok({
      ...movie,
      sessionMovies: movie?.sessionMovies ?? [],
      displayStatus,
    });
  } catch (error) {
    return handleError(error);
  }
}
