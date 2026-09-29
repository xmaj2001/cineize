import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { Prisma } from "src/generated/prisma/client";
import { SessionState, SessionType } from "src/generated/prisma/enums";
import { PrismaService } from "src/shared/prisma/prisma.service";
import { CreateSessionDto } from "../dto/create-session.dto";

@Injectable()
export class CreateSessionUseCase {
  constructor(private readonly prisma: PrismaService) {}

  async execute(dto: CreateSessionDto) {
    const hall = await this.prisma.hall.findUnique({
      where: { id: dto.hallId },
    });
    if (!hall) throw new NotFoundException(`Hall #${dto.hallId} not found`);
    const movie = await this.prisma.movie.findUnique({
      where: { id: dto.movieId },
    });
    if (!movie) throw new NotFoundException(`Movie #${dto.movieId} not found`);

    const startDateTime = new Date(dto.startDateTime);
    if (startDateTime <= new Date())
      throw new BadRequestException("startDateTime must be in the future");
    const price = dto.price ?? Number(movie.basePrice);
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
}
