import { Injectable, Logger, NotFoundException } from "@nestjs/common";
import { PrismaService } from "src/shared/prisma/prisma.service";
import { SessionSeatEventService } from "./session-seat-event.service";
import { TicketStatus } from "src/generated/prisma/client";

@Injectable()
export class ClientSessionService {
  private readonly logger = new Logger(ClientSessionService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly seatEventService: SessionSeatEventService,
  ) {}

  /**
   * Devolve os detalhes completos de uma sessão, incluindo o estado actual
   * de cada lugar da sala (AVAILABLE, RESERVED ou SOLD).
   *
   * Lógica de estado dos lugares:
   * - Se não existir SessionTicket para o lugar → AVAILABLE
   * - Se existir SessionTicket com status RESERVED mas reservedUntil já expirou → AVAILABLE
   * - Caso contrário → usa o status do SessionTicket (RESERVED | SOLD)
   */
  async getSessionById(id: string) {
    this.logger.log(`A buscar sessão ${id}`);

    const session = await this.prisma.sessionMovie.findUnique({
      where: { id },
      include: {
        movie: {
          select: {
            id: true,
            title: true,
            posterUrl: true,
            durationMin: true,
            ageRating: true,
          },
        },
        room: {
          include: {
            location: {
              select: { id: true, name: true, province: true, city: true },
            },
            seats: {
              orderBy: [{ row: "asc" }, { number: "asc" }],
            },
          },
        },
        sessionTickets: {
          select: {
            seatId: true,
            status: true,
            reservedUntil: true,
          },
        },
      },
    });

    if (!session) {
      this.logger.warn(`Sessão ${id} não encontrada`);
      throw new NotFoundException("Sessão não encontrada");
    }

    const now = new Date();

    // Indexar os tickets da sessão por seatId para O(1) lookup
    const ticketBySeatId = new Map(
      session.sessionTickets.map((t) => [t.seatId, t]),
    );

    const seats = session.room.seats.map((seat) => {
      const ticket = ticketBySeatId.get(seat.id);

      let status: TicketStatus = TicketStatus.AVAILABLE;
      if (ticket) {
        if (
          ticket.status === TicketStatus.RESERVED &&
          ticket.reservedUntil &&
          ticket.reservedUntil <= now
        ) {
          // TTL expirou — o assento voltou a estar disponível
          status = TicketStatus.AVAILABLE;
        } else {
          status = ticket.status;
        }
      }

      return {
        id: seat.id,
        row: seat.row,
        number: seat.number,
        type: seat.type,
        status,
      };
    });

    this.logger.log(`Sessão ${id}: ${seats.length} lugares carregados`);

    return {
      id: session.id,
      type: session.type,
      tier: session.tier,
      startTime: session.startTime,
      endTime: session.endTime,
      saleOpensAt: session.saleOpensAt,
      price: session.price,
      movie: session.movie,
      room: {
        id: session.room.id,
        name: session.room.name,
        capacity: session.room.capacity,
        format: session.room.format,
        location: session.room.location,
      },
      seats,
    };
  }
}
