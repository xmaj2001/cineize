// use-cases/list-presale.use-case.ts
import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/shared/prisma/prisma.service";
import { SessionType } from "src/generated/prisma/client";
import { CatalogBaseUseCase, CatalogInput } from "./catalog.base.use-case";

@Injectable()
export class ListPresaleUseCase extends CatalogBaseUseCase {
  constructor(prisma: PrismaService) {
    super(prisma);
  }

  execute(input: CatalogInput) {
    return this.findMoviesWithSessions({
      ...input,
      type: SessionType.PRE_SALE,
      from: new Date(),
    });
  }
}
