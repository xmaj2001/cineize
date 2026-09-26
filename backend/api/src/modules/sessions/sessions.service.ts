import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from "@nestjs/common";
import { CreateSessionDto } from "./dto/create-session.dto";
import { UpdateSessionDto } from "./dto/update-session.dto";
import { PrismaService } from "src/shared/prisma/prisma.service";
import { SessionState, SessionType } from "src/generated/prisma/enums";
import { Prisma } from "src/generated/prisma/client";

@Injectable()
export class SessionsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateSessionDto) {
    const hall = await this.prisma.hall.findUnique({
      where: { id: dto.hallId },
    });
    if (!hall) throw new NotFoundException(`Hall #${dto.hallId} not found`);

    const movie = await this.prisma.movie.findUnique({
      where: { id: dto.movieId },
    });
    if (!movie) throw new NotFoundException(`Movie #${dto.movieId} not found`);

    const startDateTime = new Date(dto.startDateTime);
    if (startDateTime <= new Date()) {
      throw new BadRequestException("startDateTime must be in the future");
    }

    let price = dto.price;
    if (price === undefined) {
      // Preço base do filme (em produção usaria ConfigHorario/Formato/Prevenda)
      price = Number(movie.basePrice);
    }

    const sessionType =
      dto.sessionType ??
      (dto.exhibitionId ? SessionType.PRE_SALE : SessionType.NORMAL);

    try {
      return await this.prisma.sessionMovie.create({
        data: {
          movieId: dto.movieId,
          hallId: dto.hallId,
          exhibitionId: dto.exhibitionId,
          startDateTime,
          price,
          sessionType,
          capacity: hall.capacity,
          currentOccupancy: 0,
          state: SessionState.AVAILABLE,
        },
        include: { movie: true, hall: true, exhibition: true },
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2002"
      ) {
        throw new ConflictException("Hall is already occupied at this time");
      }
      throw error;
    }
  }

  async findSessionsByMovieSlug(
    slug: string,
    limit: number,
    cursor?: number,
    cinemaId?: number,
  ) {
    const sessions = await this.prisma.sessionMovie.findMany({
      where: {
        movie: { slug },
        ...(cinemaId && { hall: { cinemaId } }),
        startDateTime: { gte: new Date() }, // Apenas sessões no futuro
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
            cinema: {
              select: {
                name: true,
                slug: true,
              },
            },
          },
        },
        movie: {
          select: {
            durationMinutes: true,
          },
        },
      },
    });

    let nextCursor: number | undefined = undefined;
    if (sessions.length > limit) {
      const nextItem = sessions.pop();
      nextCursor = nextItem!.id;
    }

    const formattedSessions = sessions.map((session) => ({
      id: session.id,
      startTime: session.startDateTime,
      endTime: new Date(
        session.startDateTime.getTime() + session.movie.durationMinutes * 60000,
      ),
      price: session.price,
      format: session.hall.format,
      cinema: {
        name: session.hall.cinema.name,
        slug: session.hall.cinema.slug,
      },
    }));

    return {
      items: formattedSessions,
      nextCursor,
    };
  }

  async findSessionsByMovieSlugDaysSummary(slug: string) {
    const sessions = await this.prisma.sessionMovie.findMany({
      where: {
        movie: { slug },
        startDateTime: { gte: new Date() },
        active: true,
        state: SessionState.AVAILABLE,
      },
      select: {
        startDateTime: true,
      },
      orderBy: { startDateTime: "asc" },
    });

    // Agrupa por dia e conta sessões
    const dayMap = new Map<string, number>();

    sessions.forEach((session) => {
      const dayKey = session.startDateTime.toISOString().split("T")[0]; // YYYY-MM-DD
      dayMap.set(dayKey, (dayMap.get(dayKey) || 0) + 1);
    });

    // Converte para array
    const days = Array.from(dayMap.entries()).map(([date, count]) => ({
      date,
      count,
    }));

    return days;
  }
  async findSessionsByMovieSlugAndDay(
    slug: string,
    date: string, // Format: YYYY-MM-DD
    cinemaId?: number,
    limit: number = 10,
    cursor?: number,
  ) {
    // Parse a data
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const sessions = await this.prisma.sessionMovie.findMany({
      where: {
        movie: { slug },
        ...(cinemaId && { hall: { cinemaId } }),
        startDateTime: { gte: startOfDay, lte: endOfDay },
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
            cinema: {
              select: {
                id: true,
                name: true,
                slug: true,
              },
            },
          },
        },
        movie: {
          select: {
            durationMinutes: true,
          },
        },
      },
    });

    let nextCursor: number | undefined = undefined;
    if (sessions.length > limit) {
      const nextItem = sessions.pop();
      nextCursor = nextItem!.id;
    }

    const formattedSessions = sessions.map((session) => ({
      id: session.id,
      startTime: session.startDateTime,
      endTime: new Date(
        session.startDateTime.getTime() + session.movie.durationMinutes * 60000,
      ),
      price: session.price,
      format: session.hall.format,
      cinema: {
        id: session.hall.cinema.id,
        name: session.hall.cinema.name,
        slug: session.hall.cinema.slug,
      },
    }));

    return {
      items: formattedSessions,
      nextCursor,
    };
  }
  async findOne(id: number) {
    const session = await this.prisma.sessionMovie.findUnique({
      where: { id },
      include: {
        movie: true,
        hall: { include: { cinema: true } },
        exhibition: true,
      },
    });
    if (!session) throw new NotFoundException(`Session #${id} not found`);
    return session;
  }

  async update(id: number, dto: UpdateSessionDto) {
    await this.findOne(id);
    return this.prisma.sessionMovie.update({
      where: { id },
      data: dto,
      include: { movie: true, hall: true },
    });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.sessionMovie.update({
      where: { id },
      data: { state: SessionState.CANCELED, active: false },
    });
  }
}
