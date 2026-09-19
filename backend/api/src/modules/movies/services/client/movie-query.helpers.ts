import { MovieStatus, Prisma } from "src/generated/prisma/client";

export type LocationFilter = { room: { locationId: string } } | Record<string, never>;

export const buildLocationFilter = (locationId?: string): LocationFilter =>
    locationId ? { room: { locationId } } : {};

export const getMovieCardSelect = (
    now: Date,
    locationId?: string,
    includeSessions = true,
): Prisma.MovieSelect => ({
    id: true,
    title: true,
    posterUrl: true,
    bannerUrl: true,
    durationMin: true,
    ageRating: true,
    genres: true,
    status: true,
    language: true,
    subtitleLanguage: true,
    synopsis: true,
    ...(includeSessions && {
        sessionMovies: {
            where: {
                startTime: { gte: now },
                ...(locationId && { room: { locationId } }),
            },
            select: {
                id: true,
                type: true,
                startTime: true,
                room: {
                    select: {
                        id: true,
                        format: true,
                        locationId: true,
                    },
                },
            },
            orderBy: { startTime: "asc" },
        },
    }),
});


export type CalculatedMovieStatus = 'NOW_SHOWING' | 'PRESALE' | 'COMING_SOON';

/**
 * Calculador puro de estado para a resposta do DTO
 */
export const calculateMovieStatus = (
    releaseDate: Date,
    sessions: { startTime: Date; saleOpensAt: Date }[],
    now: Date = new Date(),
): CalculatedMovieStatus => {
    const isReleased = releaseDate <= now;

    // 1. Em Cartaz: Já estreou e tem sessões futuras
    const hasFutureSessions = sessions.some((s) => s.startTime >= now);
    if (isReleased && hasFutureSessions) {
        return 'NOW_SHOWING';
    }

    // 2. Pré-Venda: Ainda não estreou, mas tem sessões com vendas abertas
    const hasPresaleSessions = sessions.some(
        (s) => s.saleOpensAt <= now && s.startTime > now,
    );
    if (!isReleased && hasPresaleSessions) {
        return 'PRESALE';
    }

    // 3. Em Breve: Caso padrão se a estreia é no futuro
    return 'COMING_SOON';
};

/**
 * Filtro Prisma: EM BREVE
 * Estreia no futuro AND Nenhuma sessão com venda já aberta
 */
export const buildComingSoonWhere = (
    now: Date,
    locationFilter: LocationFilter,
): Prisma.MovieWhereInput => ({
    // 1. Seleciona filmes cuja data de estreia (releaseDate) é estritamente Maior (gt) que a hora atual (now) — ou seja, ainda não estreou.
    releaseDate: { gt: now },

    // 2. Aplica uma negação: O filme NÃO PODE ter nenhuma sessão que atenda às condições abaixo.
    NOT: {
        // 3. Verifica se existe alguma (some) sessão associada ao filme.
        sessionMovies: {
            some: {
                // 4. Filtra a sessão cuja data de abertura de vendas (saleOpensAt) é Menor ou Igual (lte) à hora atual (venda já abriu).
                saleOpensAt: { lte: now },

                // 5. Espalha o filtro de localização (filtra pela sala/cinema se um local foi fornecido).
                ...locationFilter,
            },
        },
    },
});

/**
 * Filtro Prisma: PRÉ-VENDA
 * Estreia no futuro AND Pelo menos uma sessão com venda aberta no futuro
 */
export const buildPresaleWhere = (
    now: Date,
    locationFilter: LocationFilter,
): Prisma.MovieWhereInput => ({
    // 1. Seleciona filmes cuja data de estreia (releaseDate) é estritamente Maior (gt) que a hora atual (ainda não estreou oficialmente).
    releaseDate: { gt: now },

    // 2. Exige que o filme TENHA pelo menos uma (some) sessão cadastrada que cumpra os critérios abaixo.
    sessionMovies: {
        some: {
            // 3. Filtra a sessão cuja venda já foi liberada (saleOpensAt é Menor ou Igual à hora atual).
            saleOpensAt: { lte: now },

            // 4. Garante que o horário do filme (startTime) é no futuro (estritamente Maior que a hora atual).
            startTime: { gt: now },

            // 5. Espalha o filtro de localização (filtra a sala/cinema se especificado).
            ...locationFilter,
        },
    },
});

/**
 * Filtro Prisma: EM CARTAZ
 * Estreia no passado ou hoje AND Pelo menos uma sessão futura
 */
export const buildNowShowingWhere = (
    now: Date,
    locationFilter: LocationFilter,
): Prisma.MovieWhereInput => ({
    // 1. Seleciona filmes cuja data de estreia (releaseDate) é Menor ou Igual (lte) à hora atual (já estreou ou estreia hoje).
    releaseDate: { lte: now },

    // 2. Exige que o filme TENHA pelo menos uma (some) sessão ativa para exibição.
    sessionMovies: {
        some: {
            // 3. Filtra a sessão cujo horário de início (startTime) seja no futuro ou exatamente agora (Maior ou Igual a now).
            startTime: { gte: now },

            // 4. Espalha o filtro de localização (filtra a sala/cinema se especificado).
            ...locationFilter,
        },
    },
});