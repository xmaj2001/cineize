import {
    BadRequestException,
    ConflictException,
    Injectable,
    Logger,
    NotFoundException,
} from "@nestjs/common";
import { PrismaService } from "src/shared/prisma/prisma.service";
import { TicketStatus } from "src/generated/prisma/client";
import {
    CreateSessionDto,
    ListAdminSessionsDto,
    UpdateSessionDto,
} from "../../dtos/admin-session.dtos";
import { MoviePresaleOpenedEvent } from "../../events/MoviePresaleOpenedEvent";
import { EventEmitter2 } from "@nestjs/event-emitter";

const CLEANING_BUFFER_MINUTES = 15;

@Injectable()
export class AdminSessionService {
    private readonly logger = new Logger(AdminSessionService.name);

    constructor(
        private readonly prisma: PrismaService,
        private readonly eventEmitter: EventEmitter2,
    ) { }

    async create(dto: CreateSessionDto) {
        this.logger.log(`A criar sessão para o filme ${dto.movieId} na sala ${dto.roomId}`);

        const movie = await this.prisma.movie.findUnique({
            where: { id: dto.movieId },
            select: { id: true, durationMin: true, title: true },
        });
        if (!movie) throw new NotFoundException("Filme não encontrado");

        const room = await this.prisma.room.findUnique({
            where: { id: dto.roomId },
            select: { id: true },
        });
        if (!room) throw new NotFoundException("Sala não encontrada");

        const start = new Date(dto.startTime);
        const saleOpen = new Date(dto.saleOpensAt);
        const now = new Date();

        if (start <= now) {
            throw new BadRequestException("A data de início da sessão deve ser no futuro");
        }

        if (saleOpen > start) {
            throw new BadRequestException("A data de abertura das vendas não pode ser posterior ao início da sessão");
        }

        const totalDurationMs = (movie.durationMin + CLEANING_BUFFER_MINUTES) * 60 * 1000;
        const end = new Date(start.getTime() + totalDurationMs);

        await this.validateRoomAvailability(dto.roomId, start, end);

        const session = await this.prisma.sessionMovie.create({
            data: {
                movieId: dto.movieId,
                roomId: dto.roomId,
                type: dto.type,
                tier: dto.tier,
                startTime: start,
                endTime: end,
                saleOpensAt: saleOpen,
                price: dto.price,
            },
        });

        // ═════════════════════════════════════════════════════════════════
        // VERIFICAÇÃO DE PRÉ-VENDA E DISPARO DO EVENTO
        // ═════════════════════════════════════════════════════════════════
        if (saleOpen > now) {
            // Checa se já existe qualquer outra sessão do mesmo filme com pré-venda ativa
            const existingPresaleSession = await this.prisma.sessionMovie.findFirst({
                where: {
                    movieId: dto.movieId,
                    saleOpensAt: { gt: now },
                    id: { not: session.id },
                },
                select: { id: true },
            });

            // Se for a PRIMEIRA sessão com abertura no futuro, dispara o evento
            if (!existingPresaleSession) {
                this.logger.log(
                    `Primeira sessão de pré-venda detetada para o filme "${movie.title}". Disparando evento...`
                );

                this.eventEmitter.emit(
                    "movie.presale.opened",
                    new MoviePresaleOpenedEvent(dto.movieId, session.id, saleOpen),
                );
            }
        }

        this.logger.log(`Sessão ${session.id} criada com sucesso`);
        return session;
    }

    async findAll(query: ListAdminSessionsDto) {
        const { locationId, roomId, movieId, date, page = 1, limit = 20 } = query;
        const skip = (page - 1) * limit;

        const where: any = {};

        if (roomId) where.roomId = roomId;
        if (movieId) where.movieId = movieId;
        if (locationId) where.room = { locationId };

        if (date) {
            const dayStart = new Date(date);
            dayStart.setHours(0, 0, 0, 0);

            const dayEnd = new Date(date);
            dayEnd.setHours(23, 59, 59, 999);

            where.startTime = { gte: dayStart, lte: dayEnd };
        }

        const [total, items] = await Promise.all([
            this.prisma.sessionMovie.count({ where }),
            this.prisma.sessionMovie.findMany({
                where,
                include: {
                    movie: { select: { id: true, title: true, posterUrl: true } },
                    room: {
                        select: {
                            id: true,
                            name: true,
                            capacity: true,
                            location: { select: { id: true, name: true } },
                        },
                    },
                    _count: {
                        select: { sessionTickets: true },
                    },
                },
                orderBy: { startTime: "asc" },
                skip,
                take: limit,
            }),
        ]);

        return {
            items: items.map((item) => ({
                ...item,
                ticketsReservedOrSold: item._count.sessionTickets,
            })),
            meta: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        };
    }

    async findOne(id: string) {
        const session = await this.prisma.sessionMovie.findUnique({
            where: { id },
            include: {
                movie: {
                    select: {
                        id: true,
                        title: true,
                        posterUrl: true,
                        durationMin: true,
                    },
                },
                room: {
                    include: {
                        location: { select: { name: true } },
                        seats: { orderBy: [{ row: "asc" }, { number: "asc" }] },
                    },
                },
                sessionTickets: {
                    include: {
                        ticket: {
                            select: {
                                orderId: true,
                                order: { select: { userId: true } },
                            },
                        },
                    },
                },
            },
        });

        if (!session) throw new NotFoundException("Sessão não encontrada");

        const now = new Date();
        const ticketMap = new Map(session.sessionTickets.map((t) => [t.seatId, t]));

        let ticketsSold = 0;
        let ticketsReserved = 0;

        const seats = session.room.seats.map((seat) => {
            const ticket = ticketMap.get(seat.id);
            let status: TicketStatus = TicketStatus.AVAILABLE;

            if (ticket) {
                if (
                    ticket.status === TicketStatus.RESERVED &&
                    ticket.reservedUntil &&
                    ticket.reservedUntil <= now
                ) {
                    status = TicketStatus.AVAILABLE;
                } else {
                    status = ticket.status;
                    if (status === TicketStatus.SOLD) ticketsSold++;
                    if (status === TicketStatus.RESERVED) ticketsReserved++;
                }
            }

            return {
                id: seat.id,
                row: seat.row,
                number: seat.number,
                type: seat.type,
                status,
                orderId: ticket?.ticket?.orderId,
                userId: ticket?.ticket?.order?.userId,
                reservedUntil: ticket?.reservedUntil,
            };
        });

        const totalCapacity = session.room.capacity;
        const ticketsAvailable = totalCapacity - (ticketsSold + ticketsReserved);
        const totalRevenue = ticketsSold * session.price;
        const occupancyRate = totalCapacity > 0 ? Number(((ticketsSold / totalCapacity) * 100).toFixed(2)) : 0;

        return {
            id: session.id,
            type: session.type,
            tier: session.tier,
            startTime: session.startTime,
            endTime: session.endTime,
            saleOpensAt: session.saleOpensAt,
            price: session.price,
            occupancyRate,
            totalRevenue,
            ticketsSold,
            ticketsReserved,
            ticketsAvailable,
            movie: session.movie,
            room: {
                id: session.room.id,
                name: session.room.name,
                capacity: session.room.capacity,
                format: session.room.format,
                locationName: session.room.location.name,
            },
            seats,
        };
    }

    async update(id: string, dto: UpdateSessionDto) {
        const session = await this.prisma.sessionMovie.findUnique({
            where: { id },
            include: { movie: true },
        });
        if (!session) throw new NotFoundException("Sessão não encontrada");

        const start = dto.startTime ? new Date(dto.startTime) : session.startTime;
        const roomId = dto.roomId ?? session.roomId;

        let end = session.endTime;
        if (dto.startTime || dto.movieId) {
            const durationMin = dto.movieId
                ? (await this.prisma.movie.findUnique({ where: { id: dto.movieId } }))?.durationMin ?? session.movie.durationMin
                : session.movie.durationMin;

            end = new Date(start.getTime() + (durationMin + CLEANING_BUFFER_MINUTES) * 60 * 1000);
        }

        if (dto.startTime || dto.roomId) {
            await this.validateRoomAvailability(roomId, start, end, id);
        }

        return this.prisma.sessionMovie.update({
            where: { id },
            data: {
                ...(dto.movieId && { movieId: dto.movieId }),
                ...(dto.roomId && { roomId: dto.roomId }),
                ...(dto.type && { type: dto.type }),
                ...(dto.tier && { tier: dto.tier }),
                ...(dto.price && { price: dto.price }),
                ...(dto.saleOpensAt && { saleOpensAt: new Date(dto.saleOpensAt) }),
                startTime: start,
                endTime: end,
            },
        });
    }

    async remove(id: string) {
        const session = await this.prisma.sessionMovie.findUnique({
            where: { id },
            include: {
                _count: {
                    select: { sessionTickets: true },
                },
            },
        });

        if (!session) throw new NotFoundException("Sessão não encontrada");

        if (session._count.sessionTickets > 0) {
            throw new BadRequestException(
                "Impossível eliminar a sessão: já existem bilhetes reservados ou vendidos para a mesma",
            );
        }

        await this.prisma.sessionMovie.delete({ where: { id } });
        return { message: "Sessão eliminada com sucesso" };
    }

    async Salas() {
        const salas = await this.prisma.room.findMany({
            select: {
                id: true,
                name: true,
                capacity: true,
                locationId: true,
            },
        });
        return salas;
    }

    private async validateRoomAvailability(
        roomId: string,
        start: Date,
        end: Date,
        excludeSessionId?: string,
    ) {
        const overlapping = await this.prisma.sessionMovie.findFirst({
            where: {
                roomId,
                ...(excludeSessionId && { id: { not: excludeSessionId } }),
                OR: [
                    { startTime: { lte: start }, endTime: { gt: start } },
                    { startTime: { lt: end }, endTime: { gte: end } },
                    { startTime: { gte: start }, endTime: { lte: end } },
                ],
            },
            select: { id: true, startTime: true, endTime: true },
        });

        if (overlapping) {
            throw new ConflictException(
                `A sala já está ocupada no horário selecionado por outra sessão (${overlapping.startTime.toISOString()} - ${overlapping.endTime.toISOString()})`,
            );
        }
    }
}