// ============================================================
// SEED 07 — SESSIONS (Sessões de Cinema)
// ============================================================
import { prisma } from "./_client";
import { SeedConfig } from "./_config";
import {
  Exhibition,
  Hall,
  SessionType,
  SessionState,
  ExhibitionType,
  Format,
} from "../../src/generated/prisma/client";

const SESSION_HOURS = [10, 14, 17, 20];

const FORMAT_PRICE_MULTIPLIER: Record<Format, number> = {
  TWOD: 1.0,
  THREED: 1.3,
  FOURD: 1.5,
  MAX: 2.0,
};

export async function seedSessions(
  exhibitions: Exhibition[],
  halls: Hall[],
  config: SeedConfig,
) {
  const total = exhibitions.length * config.sessionsPerExhibition;
  console.log(`   🎟️  Criando ${total} sessão(ões)...`);

  // Mapa: hallId → Set de "YYYY-MM-DD-HH" para evitar conflitos no @@unique([hallId, startDateTime])
  const occupiedSlots = new Map<number, Set<string>>();
  for (const hall of halls) {
    occupiedSlots.set(hall.id, new Set());
  }

  let created = 0;
  let skipped = 0;

  for (const exhibition of exhibitions) {
    const movie = await prisma.movie.findUniqueOrThrow({
      where: { id: exhibition.movieId },
      select: { basePrice: true },
    });

    const sessionType: SessionType =
      exhibition.type === ExhibitionType.PRE_SALE
        ? SessionType.PRE_SALE
        : SessionType.NORMAL;

    const hours = SESSION_HOURS.slice(0, config.sessionsPerExhibition);

    for (const hour of hours) {
      // Tenta encontrar uma sala livre neste horário
      const shuffledHalls = [...halls].sort(() => Math.random() - 0.5);
      let assigned: Hall | null = null;
      let startDateTime: Date | null = null;

      for (const hall of shuffledHalls) {
        const dateStr = exhibition.startDate.toISOString().slice(0, 10);
        const slotKey = `${dateStr}-${hour}`;
        const slots = occupiedSlots.get(hall.id)!;

        if (!slots.has(slotKey)) {
          assigned = hall;
          startDateTime = new Date(exhibition.startDate);
          startDateTime.setHours(hour, 0, 0, 0);
          slots.add(slotKey);
          break;
        }
      }

      if (!assigned || !startDateTime) {
        skipped++;
        continue;
      }

      const multiplier = FORMAT_PRICE_MULTIPLIER[assigned.format];
      const price = parseFloat(movie.basePrice.toString()) * multiplier;

      await prisma.sessionMovie.create({
        data: {
          movieId: exhibition.movieId,
          hallId: assigned.id,
          exhibitionId: exhibition.id,
          startDateTime,
          price: parseFloat(price.toFixed(2)),
          sessionType,
          capacity: assigned.capacity,
          currentOccupancy: 0,
          state: SessionState.AVAILABLE,
          active: true,
        },
      });

      created++;
    }
  }

  if (skipped > 0) {
    console.log(
      `   ⚠️  ${skipped} sessão(ões) ignorada(s) por conflito de horário`,
    );
  }
  console.log(`   ✅ ${created} sessão(ões) criada(s)`);
}
