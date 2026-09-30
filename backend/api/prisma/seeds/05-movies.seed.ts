import * as path from "path";
import * as fs from "fs";
import { prisma, faker } from "./_client";
import { SEED_CONFIG } from "./_config";
import { slugify, mapAgeRating, utcMidnight } from "./_helpers";
import { Movie } from "../../src/generated/prisma/client";

interface RawMovie {
  title: string;
  originalTitle: string;
  synopsis: string;
  genres: string[];
  director: string;
  cast: string[];
  posterUrl: string;
  bannerUrl: string;
  trailerUrl: string;
  durationMin: number;
  ageRating: string;
  isReleased: boolean;
  isPresale: boolean;
}

type Scenario = "NOW_SHOWING" | "PRESALE" | "COMING_SOON";

export interface SeededMovies {
  all: Movie[];
  nowShowing: Movie[];
  presale: Movie[];
  comingSoon: Movie[];
}

function getScenario(index: number, total: number): Scenario {
  const { nowShowing, presale } = SEED_CONFIG.scenarioSplit;
  const nowShowingCount = Math.max(1, Math.round(total * nowShowing));
  const presaleCount = Math.max(1, Math.round(total * presale));

  if (index < nowShowingCount) return "NOW_SHOWING";
  if (index < nowShowingCount + presaleCount) return "PRESALE";
  return "COMING_SOON";
}

function launchDateFor(scenario: Scenario): Date {
  const { nowShowing, presale, comingSoon } = SEED_CONFIG;
  switch (scenario) {
    case "NOW_SHOWING":
      return utcMidnight(-faker.number.int(nowShowing.releasedDaysAgo));
    case "PRESALE":
      return utcMidnight(faker.number.int(presale.launchInDays));
    case "COMING_SOON":
      return utcMidnight(faker.number.int(comingSoon.launchInDays));
  }
}

export async function seedMovies(): Promise<SeededMovies> {
  const jsonPath = path.resolve(__dirname, "../../real-movies.json");
  const rawData: RawMovie[] = JSON.parse(fs.readFileSync(jsonPath, "utf-8"));

  console.log(
    `   🎬 Criando ${rawData.length} filme(s) do real-movies.json...`,
  );

  const result: SeededMovies = {
    all: [],
    nowShowing: [],
    presale: [],
    comingSoon: [],
  };
  const bucket: Record<Scenario, Movie[]> = {
    NOW_SHOWING: result.nowShowing,
    PRESALE: result.presale,
    COMING_SOON: result.comingSoon,
  };

  for (const [index, raw] of rawData.entries()) {
    const scenario = getScenario(index, rawData.length);

    const movie = await prisma.movie.create({
      data: {
        title: raw.title,
        slug: slugify(raw.title),
        synopsis: raw.synopsis,
        durationMinutes: raw.durationMin,
        genres: raw.genres,
        ageRating: mapAgeRating(raw.ageRating),
        director: raw.director ?? null,
        cast: raw.cast ?? [],
        worldLaunchDate: launchDateFor(scenario),
        basePrice: faker.number.float({
          min: 1500,
          max: 3000,
          fractionDigits: 2,
        }),
        posterUrl: raw.posterUrl ?? null,
        backdropUrl: raw.bannerUrl ?? null,
        trailerUrl: raw.trailerUrl ?? null,
        active: true,
      },
    });

    result.all.push(movie);
    bucket[scenario].push(movie);
  }

  console.log(
    `   ✅ ${result.all.length} filme(s): ${result.nowShowing.length} em cartaz, ${result.presale.length} pré-venda, ${result.comingSoon.length} em breve`,
  );

  for (const [name, list] of Object.entries(bucket)) {
    if (list.length === 0)
      console.warn(`   ⚠️  Nenhum filme no cenário ${name}!`);
  }

  return result;
}
