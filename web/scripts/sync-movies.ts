// scripts/sync-movies.ts

import { writeFile } from "node:fs/promises";

const TMDB_READ_TOKEN = "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIwZDc2MGQyOTA4YTAwYmY2NGY4NzZiYzIzMzA0N2EyMCIsIm5iZiI6MTc4ODc5NDE4Ny4yNzIsInN1YiI6IjZhOWVkNTRiYmY2MGYzMmU0NjdkNGRlYiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.rAWVbuPDGf_-BJwbHuq4AEL1v3BrWtu93kQLL3fIEkI";

if (!TMDB_READ_TOKEN) {
  throw new Error("TMDB_READ_TOKEN não está definida.");
}

const BASE_URL = "https://api.themoviedb.org/3";
const IMAGE_BASE_URL = "https://image.tmdb.org/t/p";

const MOVIES = [
  "Dune: Parte Segunda",
  "Divertida-Mente 2",
  "Deadpool & Wolverine",
  "Gladiador II",
  "Moana 2",
  "Joker: Loucura a Dois",
  "O Gang dos Tubarões: O Regresso",
  "O Reino do Planeta dos Macacos",
  "Kung Fu Panda 4",
  "Godzilla x Kong: O Novo Império",
  "O Robô Selvagem",
  "Wicked: Parte I",
  "Venom: A Última Dança",
  "Alien: Romulus",
  "Beetlejuice Beetlejuice",
  "Furiosa: Uma Saga Mad Max",
  "Twisters",
  "Mufasa: O Rei Leão",
  "Sonic 3: O Filme",
  "A Substância",
  "Avatar 3: Fogo e Cinzas",
  "Vingadores: Apocalipse",
  "Superman",
];

type TMDBMovie = {
  id: number;
  title: string;
  original_title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  runtime: number | null;
  genres: { id: number; name: string }[];
  original_language: string;
  videos?: {
    results: {
      key: string;
      name: string;
      site: string;
      type: string;
      official: boolean;
    }[];
  };
  credits?: {
    cast: { name: string; order: number }[];
    crew: { name: string; job: string }[];
  };
  release_dates?: {
    results: {
      iso_3166_1: string;
      release_dates: { certification: string }[];
    }[];
  };
};

async function tmdbFetch<T>(path: string): Promise<T> {
  const response = await fetch(`${BASE_URL}${path}`, {
    headers: {
      Authorization: `Bearer ${TMDB_READ_TOKEN}`,
      accept: "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`TMDB ${response.status}: ${await response.text()}`);
  }

  return response.json() as Promise<T>;
}

async function main() {
  const catalog = [];

  for (const title of MOVIES) {
    console.log(`🎬 Buscando: ${title}`);

    const search = await tmdbFetch<{ results: TMDBMovie[] }>(
      `/search/movie?query=${encodeURIComponent(title)}&language=pt-PT`
    );

    const movie = search.results[0];

    if (!movie) {
      console.warn(`⚠️ Não encontrado: ${title}`);
      continue;
    }

    // Busca detalhes estendidos: vídeos, créditos e classificação etária
    const details = await tmdbFetch<TMDBMovie>(
      `/movie/${movie.id}?language=pt-PT&append_to_response=videos,credits,release_dates&include_video_language=pt,en,null`
    );

    // Trailer
    const videos = details.videos?.results || [];
    const trailer =
      videos.find((v) => v.site === "YouTube" && v.type === "Trailer" && v.official) ||
      videos.find((v) => v.site === "YouTube" && v.type === "Trailer");

    // Diretor
    const directorObj = details.credits?.crew.find((member) => member.job === "Director");
    const director = directorObj ? directorObj.name : "Desconhecido";

    // Elenco principal (3 primeiros atores)
    const cast = details.credits?.cast.slice(0, 3).map((actor) => actor.name) || [];

    // Classificação Etária (busca PT ou US)
    const releaseInfo = details.release_dates?.results.find(
      (r) => r.iso_3166_1 === "PT" || r.iso_3166_1 === "US"
    );
    const certification = releaseInfo?.release_dates.find((d) => d.certification !== "")?.certification;
    const ageRating = certification ? `M/${certification}` : "M/12";

    // Data de Lançamento e Estados
    const releaseDate = details.release_date ? new Date(details.release_date) : null;
    const today = new Date();
    const isReleased = releaseDate ? releaseDate <= today : false;
    const isPresale = !isReleased;

    catalog.push({
      title: details.title,
      originalTitle: details.original_title,
      synopsis: details.overview,
      genres: details.genres.map((genre) => genre.name),
      language: details.original_language,
      subtitleLanguage: "pt",
      director,
      cast,
      posterUrl: details.poster_path ? `${IMAGE_BASE_URL}/w500${details.poster_path}` : null,
      bannerUrl: details.backdrop_path ? `${IMAGE_BASE_URL}/w1280${details.backdrop_path}` : null,
      trailerUrl: trailer ? `https://www.youtube.com/watch?v=${trailer.key}` : null,
      tmdbId: details.id,
      durationMin: details.runtime || 0,
      ageRating,
      featured: catalog.length < 5, // Define os 5 primeiros filmes da lista como em destaque
      isReleased,
      isPresale,
    });
  }

  await writeFile("real-movies.json", JSON.stringify(catalog, null, 2), "utf8");

  console.log(`\n✅ Catálogo gerado com ${catalog.length} filmes e todos os campos preenchidos.`);
}

main().catch((error) => {
  console.error("❌ Erro:", error);
  process.exit(1);
});