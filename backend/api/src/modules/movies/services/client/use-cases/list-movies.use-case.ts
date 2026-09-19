import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from 'src/shared/prisma/prisma.service';
import { ListMoviesDto, MovieStatusFilter } from '../../../dtos/list-movies.dto';
import {
    buildComingSoonWhere,
    buildLocationFilter,
    buildNowShowingWhere,
    buildPresaleWhere,
    calculateMovieStatus,
} from '../movie-query.helpers';
import { MovieStatus, Prisma } from 'src/generated/prisma/client';

@Injectable()
export class ListMoviesUseCase {
    private readonly logger = new Logger(ListMoviesUseCase.name);

    constructor(private readonly prisma: PrismaService) { }

    async execute(params: ListMoviesDto) {
        const { locationId, status, cursor, search, limit = 20 } = params;
        this.logger.log(
            `Listando filmes — limit=${limit} cursor=${cursor ?? 'nenhum'} status=${status ?? 'todos'} locationId=${locationId ?? 'todos'} search=${search ?? 'nenhum'}`,
        );

        const now = new Date();
        const locationFilter = buildLocationFilter(locationId);

        // 1. Regra base administrativa: Apenas filmes não arquivados
        const conditions: Prisma.MovieWhereInput[] = [
            { status: { not: MovieStatus.ARCHIVED } },
        ];

        if (search) {
            conditions.push({ title: { contains: search, mode: 'insensitive' } });
        }

        // 2. Aplicação dos filtros dinâmicos de exibição
        if (status === MovieStatusFilter.NOW_SHOWING) {
            conditions.push(buildNowShowingWhere(now, locationFilter));
        } else if (status === MovieStatusFilter.PRESALE) {
            conditions.push(buildPresaleWhere(now, locationFilter));
        } else if (status === MovieStatusFilter.COMING_SOON) {
            conditions.push(buildComingSoonWhere(now, locationFilter));
        } else if (locationId) {
            conditions.push({ sessionMovies: { some: { room: { locationId } } } });
        }

        const where: Prisma.MovieWhereInput = { AND: conditions };

        // 3. Consulta à base de dados
        const items = await this.prisma.movie.findMany({
            where,
            include: {
                sessionMovies: {
                    where: {
                        startTime: { gte: now },
                        ...locationFilter,
                    },
                    select: {
                        startTime: true,
                        saleOpensAt: true,
                    },
                },
            },
            orderBy: { createdAt: 'desc' },
            take: limit + 1,
            ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
        });

        // 4. Gestão da paginação
        let nextCursor: string | undefined = undefined;
        if (items.length > limit) {
            const nextItem = items.pop();
            nextCursor = nextItem?.id;
        }

        // 5. Mapeamento dos itens anexando o status calculado dinamicamente
        const formattedItems = items.map((movie) => {
            const { sessionMovies, ...movieData } = movie;

            const displayStatus = calculateMovieStatus(
                movie.releaseDate,
                sessionMovies,
                now,
            );

            return {
                ...movieData,
                displayStatus,
            };
        });

        this.logger.log(`Listagem devolveu ${formattedItems.length} filmes`);

        return {
            items: formattedItems,
            nextCursor,
        };
    }
}