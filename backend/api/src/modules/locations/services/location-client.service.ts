import { Injectable, Logger, NotFoundException } from "@nestjs/common";
import { PrismaService } from "src/shared/prisma/prisma.service";

@Injectable()
export class LocationClientService {
  private readonly logger = new Logger(LocationClientService.name);

  constructor(private prismaService: PrismaService) {}

  /**
   * Listagem de todas as localizações disponíveis.
   */
  async findAll() {
    this.logger.log("A listar localizações");
    const locations = await this.prismaService.location.findMany({
      orderBy: { name: "asc" },
      select: {
        id: true,
        name: true,
        province: true,
        city: true,
        latitude: true,
        longitude: true,
        address: true,
        phone: true,
      },
    });

    this.logger.log(`Listagem devolveu ${locations.length} localizações`);
    return locations;
  }

  /**
   * Detalhes de uma localização específica, incluindo as suas salas.
   */
  async getLocationById(id: string) {
    this.logger.log(`A buscar detalhes da localização ${id}`);
    const location = await this.prismaService.location.findUnique({
      where: { id },
      include: {
        rooms: {
          select: {
            id: true,
            name: true,
            capacity: true,
            format: true,
          },
          orderBy: { name: "asc" },
        },
      },
    });

    if (!location) {
      this.logger.warn(`Localização ${id} não encontrada`);
      throw new NotFoundException("Localização não encontrada");
    }

    return location;
  }
}
