import {
    Injectable,
    Logger,
    NotFoundException,
    ConflictException,
} from "@nestjs/common";
import { PrismaService } from "src/shared/prisma/prisma.service";
import { MovieStatus, Prisma } from "src/generated/prisma/client";
import {
    CreateMovieDto,
    UpdateMovieDto,
    ListAdminMoviesDto,
} from "../dtos/movie-admin.dto";

@Injectable()
export class AdminMovieService {
    private readonly logger = new Logger(AdminMovieService.name);

    constructor(private readonly prisma: PrismaService) { }

    async createMovie(dto: CreateMovieDto) {
        this.logger.log(`A criar novo filme: "${dto.title}"`);

        const movie = await this.prisma.movie.create({
            data: {
                ...dto,
                releaseDate: new Date(dto.releaseDate),
                status: dto.status ?? MovieStatus.ACTIVE,
            },
        });

        this.logger.log(`Filme criado com sucesso — ID=${movie.id}`);
        return movie;
    }

    async getMovies(query: ListAdminMoviesDto) {
        const { search, status, page = 1, limit = 20 } = query;
        const skip = (page - 1) * limit;

        const where: Prisma.MovieWhereInput = {};

        if (search) {
            where.title = { contains: search, mode: "insensitive" };
        }

        if (status) {
            where.status = status;
        }

        const [items, total] = await Promise.all([
            this.prisma.movie.findMany({
                where,
                orderBy: { createdAt: "desc" },
                take: limit,
                skip,
                include: {
                    _count: {
                        select: { sessionMovies: true, presaleSubscriptions: true },
                    },
                },
            }),
            this.prisma.movie.count({ where }),
        ]);

        return {
            items,
            meta: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        };
    }

    async getMovieById(id: string) {
        const movie = await this.prisma.movie.findUnique({
            where: { id },
            include: {
                _count: {
                    select: { sessionMovies: true, presaleSubscriptions: true, reviews: true },
                },
            },
        });

        if (!movie) {
            this.logger.warn(`Filme ${id} não encontrado no painel de admin`);
            throw new NotFoundException("Filme não encontrado");
        }

        return movie;
    }

    async updateMovie(id: string, dto: UpdateMovieDto) {
        this.logger.log(`A atualizar filme ID=${id}`);

        await this.getMovieById(id); // Garante que o filme existe

        const data: Prisma.MovieUpdateInput = { ...dto };
        if (dto.releaseDate) {
            data.releaseDate = new Date(dto.releaseDate);
        }

        const updatedMovie = await this.prisma.movie.update({
            where: { id },
            data,
        });

        this.logger.log(`Filme ID=${id} atualizado com sucesso`);
        return updatedMovie;
    }

    /**
     * Apagar filme:
     * Por padrão, faz Soft Delete (marca status como ARCHIVED).
     * Se for passado `hardDelete=true`, elimina fisicamente da base de dados.
     */
    async deleteMovie(id: string, hardDelete = false) {
        this.logger.log(
            `A remover filme ID=${id} (Modo: ${hardDelete ? "HARD" : "SOFT/ARCHIVE"})`,
        );

        await this.getMovieById(id);

        if (hardDelete) {
            try {
                await this.prisma.movie.delete({ where: { id } });
                this.logger.log(`Filme ID=${id} removido permanentemente.`);
                return { message: "Filme eliminado permanentemente com sucesso" };
            } catch (error) {
                if (
                    error instanceof Prisma.PrismaClientKnownRequestError &&
                    error.code === "P2003"
                ) {
                    throw new ConflictException(
                        "Impossível eliminar o filme permanentemente pois já existem sessões ou registos associados. Utilize o arquivamento (soft delete).",
                    );
                }
                throw error;
            }
        }

        // Soft Delete — Muda status para ARCHIVED
        const archivedMovie = await this.prisma.movie.update({
            where: { id },
            data: { status: MovieStatus.ARCHIVED },
        });

        this.logger.log(`Filme ID=${id} marcado como ARCHIVED.`);
        return archivedMovie;
    }
}