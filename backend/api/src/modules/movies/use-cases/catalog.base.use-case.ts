// use-cases/catalog.base.use-case.ts
import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/shared/prisma/prisma.service";
import { Prisma, SessionState, SessionType } from "src/generated/prisma/client";

export interface CatalogInput {
  cinemaSlug?: string;
  limit: number;
  cursor?: number;
}

const sessionSelect = {
  id: true,
  startDateTime: true,
  price: true,
  sessionType: true,
  hall: {
    select: {
      format: true,
      cinema: { select: { slug: true } },
    },
  },
} satisfies Prisma.SessionMovieSelect;

type SessionRow = Prisma.SessionMovieGetPayload<{
  select: typeof sessionSelect;
}>;

@Injectable()
export abstract class CatalogBaseUseCase {
  // Dia no fuso de Luanda (YYYY-MM-DD), não UTC
  private static readonly dayFormatter = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Africa/Luanda",
  });

  protected static readonly movieCardSelect = {
    id: true,
    title: true,
    slug: true,
    posterUrl: true,
    genres: true,
    durationMinutes: true,
  } satisfies Prisma.MovieSelect;

  constructor(protected readonly prisma: PrismaService) {}

  protected buildSessionWhere(params: {
    type: SessionType;
    from: Date;
    to?: Date;
    cinemaSlug?: string;
  }): Prisma.SessionMovieWhereInput {
    const { type, from, to, cinemaSlug } = params;
    return {
      active: true,
      state: SessionState.AVAILABLE,
      sessionType: type,
      startDateTime: { gte: from, ...(to && { lte: to }) },
      ...(cinemaSlug && { hall: { cinema: { slug: cinemaSlug } } }),
    };
  }

  protected firstSessionPerDay(sessions: SessionRow[]): SessionRow[] {
    const byDay = new Map<string, SessionRow>();
    for (const s of sessions) {
      const key = CatalogBaseUseCase.dayFormatter.format(s.startDateTime);
      if (!byDay.has(key)) byDay.set(key, s);
    }
    return Array.from(byDay.values());
  }

  protected paginate<T extends { id: number }>(rows: T[], limit: number) {
    let nextCursor: number | undefined = undefined;
    if (rows.length > limit) {
      nextCursor = rows.pop()!.id;
    }
    return { items: rows, nextCursor };
  }

  protected toFeedItem(m: {
    id: number;
    title: string;
    slug: string;
    posterUrl: string | null;
    genres: string[];
    sessionMovies: SessionRow[];
  }) {
    const sessions = this.firstSessionPerDay(m.sessionMovies);

    return {
      id: m.id,
      title: m.title,
      slug: m.slug,
      posterUrl: m.posterUrl,
      genres: m.genres,
      formats: Array.from(new Set(sessions.map((s) => s.hall.format))),
      // pré-estreia se tiver pelo menos uma sessão PRE_SALE
      isPreEstreia: sessions.some(
        (s) => s.sessionType === SessionType.PRE_SALE,
      ),
      sessions: sessions.map((s) => ({
        id: s.id,
        startDateTime: s.startDateTime,
        price: s.price,
        cinema: { slug: s.hall.cinema.slug },
      })),
    };
  }

  // Usado por Now Showing e Presale: só mudam o tipo e a janela de datas
  protected async findMoviesWithSessions(
    input: CatalogInput & { type: SessionType; from: Date; to?: Date },
  ) {
    const sessionWhere = this.buildSessionWhere(input);

    const rows = await this.prisma.movie.findMany({
      where: { active: true, sessionMovies: { some: sessionWhere } },
      take: input.limit + 1,
      ...(input.cursor && { cursor: { id: input.cursor }, skip: 1 }),
      orderBy: { id: "desc" },
      select: {
        ...CatalogBaseUseCase.movieCardSelect,
        sessionMovies: {
          where: sessionWhere,
          orderBy: { startDateTime: "asc" },
          select: sessionSelect,
        },
      },
    });

    const { items, nextCursor } = this.paginate(rows, input.limit);

    return {
      items: items.map((m) => this.toFeedItem(m)),
      nextCursor,
    };
  }
}
