// ============================================================
// SEED 04 — SEATS (Lugares)
// ============================================================
import { prisma } from "./_client";
import { SeedConfig } from "./_config";
import { Hall, SeatType } from "../../src/generated/prisma/client";

export async function seedSeats(halls: Hall[], config: SeedConfig) {
  const { rows, seatsPerRow, vipRows, accessibilityCount } =
    config.seatsPerHall;
  const rowLetters = Array.from({ length: rows }, (_, i) =>
    String.fromCharCode(65 + i),
  ); // A, B, C, ...
  const lastRow = rowLetters[rowLetters.length - 1];

  const totalSeats = halls.length * rows * seatsPerRow;
  console.log(`   💺 Criando ${totalSeats} lugar(es)...`);

  for (const hall of halls) {
    const seatsData: {
      hallId: number;
      row: string;
      number: number;
      seatType: SeatType;
      active: boolean;
    }[] = [];

    for (const row of rowLetters) {
      for (let seatNum = 1; seatNum <= seatsPerRow; seatNum++) {
        let seatType: SeatType = SeatType.NORMAL;

        if (vipRows.includes(row)) {
          seatType = SeatType.VIP;
        } else if (
          row === lastRow &&
          seatNum > seatsPerRow - accessibilityCount
        ) {
          seatType = SeatType.ACCESSIBILITY;
        }

        seatsData.push({
          hallId: hall.id,
          row,
          number: seatNum,
          seatType,
          active: true,
        });
      }
    }

    await prisma.seat.createMany({ data: seatsData });
  }

  console.log(`   ✅ ${totalSeats} lugar(es) criado(s)`);
}
