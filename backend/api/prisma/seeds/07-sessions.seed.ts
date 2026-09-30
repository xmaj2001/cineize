import { prisma, faker } from "./_client";
import { SEED_CONFIG } from "./_config";
import { addDays, atLuandaHour, utcMidnight } from "./_helpers";
import {
  Exhibition,
  ExhibitionType,
  Format,
  Hall,
  Movie,
  Prisma,
  SessionState,
  SessionType,
} from "../../src/generated/prisma/client";

const FORMAT_PRICE_MULTIPLIER: Record<Format, number> = {
  TWOD: 1.0,
  THREED: 1.3,
  FOURD: 1.5,
  MAX: 2.0,
};

/** Dias em que a exibição tem sessões */
function sessionDaysFor(exhibition: Exhibition): Date[] {
  if (exhibition.type === ExhibitionType.PRE_SALE) {
    // sessões a partir do dia da estreia (endDate)
    return Array.from({ length: SEED_CONFIG.presale.sessionDays }, (_, i) =>
      addDays(exhibition.endDate!, i),
    );
  }
  // próximos N dias, a começar hoje
  return Array.from({ length: SEED_CONFIG.nowShowing.daysAhead }, (_, i) =>
    utcMidnight(i),
  );
}

/** Procura uma sala livre nesse horário (respeita @@unique([hallId, startDateTime])) */
function pickFreeHall(
  halls: Hall[],
  startDateTime: Date,
  occupied: Set<string>,
): Hall | null {
  for (const hall of faker.helpers.shuffle(halls)) {
    const key = `${hall.id}|${startDateTime.toISOString()}`;
    if (!occupied.has(key)) {
      occupied.add(key);
      return hall;
    }
  }
  return null;
}

export async function seedSessions(
  exhibitions: Exhibition[],
  halls: Hall[],
  movies: Movie[],
) {
  const basePrice = new Map(movies.map((m) => [m.id, Number(m.basePrice)]));
  const occupied = new Set<string>();
  const rows: Prisma.SessionMovieCreateManyInput[] = [];
  let skipped = 0;

  for (const exhibition of exhibitions) {
    const isPresale = exhibition.type === ExhibitionType.PRE_SALE;
    const perDay = isPresale
      ? SEED_CONFIG.presale.sessionsPerDay
      : SEED_CONFIG.nowShowing.sessionsPerDay;
    const hours = SEED_CONFIG.sessionHours.slice(0, perDay);

    for (const day of sessionDaysFor(exhibition)) {
      for (const hour of hours) {
        const startDateTime = atLuandaHour(day, hour);
        const hall = pickFreeHall(halls, startDateTime, occupied);

        if (!hall) {
          skipped++;
          continue;
        }

        const price =
          basePrice.get(exhibition.movieId)! *
          FORMAT_PRICE_MULTIPLIER[hall.format];

        rows.push({
          movieId: exhibition.movieId,
          hallId: hall.id,
          exhibitionId: exhibition.id,
          startDateTime,
          price: Number(price.toFixed(2)),
          sessionType: isPresale ? SessionType.PRE_SALE : SessionType.NORMAL,
          capacity: hall.capacity,
          currentOccupancy: 0,
          state: SessionState.AVAILABLE,
          active: true,
        });
      }
    }
  }

  console.log(`   🎟️  Criando ${rows.length} sessão(ões)...`);
  await prisma.sessionMovie.createMany({ data: rows });

  if (skipped > 0) {
    console.log(
      `   ⚠️  ${skipped} sessão(ões) ignorada(s) por falta de sala livre`,
    );
  }
  console.log(`   ✅ ${rows.length} sessão(ões) criada(s)`);
  return rows.length;
}
