import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/shared/prisma/prisma.service';
import { MovieStatus } from 'src/generated/prisma/client';

@Injectable()
export class GetMovieByIdUseCase {
    private readonly logger = new Logger(GetMovieByIdUseCase.name);

    constructor(private readonly prisma: PrismaService) { }

    async execute(movieId: string, locationId?: string) {
        this.logger.log(
            `A buscar detalhes do filme ${movieId}${locationId ? ` (locationId=${locationId})` : ''}`,
        );

        const now = new Date();

        // 1. Procurar apenas os dados base do filme para validar existência e data de estreia
        const movieBase = await this.prisma.movie.findFirst({
            where: {
                id: movieId,
                status: { not: MovieStatus.ARCHIVED },
            },
            select: {
                id: true,
                releaseDate: true,
            },
        });

        if (!movieBase) {
            this.logger.warn(`Filme ${movieId} não encontrado ou está arquivado`);
            throw new NotFoundException('Filme não encontrado');
        }

        const isFutureRelease = movieBase.releaseDate > now;

        // 2. Se a estreia for no futuro, verifica APENAS se existe alguma sessão com venda aberta
        let isPresaleActive = false;
        if (isFutureRelease) {
            const activePresaleSession = await this.prisma.sessionMovie.findFirst({
                where: {
                    movieId,
                    saleOpensAt: { lte: now },
                    startTime: { gt: now },
                    ...(locationId && { room: { locationId } }),
                },
                select: { id: true }, // Select mínimo de 1 coluna para ser super rápido
            });

            isPresaleActive = !!activePresaleSession;
        }

        // 3. Determinar o estado sem carregar dados pesados
        const isComingSoon = isFutureRelease && !isPresaleActive;
        const displayStatus = isComingSoon
            ? 'COMING_SOON'
            : isFutureRelease
                ? 'PRESALE'
                : 'NOW_SHOWING';

        // 4. Se for EM BREVE, nem fazemos JOIN de sessões! Trazemos apenas o filme com array vazio.
        const sessionMoviesInclude = isComingSoon
            ? false
            : {
                where: {
                    startTime: { gte: now },
                    ...(locationId && { room: { locationId } }),
                },
                include: {
                    room: {
                        select: {
                            id: true,
                            name: true,
                            format: true,
                            location: {
                                select: {
                                    id: true,
                                    name: true,
                                    province: true,
                                    city: true,
                                    latitude: true,
                                    longitude: true,
                                },
                            },
                        },
                    },
                },
                orderBy: { startTime: 'asc' as const },
            };

        const movie = await this.prisma.movie.findUnique({
            where: { id: movieId },
            include: {
                sessionMovies: sessionMoviesInclude,
            },
        });

        return {
            ...movie,
            sessionMovies: movie?.sessionMovies ?? [],
            displayStatus,
        };
    }
}