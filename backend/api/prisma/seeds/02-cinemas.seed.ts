// ============================================================
// SEED 02 — CINEMAS
// ============================================================
import { prisma, faker } from "./_client";
import { SeedConfig } from "./_config";
import { slugify, toTimeField } from "./_helpers";
import { Location } from "../../src/generated/prisma/client";

const CINEMA_NAMES = [
  "Cinemax",
  "StarCinema",
  "CineArte",
  "MegaPlex",
  "CineClub",
  "CinePrime",
  "NovaCinema",
  "CineVip",
  "GrandPlex",
  "SunCinema",
];

export async function seedCinemas(locations: Location[], config: SeedConfig) {
  console.log(
    `   🏢 Criando ${locations.length * config.cinemasPerLocation} cinema(s)...`,
  );

  const cinemas: Awaited<ReturnType<typeof prisma.cinema.create>>[] = [];
  let nameIndex = 0;

  for (const location of locations) {
    for (let i = 0; i < config.cinemasPerLocation; i++) {
      const baseName = CINEMA_NAMES[nameIndex % CINEMA_NAMES.length];
      const cinemaName = `${baseName} ${location.name}`;
      const baseSlug = slugify(cinemaName);
      const slug = i === 0 ? baseSlug : `${baseSlug}-${i + 1}`;

      const cinema = await prisma.cinema.create({
        data: {
          locationId: location.id,
          name: cinemaName,
          slug,
          description: faker.lorem.paragraph(),
          address: `${faker.location.streetAddress()}, ${location.name}`,
          latitude:
            parseFloat(location.latitude.toString()) +
            faker.number.float({ min: -0.01, max: 0.01, fractionDigits: 6 }),
          longitude:
            parseFloat(location.longitude.toString()) +
            faker.number.float({ min: -0.01, max: 0.01, fractionDigits: 6 }),
          phone: `+244 ${faker.string.numeric(9)}`,
          email: `info@${slug.replace(/-/g, "")}.ao`,
          website: `https://www.${slug.replace(/-/g, "")}.ao`,
          images: [
            `https://picsum.photos/seed/${slug}-1/800/600`,
            `https://picsum.photos/seed/${slug}-2/800/600`,
          ],
          bannerUrl: `https://picsum.photos/seed/${slug}-banner/1280/400`,
          openTime: toTimeField(8, 0),
          closeTime: toTimeField(23, 0),
          active: true,
        },
      });

      cinemas.push(cinema);
      nameIndex++;
    }
  }

  console.log(`   ✅ ${cinemas.length} cinema(s) criado(s)`);
  return cinemas;
}
