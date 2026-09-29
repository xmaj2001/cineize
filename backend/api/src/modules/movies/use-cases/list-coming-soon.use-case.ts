// use-cases/list-coming-soon.use-case.ts
import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/shared/prisma/prisma.service";
import { SessionState } from "src/generated/prisma/client";
import { CatalogBaseUseCase } from "./catalog.base.use-case";

@Injectable()
export class ListComingSoonUseCase extends CatalogBaseUseCase {
  constructor(prisma: PrismaService) {
    super(prisma);
  }

  async execute(input: { limit: number; cursor?: number }) {
    const now = new Date();

    const rows = await this.prisma.movie.findMany({
      where: {
        active: true,
        worldLaunchDate: { gt: now },
        // sem nenhuma sessão à venda (nem normal nem pré-venda)
        sessionMovies: {
          none: {
            active: true,
            state: SessionState.AVAILABLE,
            startDateTime: { gte: now },
          },
        },
      },
      take: input.limit + 1,
      ...(input.cursor && { cursor: { id: input.cursor }, skip: 1 }),
      orderBy: [{ worldLaunchDate: "asc" }, { id: "asc" }],
      select: {
        ...CatalogBaseUseCase.movieCardSelect,
        worldLaunchDate: true,
      },
    });

    return this.paginate(rows, input.limit);
  }
}
