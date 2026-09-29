import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/shared/prisma/prisma.service";
import { UpdateSessionDto } from "../dto/update-session.dto";
import { FindSessionUseCase } from "./find-session.use-case";

@Injectable()
export class UpdateSessionUseCase {
  constructor(
    private readonly prisma: PrismaService,
    private readonly findSession: FindSessionUseCase,
  ) {}

  async execute(id: number, dto: UpdateSessionDto) {
    await this.findSession.execute(id);
    return this.prisma.sessionMovie.update({
      where: { id },
      data: dto,
      include: { movie: true, hall: true },
    });
  }
}
