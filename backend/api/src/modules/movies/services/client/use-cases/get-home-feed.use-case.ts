import { Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "src/shared/prisma/prisma.service";
import { MovieStatus } from "src/generated/prisma/client";
import {
    buildComingSoonWhere,
    buildLocationFilter,
    buildNowShowingWhere,
    buildPresaleWhere,
    getMovieCardSelect,
} from "../movie-query.helpers";

@Injectable()
export class GetHomeFeedUseCase {
    private readonly logger = new Logger(GetHomeFeedUseCase.name);

    constructor(private readonly prisma: PrismaService) { }

    async execute(locationId?: string) {
        this.logger.log(
            `A montar feed da home${locationId ? ` para locationId=${locationId}` : " (sem filtro de cinema)"}`,
        );

        const now = new Date();
        const locationFilter = buildLocationFilter(locationId);

        try {
            const [featured, nowShowing, presale, comingSoon] = await Promise.all([
                this.prisma.movie.findMany({
                    where: { featured: true, status: { not: MovieStatus.ARCHIVED } },
                    take: 5,
                    select: getMovieCardSelect(now, locationId, true),
                    orderBy: { createdAt: "desc" },
                }),

                this.prisma.movie.findMany({
                    where: buildNowShowingWhere(now, locationFilter),
                    take: 12,
                    select: getMovieCardSelect(now, locationId, true),
                    orderBy: { createdAt: "desc" },
                }),

                this.prisma.movie.findMany({
                    where: buildPresaleWhere(now, locationFilter),
                    take: 12,
                    select: getMovieCardSelect(now, locationId, true),
                    orderBy: { createdAt: "desc" },
                }),

                this.prisma.movie.findMany({
                    where: buildComingSoonWhere(now, locationFilter),
                    take: 12,
                    select: getMovieCardSelect(now, locationId, false),
                    orderBy: { createdAt: "desc" },
                }),
            ]);

            this.logger.log(
                `Feed montado: ${featured.length} destaques, ${nowShowing.length} em cartaz, ${presale.length} em pré-venda, ${comingSoon.length} em breve`,
            );

            return { featured, nowShowing, presale, comingSoon };
        } catch (error) {
            this.logger.error(
                "Falha ao montar o feed da home",
                error instanceof Error ? error.stack : error,
            );
            throw error;
        }
    }
}