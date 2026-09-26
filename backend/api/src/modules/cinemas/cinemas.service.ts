import {
  Injectable,
  NotFoundException,
  ConflictException,
} from "@nestjs/common";
import { CreateCinemaDto } from "./dto/create-cinema.dto";
import { UpdateCinemaDto } from "./dto/update-cinema.dto";
import { PrismaService } from "src/shared/prisma/prisma.service";
import { Prisma } from "src/generated/prisma/client";
import { AllowAnonymous } from "@thallesp/nestjs-better-auth";

@Injectable()
export class CinemasService {
  constructor(private readonly prisma: PrismaService) {}

  private parseTime(time: string): Date {
    const [h, m, s] = time.split(":").map(Number);
    const d = new Date();
    d.setHours(h, m || 0, s || 0, 0);
    return d;
  }

  async create(dto: CreateCinemaDto) {
    try {
      return await this.prisma.cinema.create({
        data: {
          locationId: dto.locationId,
          name: dto.name,
          slug: dto.slug,
          description: dto.description,
          address: dto.address,
          latitude: dto.latitude,
          longitude: dto.longitude,
          phone: dto.phone,
          email: dto.email,
          website: dto.website,
          images: dto.images ?? [],
          bannerUrl: dto.bannerUrl,
          openTime: this.parseTime(dto.openTime),
          closeTime: this.parseTime(dto.closeTime),
          active: dto.active ?? true,
        },
        include: { location: true },
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2002"
      ) {
        throw new ConflictException("Cinema with this slug already exists");
      }
      throw error;
    }
  }

  @AllowAnonymous()
  async findAll(params: {
    locationId?: number;
    active?: boolean;
    limit?: number;
    offset?: number;
  }) {
    const { locationId, active = true, limit = 50, offset = 0 } = params;
    return this.prisma.cinema.findMany({
      where: {
        active,
        ...(locationId && { locationId }),
      },
      include: { location: true },
      take: limit,
      skip: offset,
      orderBy: { name: "asc" },
    });
  }

  @AllowAnonymous()
  async findOne(id: number) {
    const cinema = await this.prisma.cinema.findUnique({
      where: { id },
      include: { location: true, halls: true },
    });
    if (!cinema) throw new NotFoundException(`Cinema #${id} not found`);
    return cinema;
  }

  async update(id: number, dto: UpdateCinemaDto) {
    await this.findOne(id);
    const data: Prisma.CinemaUpdateInput = { ...dto };
    if (dto.openTime) data.openTime = this.parseTime(dto.openTime);
    if (dto.closeTime) data.closeTime = this.parseTime(dto.closeTime);
    return this.prisma.cinema.update({
      where: { id },
      data,
      include: { location: true },
    });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.cinema.update({
      where: { id },
      data: { active: false },
    });
  }
}
