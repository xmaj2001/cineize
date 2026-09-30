import "dotenv/config";
import { prisma } from "./seeds/_client";
import { SEED_CONFIG } from "./seeds/_config";

import { seedLocations } from "./seeds/01-locations.seed";
import { seedCinemas } from "./seeds/02-cinemas.seed";
import { seedHalls } from "./seeds/03-halls.seed";
import { seedSeats } from "./seeds/04-seats.seed";
import { seedMovies } from "./seeds/05-movies.seed";
import { seedExhibitions } from "./seeds/06-exhibitions.seed";
import { seedSessions } from "./seeds/07-sessions.seed";
import { seedTickets } from "./seeds/08-tickets.seed";
import { seedFeatured } from "./seeds/09-featured.seed";

async function main() {
  console.log("🌱 Cineize Seed\n");
  console.log("⚙️  Configuração:", JSON.stringify(SEED_CONFIG, null, 2), "\n");

  console.log("🗑️  A limpar a base de dados...");
  await prisma.$transaction([
    prisma.ticket.deleteMany(),
    prisma.sessionMovie.deleteMany(),
    prisma.exhibition.deleteMany(),
    prisma.featuredMovie.deleteMany(),
    prisma.movie.deleteMany(),
    prisma.seat.deleteMany(),
    prisma.hall.deleteMany(),
    prisma.cinema.deleteMany(),
    prisma.location.deleteMany(),
  ]);
  console.log("   ✅ Base de dados limpa\n");

  console.log("📦 Layer 1 — Localidades");
  const locations = await seedLocations(SEED_CONFIG);

  console.log("\n📦 Layer 2 — Infraestrutura");
  const cinemas = await seedCinemas(locations, SEED_CONFIG);
  const halls = await seedHalls(cinemas, SEED_CONFIG);
  await seedSeats(halls, SEED_CONFIG);

  console.log("\n📦 Layer 3 — Filmes");
  const movies = await seedMovies();

  console.log("\n📦 Layer 4 — Exibições");
  const exhibitions = await seedExhibitions(movies);

  console.log("\n📦 Layer 5 — Sessões");
  const sessionsCount = await seedSessions(exhibitions, halls, movies.all);

  console.log("\n📦 Layer 6 — Tickets de demonstração");
  await seedTickets();

  console.log("\n📦 Layer 7 — Destaques");
  const featuredCount = await seedFeatured(movies, cinemas);

  console.log("\n" + "═".repeat(50));
  console.log("🚀 Seed concluído com sucesso!");
  console.log("═".repeat(50));
  console.log(`   📍 Localidades : ${locations.length}`);
  console.log(`   🏢 Cinemas     : ${cinemas.length}`);
  console.log(`   🎭 Salas       : ${halls.length}`);
  console.log(
    `   💺 Lugares     : ${halls.length * SEED_CONFIG.seatsPerHall.rows * SEED_CONFIG.seatsPerHall.seatsPerRow}`,
  );
  console.log(`   🎬 Filmes      : ${movies.all.length}`);
  console.log(`      ├ Em cartaz : ${movies.nowShowing.length}`);
  console.log(`      ├ Pré-venda : ${movies.presale.length}`);
  console.log(`      └ Em breve  : ${movies.comingSoon.length}`);
  console.log(`   🎪 Exibições   : ${exhibitions.length}`);
  console.log(`   🎟️  Sessões     : ${sessionsCount}`);
  console.log(`   ⭐ Destaques   : ${featuredCount}`);
  console.log("═".repeat(50) + "\n");
}

main()
  .catch((e) => {
    console.error("❌ Erro no seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
