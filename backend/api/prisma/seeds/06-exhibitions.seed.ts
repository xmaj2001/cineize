// ============================================================
// SEED 06 — EXHIBITIONS (Exibições)
// ============================================================
import { prisma, faker } from "./_client";
import { SeedConfig } from "./_config";
import { slugify, addDays } from "./_helpers";
import { Movie, ExhibitionType } from "../../src/generated/prisma/client";

const EXHIBITION_TYPES: ExhibitionType[] = [
  ExhibitionType.REGULAR_SCREENING,
  ExhibitionType.PRE_SALE,
  ExhibitionType.SPECIAL,
  ExhibitionType.RERUN,
];

const EXHIBITION_TYPE_LABELS: Record<ExhibitionType, string> = {
  REGULAR_SCREENING: "Exibição Regular",
  PRE_SALE: "Pré-Venda",
  SPECIAL: "Sessão Especial",
  RERUN: "Reprise",
  IMAX_EXCLUSIVE: "Exclusivo IMAX",
  LIVE_EVENT: "Evento ao Vivo",
};

export async function seedExhibitions(movies: Movie[], config: SeedConfig) {
  const total = movies.length * config.exhibitionsPerMovie;
  console.log(`   🎪 Criando ${total} exibição(ões)...`);

  const exhibitions: Awaited<ReturnType<typeof prisma.exhibition.create>>[] =
    [];

  for (const movie of movies) {
    for (let i = 0; i < config.exhibitionsPerMovie; i++) {
      const type = EXHIBITION_TYPES[i % EXHIBITION_TYPES.length];
      const label = EXHIBITION_TYPE_LABELS[type];

      const startDate = addDays(new Date(), i * 15);
      startDate.setHours(0, 0, 0, 0);

      const endDate = addDays(startDate, 30);

      const name = `${label} — ${movie.title}`;
      const slug = slugify(`${type}-${movie.slug}-${i + 1}`);
      const description = faker.lorem.sentence();

      const exhibition = await prisma.exhibition.create({
        data: {
          movieId: movie.id,
          type,
          name,
          slug,
          description,
          startDate,
          endDate,
          active: true,
        },
      });

      exhibitions.push(exhibition);
    }
  }

  console.log(`   ✅ ${exhibitions.length} exibição(ões) criada(s)`);
  return exhibitions;
}
