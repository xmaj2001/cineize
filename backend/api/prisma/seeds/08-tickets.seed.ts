// ============================================================
// SEED 08 — TICKETS (amostras de lugares ocupados)
// ============================================================
import { PaymentMethod, TicketState } from "../../src/generated/prisma/client";
import { prisma } from "./_client";

export async function seedTickets() {
  const sessions = await prisma.sessionMovie.findMany({
    select: {
      id: true,
      price: true,
      hall: {
        select: {
          seats: {
            where: { active: true },
            orderBy: [{ row: "asc" }, { number: "asc" }],
            select: { id: true },
          },
        },
      },
    },
    orderBy: { id: "asc" },
  });

  let created = 0;
  for (const session of sessions) {
    const seats = session.hall.seats;
    if (seats.length === 0) continue;

    // Semear cerca de 8% de ocupação (no mínimo 1 assento) de forma estável.
    const occupiedCount = Math.max(1, Math.floor(seats.length * 0.08));
    const selectedSeats = Array.from({ length: occupiedCount }, (_, index) =>
      seats[(session.id * 7 + index * 11) % seats.length],
    );

    await prisma.ticket.createMany({
      data: selectedSeats.map((seat, index) => ({
        sessionId: session.id,
        seatId: seat.id,
        pricePaid: session.price,
        state: index % 3 === 0 ? TicketState.RESERVED : TicketState.CONFIRMED,
        qrCode: `CINEIZE-SEED-QR-${session.id}-${seat.id}`,
        barcode: `CINEIZE-SEED-BAR-${session.id}-${seat.id}`,
        controlNumber: `CINEIZE-SEED-${session.id}-${seat.id}`,
        paymentMethod: PaymentMethod.CARD,
      })),
    });

    await prisma.sessionMovie.update({
      where: { id: session.id },
      data: { currentOccupancy: occupiedCount },
    });
    created += selectedSeats.length;
  }

  console.log(`   ✅ ${created} ticket(s) de demonstração criado(s)`);
}
