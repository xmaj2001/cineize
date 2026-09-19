import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Logger,
} from "@nestjs/common";
import { PrismaService } from "src/shared/prisma/prisma.service";
import { CreatePresaleSubscriptionDto } from "../dtos/create-presale-subscription.dto";

@Injectable()
export class PresaleSubscriptionClientService {
  private readonly logger = new Logger(PresaleSubscriptionClientService.name);

  constructor(private readonly prisma: PrismaService) {}

  async createSubscription(movieId: string, dto: CreatePresaleSubscriptionDto) {
    if (!dto.email && !dto.whatsapp) {
      throw new BadRequestException(
        "Deve fornecer pelo menos um email ou whatsapp.",
      );
    }

    const movie = await this.prisma.movie.findUnique({
      where: { id: movieId },
    });

    if (!movie) {
      throw new NotFoundException("Filme não encontrado.");
    }

    const existingSubscription =
      await this.prisma.presaleSubscription.findFirst({
        where: {
          movieId,
          OR: [
            ...(dto.email ? [{ email: dto.email }] : []),
            ...(dto.whatsapp ? [{ whatsapp: dto.whatsapp }] : []),
          ],
        },
      });

    if (existingSubscription) {
      const campo =
        existingSubscription.email === dto.email
          ? "email"
          : "número de WhatsApp";
      throw new BadRequestException(
        `Este ${campo} já está inscrito para este filme.`,
      );
    }

    const subscription = await this.prisma.presaleSubscription.create({
      data: {
        movieId,
        email: dto.email,
        whatsapp: dto.whatsapp,
      },
    });

    this.logger.log(`Nova subscrição criada para o filme ${movieId}`);
    return subscription;
  }
}
