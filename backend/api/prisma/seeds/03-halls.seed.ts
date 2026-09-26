// ============================================================
// SEED 03 — HALLS (Salas)
// ============================================================
import { prisma } from "./_client";
import { SeedConfig } from "./_config";
import { Cinema, Format } from "../../src/generated/prisma/client";

const FORMAT_CYCLE: Format[] = [
  Format.TWOD,
  Format.THREED,
  Format.FOURD,
  Format.MAX,
];

export async function seedHalls(cinemas: Cinema[], config: SeedConfig) {
  const totalHalls = cinemas.length * config.hallsPerCinema;
  console.log(`   🎭 Criando ${totalHalls} sala(s)...`);

  const halls: Awaited<ReturnType<typeof prisma.hall.create>>[] = [];

  for (const cinema of cinemas) {
    for (let i = 0; i < config.hallsPerCinema; i++) {
      const number = i + 1;
      const format = FORMAT_CYCLE[i % FORMAT_CYCLE.length];
      const { rows, seatsPerRow } = config.seatsPerHall;
      const capacity = rows * seatsPerRow;

      const hall = await prisma.hall.create({
        data: {
          cinemaId: cinema.id,
          number,
          name: `Sala ${number}`,
          format,
          capacity,
          images: [
            `https://picsum.photos/seed/hall-${cinema.id}-${number}/800/600`,
          ],
          active: true,
        },
      });

      halls.push(hall);
    }
  }

  console.log(`   ✅ ${halls.length} sala(s) criada(s)`);
  return halls;
}
