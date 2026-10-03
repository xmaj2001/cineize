import {
  Injectable,
  NotFoundException,
  ConflictException,
} from "@nestjs/common";
import { CreateMovieDto } from "./dto/create-movie.dto";
import { UpdateMovieDto } from "./dto/update-movie.dto";
import { PrismaService } from "src/shared/prisma/prisma.service";
import {
  AgeRating,
  ExhibitionType,
  Prisma,
  SessionState,
} from "src/generated/prisma/client";

@Injectable()
export class MoviesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateMovieDto) {
    try {
      return await this.prisma.movie.create({
        data: {
          title: dto.title,
          slug: dto.slug,
          synopsis: dto.synopsis,
          durationMinutes: dto.durationMinutes,
          genres: dto.genres,
          ageRating: dto.ageRating,
          director: dto.director,
          cast: dto.cast ?? [],
          worldLaunchDate: dto.worldLaunchDate
            ? new Date(dto.worldLaunchDate)
            : null,
          basePrice: dto.basePrice,
          posterUrl: dto.posterUrl,
          backdropUrl: dto.backdropUrl,
          trailerUrl: dto.trailerUrl,
          active: dto.active ?? true,
        },
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2002"
      ) {
        throw new ConflictException("Movie with this slug already exists");
      }
      throw error;
    }
  }

  async findFeed(params: {
    genre?: string;
    ageRating?: string;
    active?: boolean;
    search?: string;
    limit: number;
    cursor?: number;
  }) {
    const { genre, ageRating, active = true, search, limit, cursor } = params;

    // Intervalo de datas: Hoje até aos próximos 7 dias
    const now = new Date();
    now.setHours(0, 0, 0, 0); // Começa do início do dia

    const nextWeek = new Date(now);
    nextWeek.setDate(now.getDate() + 7);
    nextWeek.setHours(23, 59, 59, 999); // Até ao final do dia

    const movies = await this.prisma.movie.findMany({
      where: {
        active,
        ...(ageRating && { ageRating: ageRating as AgeRating }),
        ...(genre && { genres: { has: genre } }),
        ...(search && {
          OR: [
            { title: { contains: search, mode: "insensitive" } },
            { synopsis: { contains: search, mode: "insensitive" } },
          ],
        }),
      },
      take: limit + 1,
      ...(cursor && { cursor: { id: cursor }, skip: 1 }),
      orderBy: { id: "desc" },
      select: {
        id: true,
        title: true,
        slug: true,
        posterUrl: true,
        genres: true,
        durationMinutes: true,
        sessionMovies: {
          where: {
            startDateTime: { gte: now, lte: nextWeek },
            active: true,
            state: SessionState.AVAILABLE,
          },
          orderBy: { startDateTime: "asc" },
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
    });

    let nextCursor: number | undefined = undefined;
    if (movies.length > limit) {
      const nextItem = movies.pop();
      nextCursor = nextItem!.id;
    }

    // ✅ PASSO 2: Mapear filmes e agrupar sessões por dia (SÓ UMA POR DIA)
    const items = movies.map((m) => {
      // Agrupa sessões por dia e pega a primeira
      const sessionsByDay = new Map<string, (typeof m.sessionMovies)[0]>();

      m.sessionMovies.forEach((session) => {
        const dayKey = session.startDateTime.toISOString().split("T")[0]; // YYYY-MM-DD

        // Se não tem sessão esse dia, adiciona a primeira
        if (!sessionsByDay.has(dayKey)) {
          sessionsByDay.set(dayKey, session);
        }
      });

      // Converte de volta para array
      const uniqueSessions = Array.from(sessionsByDay.values());

      // Extrai formatos únicos
      const formats = Array.from(
        new Set(uniqueSessions.map((s) => s.hall.format)),
      );

      // É pré-estreia se tiver pelo menos uma sessão do tipo PRE_SALE
      const isPreEstreia = uniqueSessions.some(
        (s) => s.sessionType === "PRE_SALE",
      );

      return {
        id: m.id,
        title: m.title,
        slug: m.slug,
        posterUrl: m.posterUrl,
        genres: m.genres,
        formats,
        isPreEstreia,
        sessions: uniqueSessions.map((s) => ({
          id: s.id,
          startDateTime: s.startDateTime,
          price: s.price,
          cinema: {
            slug: s.hall.cinema.slug,
          },
        })),
      };
    });

    return {
      items,
      nextCursor,
    };
  }
  async findOne(id: number) {
    const movie = await this.prisma.movie.findUnique({
      where: { id },
      include: { exhibitions: true },
    });
    if (!movie) throw new NotFoundException(`Movie #${id} not found`);
    return movie;
  }

  async findMovieBySlug(slug: string) {
    const now = new Date();
    // TODO: Performa essa consulta
    const movie = await this.prisma.movie.findUnique({
      where: { slug },
      select: {
        id: true,
        title: true,
        slug: true,
        synopsis: true,
        durationMinutes: true,
        genres: true,
        ageRating: true,
        director: true,
        cast: true,
        worldLaunchDate: true,
        basePrice: true,
        posterUrl: true,
        backdropUrl: true,
        trailerUrl: true,
        // Verifica se há pré-venda ativa
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
        // Verifica se existem sessões futuras disponíveis
        sessionMovies: {
          where: {
            active: true,
            startDateTime: { gte: now },
          },
          take: 1,
          select: { id: true },
        },
      },
    });

    if (!movie) {
      throw new NotFoundException(`Movie with slug ${slug} not found`);
    }

    // Mesma lógica de determinação de status do teu UseCase
    const hasSessions = movie.sessionMovies.length > 0;
    const hasActivePresale = movie.exhibitions.length > 0;
    const isFutureRelease = movie.worldLaunchDate
      ? movie.worldLaunchDate > now
      : false;

    let status: any;

    if (isFutureRelease) {
      status = hasActivePresale ? "PRESALE" : "COMING_SOON";
    } else {
      status = "NOW_SHOWING";
    }

    // Extrai as relações temporárias para retornar o DTO limpo
    const { ...movieData } = movie;

    return {
      ...movieData,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      status,
      hasSessions,
    };
  }

  async update(id: number, dto: UpdateMovieDto) {
    await this.findOne(id);
    return this.prisma.movie.update({
      where: { id },
      data: {
        ...dto,
        worldLaunchDate: dto.worldLaunchDate
          ? new Date(dto.worldLaunchDate)
          : undefined,
      },
    });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.movie.update({
      where: { id },
      data: { active: false },
    });
  }
}
