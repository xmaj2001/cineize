import { prisma, faker } from "./_client";
import { SEED_CONFIG } from "./_config";
import { addDays } from "./_helpers";
import { Cinema, Movie, Prisma } from "../../src/generated/prisma/client";
import { SeededMovies } from "./05-movies.seed";

const HEADLINES = {
  nowShowing: "Em cartaz agora",
  presale: "Pré-venda aberta",
  comingSoon: "Brevemente nos cinemas",
} as const;

export async function seedFeatured(movies: SeededMovies, cinemas: Cinema[]) {
  const now = new Date();
  const data: Prisma.FeaturedMovieCreateManyInput[] = [];

  const build = (
    movie: Movie,
    headline: string,
    extra: Partial<Prisma.FeaturedMovieCreateManyInput> = {},
  ): Prisma.FeaturedMovieCreateManyInput => ({
    movieId: movie.id,
    headline,
    bannerUrl: movie.backdropUrl,
    startsAt: addDays(now, -1),
    endsAt: addDays(now, 30),
    active: true,
    ...extra,
  });

  // ── Destaques globais (cinemaId = null) ────────────────────
  const globalPicks: { movie: Movie; headline: string }[] = [
    ...movies.nowShowing
      .slice(0, SEED_CONFIG.featured.globalNowShowing)
      .map((movie) => ({ movie, headline: HEADLINES.nowShowing })),
    ...movies.presale
      .slice(0, 1)
      .map((movie) => ({ movie, headline: HEADLINES.presale })),
    ...movies.comingSoon
      .slice(0, 1)
      .map((movie) => ({ movie, headline: HEADLINES.comingSoon })),
  ];

  globalPicks.forEach(({ movie, headline }, i) => {
    data.push(build(movie, headline, { priority: globalPicks.length - i }));
  });

  // ── Destaques por cinema ───────────────────────────────────
  const pool = movies.nowShowing;
  const perCinema = Math.min(SEED_CONFIG.featured.perCinema, pool.length);

  for (const cinema of cinemas) {
    faker.helpers.arrayElements(pool, perCinema).forEach((movie, i) => {
      data.push(
        build(movie, HEADLINES.nowShowing, {
          cinemaId: cinema.id,
          priority: perCinema - i,
        }),
      );
    });
  }

  // ── Casos de teste: NÃO devem aparecer no carrossel ────────
  const [expiredMovie, inactiveMovie] = movies.nowShowing.slice(-2);
  if (expiredMovie) {
    data.push(
      build(expiredMovie, "Destaque expirado", {
        startsAt: addDays(now, -30),
        endsAt: addDays(now, -1),
        priority: 99,
      }),
    );
  }
  if (inactiveMovie) {
    data.push(
      build(inactiveMovie, "Destaque desativado", {
        active: false,
        priority: 99,
      }),
    );
  }

  await prisma.featuredMovie.createMany({ data });
  console.log(`   ✅ ${data.length} destaque(s) criado(s)`);
  return data.length;
}
