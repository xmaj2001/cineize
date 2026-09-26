import {
  Injectable,
  NotFoundException,
  ConflictException,
} from "@nestjs/common";
import { CreateLocationDto } from "./dto/create-location.dto";
import { UpdateLocationDto } from "./dto/update-location.dto";
import { PrismaService } from "src/shared/prisma/prisma.service";
import { Prisma } from "src/generated/prisma/client";

@Injectable()
export class LocationsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateLocationDto) {
    return await this.prisma.location.create({
      data: {
        name: dto.name,
        province: dto.province,
        country: dto.country ?? "Angola",
        latitude: dto.latitude,
        longitude: dto.longitude,
        active: dto.active ?? true,
      },
    });
  }
  async findAll(params: {
    province?: string;
    active?: boolean;
    limit?: number;
    offset?: number;
  }) {
    const { province, active = true, limit = 50, offset = 0 } = params;
    return this.prisma.location.findMany({
      where: {
        ...(province && { province }),
        active,
      },
      take: limit,
      skip: offset,
      orderBy: { name: "asc" },
    });
  }
  async findOne(id: number) {
    const location = await this.prisma.location.findUnique({ where: { id } });
    if (!location) {
      throw new NotFoundException(`Location #${id} not found`);
    }
    return location;
  }

  async update(id: number, dto: UpdateLocationDto) {
    await this.findOne(id);
    try {
      return await this.prisma.location.update({
        where: { id },
        data: dto,
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2002"
      ) {
        throw new ConflictException(
          "Location with this name and province already exists",
        );
      }
      throw error;
    }
  }

  async remove(id: number) {
    await this.findOne(id);
    // Soft delete
    return this.prisma.location.update({
      where: { id },
      data: { active: false },
    });
  }
}
