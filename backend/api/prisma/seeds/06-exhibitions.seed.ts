import { prisma, faker } from "./_client";
import { SEED_CONFIG } from "./_config";
import { slugify, utcMidnight } from "./_helpers";
import { ExhibitionType, Prisma } from "../../src/generated/prisma/client";
import { SeededMovies } from "./05-movies.seed";

export async function seedExhibitions(movies: SeededMovies) {
  const data: Prisma.ExhibitionCreateManyInput[] = [];

  // Em cartaz → exibição regular ativa
  for (const movie of movies.nowShowing) {
    data.push({
      movieId: movie.id,
      type: ExhibitionType.REGULAR_SCREENING,
      name: `Exibição Regular — ${movie.title}`,
      slug: slugify(`regular-${movie.slug}`),
      description: faker.lorem.sentence(),
      startDate: movie.worldLaunchDate!,
      endDate: utcMidnight(30),
      active: true,
    });
  }

  // Pré-venda → já aberta, termina na estreia
  for (const movie of movies.presale) {
    data.push({
      movieId: movie.id,
      type: ExhibitionType.PRE_SALE,
      name: `Pré-Venda — ${movie.title}`,
      slug: slugify(`pre-sale-${movie.slug}`),
      description: faker.lorem.sentence(),
      startDate: utcMidnight(-SEED_CONFIG.presale.startedDaysAgo),
      endDate: movie.worldLaunchDate!,
      active: true,
    });
  }

  // Em breve → propositadamente sem exibições

  console.log(`   🎪 Criando ${data.length} exibição(ões)...`);
  const exhibitions = await prisma.exhibition.createManyAndReturn({ data });
  console.log(`   ✅ ${exhibitions.length} exibição(ões) criada(s)`);
  return exhibitions;
}
