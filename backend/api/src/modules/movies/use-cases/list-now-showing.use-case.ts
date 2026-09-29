// use-cases/list-now-showing.use-case.ts
import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/shared/prisma/prisma.service";
import { SessionType } from "src/generated/prisma/client";
import { CatalogBaseUseCase, CatalogInput } from "./catalog.base.use-case";

@Injectable()
export class ListNowShowingUseCase extends CatalogBaseUseCase {
  constructor(prisma: PrismaService) {
    super(prisma);
  }

  execute(input: CatalogInput) {
    const from = new Date(); // agora, para não mostrar sessões que já passaram
    const to = new Date(from);
    to.setDate(to.getDate() + 7);

    return this.findMoviesWithSessions({
      ...input,
      type: SessionType.NORMAL,
      from,
      to,
    });
  }
}
