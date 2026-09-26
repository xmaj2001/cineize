// ============================================================
// SEED 05 — MOVIES (do real-movies.json)
// ============================================================
import * as path from "path";
import * as fs from "fs";
import { prisma, faker } from "./_client";
import { slugify, mapAgeRating } from "./_helpers";

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

export async function seedMovies() {
  const jsonPath = path.resolve(__dirname, "../../real-movies.json");
  const rawData: RawMovie[] = JSON.parse(fs.readFileSync(jsonPath, "utf-8"));

  console.log(
    `   🎬 Criando ${rawData.length} filme(s) do real-movies.json...`,
  );

  const movies: Awaited<ReturnType<typeof prisma.movie.create>>[] = [];

  for (const raw of rawData) {
    const slug = slugify(raw.title);
    const ageRating = mapAgeRating(raw.ageRating);

    const basePrice = faker.number.float({
      min: 1500,
      max: 3000,
      fractionDigits: 2,
    });

    const worldLaunchDate = raw.isReleased
      ? faker.date.between({ from: new Date("2023-01-01"), to: new Date() })
      : faker.date.soon({ days: 90 });

    const movie = await prisma.movie.create({
      data: {
        title: raw.title,
        slug,
        synopsis: raw.synopsis,
        durationMinutes: raw.durationMin,
        genres: raw.genres,
        ageRating,
        director: raw.director ?? null,
        cast: raw.cast ?? [],
        worldLaunchDate,
        basePrice,
        posterUrl: raw.posterUrl ?? null,
        backdropUrl: raw.bannerUrl ?? null,
        trailerUrl: raw.trailerUrl ?? null,
        active: true,
      },
    });

    movies.push(movie);
  }

  console.log(`   ✅ ${movies.length} filme(s) criado(s)`);
  return movies;
}
