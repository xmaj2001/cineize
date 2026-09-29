import { Injectable } from "@nestjs/common";
import { SessionState } from "src/generated/prisma/enums";
import { PrismaService } from "src/shared/prisma/prisma.service";
import { FindSessionUseCase } from "./find-session.use-case";

@Injectable()
export class CancelSessionUseCase {
  constructor(
    private readonly prisma: PrismaService,
    private readonly findSession: FindSessionUseCase,
  ) {}

  async execute(id: number) {
    await this.findSession.execute(id);
    return this.prisma.sessionMovie.update({
      where: { id },
      data: { state: SessionState.CANCELED, active: false },
    });
  }
}
