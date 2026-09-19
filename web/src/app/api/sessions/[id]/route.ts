import { type NextRequest } from "next/server";
import { ok, err, handleError } from "@/lib/api/response";
import { prisma } from "@/lib/prisma";
import { TicketStatus } from "@/generated/prisma/client";

// ── GET /api/sessions/[id] ─────────────────────────────────────────────────────

/**
 * Detalhes completos de uma sessão + estado actual de cada assento.
 *
 * Lógica de estado dos assentos:
 *   - Sem SessionTicket → AVAILABLE
 *   - SessionTicket RESERVED com reservedUntil expirado → AVAILABLE
 *   - Caso contrário → status do SessionTicket (RESERVED | SOLD)
 */
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    const session = await prisma.sessionMovie.findUnique({
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
      return err("Sessão não encontrada", 404);
    }

    const now = new Date();

    // Index de tickets por seatId para lookup O(1)
    const ticketBySeatId = new Map(
      session.sessionTickets.map((t) => [t.seatId, t]),
    );

    const seats = session.room.seats.map((seat) => {
      const ticket = ticketBySeatId.get(seat.id);

      let status: TicketStatus = TicketStatus.AVAILABLE;
      if (ticket) {
        // TTL expirado → volta a AVAILABLE
        if (
          ticket.status === TicketStatus.RESERVED &&
          ticket.reservedUntil &&
          ticket.reservedUntil <= now
        ) {
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

    return ok({
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
    });
  } catch (error) {
    return handleError(error);
  }
}
