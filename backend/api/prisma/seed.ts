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

async function main() {
  console.log("🌱 Cineize Seed\n");
  console.log("⚙️  Configuração:", JSON.stringify(SEED_CONFIG, null, 2), "\n");

  // ── Limpar BD (ordem inversa de FK) ────────────────────────
  console.log("🗑️  A limpar a base de dados...");
  await prisma.sessionMovie.deleteMany();
  await prisma.exhibition.deleteMany();
  await prisma.movie.deleteMany();
  await prisma.seat.deleteMany();
  await prisma.hall.deleteMany();
  await prisma.cinema.deleteMany();
  await prisma.location.deleteMany();
  console.log("   ✅ Base de dados limpa\n");

  // ── Layer 1: Geografias ────────────────────────────────────
  console.log("📦 Layer 1 — Localidades");
  const locations = await seedLocations(SEED_CONFIG);

  // ── Layer 2: Infraestrutura ────────────────────────────────
  console.log("\n📦 Layer 2 — Infraestrutura");
  const cinemas = await seedCinemas(locations, SEED_CONFIG);
  const halls = await seedHalls(cinemas, SEED_CONFIG);
  await seedSeats(halls, SEED_CONFIG);

  // ── Layer 3: Conteúdo ──────────────────────────────────────
  console.log("\n📦 Layer 3 — Filmes");
  const movies = await seedMovies();

  // ── Layer 4: Exibições ─────────────────────────────────────
  console.log("\n📦 Layer 4 — Exibições");
  const exhibitions = await seedExhibitions(movies, SEED_CONFIG);

  // ── Layer 5: Sessões ───────────────────────────────────────
  console.log("\n📦 Layer 5 — Sessões");
  await seedSessions(exhibitions, halls, SEED_CONFIG);

  // ── Layer 6: Tickets de demonstração (lugares ocupados) ─────
  console.log("\n📦 Layer 6 — Tickets de demonstração");
  await seedTickets();

  // ── Resumo ─────────────────────────────────────────────────
  console.log("\n" + "═".repeat(50));
  console.log("🚀 Seed concluído com sucesso!");
  console.log("═".repeat(50));
  console.log(`   📍 Localidades : ${locations.length}`);
  console.log(`   🏢 Cinemas     : ${cinemas.length}`);
  console.log(`   🎭 Salas       : ${halls.length}`);
  console.log(
    `   💺 Lugares     : ${halls.length * SEED_CONFIG.seatsPerHall.rows * SEED_CONFIG.seatsPerHall.seatsPerRow}`,
  );
  console.log(`   🎬 Filmes      : ${movies.length}`);
  console.log(`   🎪 Exibições   : ${exhibitions.length}`);
  console.log(
    `   🎟️  Sessões     : ~${exhibitions.length * SEED_CONFIG.sessionsPerExhibition}`,
  );
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
