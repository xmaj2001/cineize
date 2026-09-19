/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import "dotenv/config";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { faker } from "@faker-js/faker";
import { prisma } from "./seeds/_client";
import {
  MovieStatus,
  SeatType,
  TicketStatus,
  ScreenFormat,
  PricingTier,
  SessionMovieType,
  UserRole,
} from "../src/generated/prisma/client";

faker.seed(2026); // Garantir reprodutibilidade

// ═══════════════════════════════════════════════════
// 0. INTERFACE DE TIPAGEM DO JSON DE FILMES
// ═══════════════════════════════════════════════════
interface MovieInput {
  title: string;
  originalTitle: string;
  synopsis: string;
  genres: string[];
  language: string;
  subtitleLanguage: string | null;
  director: string;
  cast: string[];
  posterUrl: string | null;
  bannerUrl: string | null;
  trailerUrl: string | null;
  durationMin: number;
  ageRating: string;
  featured: boolean;
  isReleased: boolean;
  isPresale: boolean;
  tmdbId?: number;
}

// ═══════════════════════════════════════════════════
// 1. LOCALIZAÇÕES REAIS DA cineIze EM ANGOLA
// ═══════════════════════════════════════════════════
const REAL_LOCATIONS = [
  {
    name: "cineIze Nova Vida",
    province: "Luanda",
    city: "Luanda",
    address: "Xyami Shopping Nova Vida, Av. Pedro de Castro Van-Dúnem Loy, nº 10",
    phone: "+244 923 100 001",
    latitude: -8.8923,
    longitude: 13.2185,
  },
  {
    name: "cineIze Belas Shopping",
    province: "Luanda",
    city: "Talatona",
    address: "Belas Shopping, Av. Luanda Sul 1, Talatona",
    phone: "+244 923 100 002",
    latitude: -8.9189,
    longitude: 13.1852,
  },
  {
    name: "cineIze Shopping Fortaleza",
    province: "Luanda",
    city: "Luanda (Baía)",
    address: "Shopping Fortaleza, Piso 4, Av. 4 de Fevereiro (Marginal de Luanda)",
    phone: "+244 923 100 003",
    latitude: -8.8078,
    longitude: 13.2372,
  },
  {
    name: "cineIze Kilamba",
    province: "Luanda",
    city: "Kilamba",
    address: "Xyami Shopping Kilamba, Piso 1, Rua Imperial Santana",
    phone: "+244 923 100 004",
    latitude: -8.9951,
    longitude: 13.2789,
  },
];

const GENRES_LIST = [
  "Ação", "Comédia", "Drama", "Terror", "Ficção Científica",
  "Animação", "Aventura", "Romance", "Thriller", "Documentário"
];
const DIRECTORS_LIST = [
  "Christopher Nolan", "Quentin Tarantino", "Greta Gerwig", "Steven Spielberg",
  "Martin Scorsese", "Jordan Peele", "Guillermo del Toro", "Ryan Coogler"
];

async function main() {
  console.log("🌱 A Iniciar Seed cineIze Angola...\n");

  // ── 0. Carregar Filmes do JSON ─────────────────────────────────────────────
  const jsonPath = join(process.cwd(), "real-movies.json");
  const rawData = readFileSync(jsonPath, "utf-8");
  const REAL_MOVIES: MovieInput[] = JSON.parse(rawData);

  const initialMoviesCount = REAL_MOVIES.length;

  // Expansão do catálogo até 52 filmes
  for (let i = initialMoviesCount + 1; i <= 52; i++) {
    const isReleased = i <= 38;
    const fallbackIndex = (i - 1) % initialMoviesCount;

    REAL_MOVIES.push({
      title: `Filme Exemplo cineIze ${i}`,
      originalTitle: `cineIze Feature Film ${i}`,
      synopsis: `Uma grande produção cinemática exibida exclusivamente nas salas cineIze em Angola. Experiência de som imersiva e projeção em alta definição.`,
      genres: [faker.helpers.arrayElement(GENRES_LIST), faker.helpers.arrayElement(GENRES_LIST)],
      language: i % 2 === 0 ? "pt" : "en",
      subtitleLanguage: i % 2 === 0 ? null : "pt",
      director: faker.helpers.arrayElement(DIRECTORS_LIST),
      cast: [faker.person.fullName(), faker.person.fullName()],
      posterUrl: REAL_MOVIES[fallbackIndex]?.posterUrl ?? null,
      bannerUrl: REAL_MOVIES[fallbackIndex]?.bannerUrl ?? null,
      trailerUrl: REAL_MOVIES[fallbackIndex]?.trailerUrl ?? null,
      durationMin: faker.number.int({ min: 90, max: 155 }),
      ageRating: faker.helpers.arrayElement(["Livre", "M/12", "M/14", "M/16"]),
      featured: false,
      isReleased,
      isPresale: !isReleased && i <= 43,
    });
  }

  // ── 1. Limpar BD ────────────────────────────────────────────────────────────
  console.log("🗑️  A limpar a base de dados...");
  await prisma.ticket.deleteMany();
  await prisma.order.deleteMany();
  await prisma.sessionTicket.deleteMany();
  await prisma.sessionMovie.deleteMany();
  await prisma.presaleSubscription.deleteMany();
  await prisma.movieReview.deleteMany();
  await prisma.movie.deleteMany();
  await prisma.seat.deleteMany();
  await prisma.room.deleteMany();
  await prisma.verification.deleteMany();
  await prisma.oauthConsent.deleteMany();
  await prisma.oauthAccessToken.deleteMany();
  await prisma.oauthApplication.deleteMany();
  await prisma.account.deleteMany();
  await prisma.session.deleteMany();
  await prisma.user.deleteMany();
  await prisma.location.deleteMany();

  console.log("   ✅ Base de dados limpa\n");

  // ── 2. Criar Localizações Reais da cineIze ─────────────────────────────────
  console.log("📍 A criar localizações reais da cineIze em Luanda...");
  const locations = await Promise.all(
    REAL_LOCATIONS.map((loc) =>
      prisma.location.create({
        data: loc,
      })
    )
  );

  console.log(`   ✅ ${locations.length} localizações cineIze criadas.\n`);

  // ── 3. Criar Utilizadores (Admin, Staffs e Clientes) ──────────────────────
  console.log("👤 A criar utilizadores de sistema...");
  await prisma.user.create({
    data: {
      email: "admin@cineize.co.ao",
      name: "Administrador cineIze",
      emailVerified: true,
      passwordHash: faker.string.alphanumeric(60),
      role: UserRole.ADMIN,
    },
  });

  const staffCount = (
    await Promise.all(
      locations.map((loc) =>
        prisma.user.create({
          data: {
            email: `gerente.${loc.name.toLowerCase().replace(/[^a-z]/g, "")}@cineize.co.ao`,
            name: `Gerente ${loc.name}`,
            emailVerified: true,
            passwordHash: faker.string.alphanumeric(60),
            role: UserRole.STAFF,
            locationId: loc.id,
          },
        })
      )
    )
  ).length;

  await Promise.all(
    Array.from({ length: 15 }).map(() =>
      prisma.user.create({
        data: {
          email: faker.internet.email().toLowerCase(),
          name: faker.person.fullName(),
          emailVerified: true,
          passwordHash: faker.string.alphanumeric(60),
          role: UserRole.CLIENT,
        },
      })
    )
  );

  console.log(`   ✅ Utilizadores criados (1 Admin, ${staffCount} Staff e 15 Clientes)\n`);

  // ── 4. Criar Salas e Cadeiras por Localização ──────────────────────────────
  console.log("🎬 A criar salas (2D, 3D, VIP, IMAX) e lugares...");
  const allRooms: { id: string; locationId: string; format: ScreenFormat }[] = [];

  for (const loc of locations) {
    const roomConfigs = [
      { name: "Sala 1 (IMAX)", format: ScreenFormat.IMAX, rows: 8, cols: 12 },
      { name: "Sala 2 (VIP)", format: ScreenFormat.VIP, rows: 5, cols: 8 },
      { name: "Sala 3 (3D)", format: ScreenFormat.D3, rows: 6, cols: 10 },
      { name: "Sala 4 (2D)", format: ScreenFormat.D2, rows: 6, cols: 10 },
    ];

    for (const config of roomConfigs) {
      const capacity = config.rows * config.cols;

      const room = await prisma.room.create({
        data: {
          name: config.name,
          capacity,
          format: config.format,
          locationId: loc.id,
        },
      });

      allRooms.push({ id: room.id, locationId: loc.id, format: config.format });

      const rowLetters = ["A", "B", "C", "D", "E", "F", "G", "H"].slice(0, config.rows);
      const seatsData = rowLetters.flatMap((row) =>
        Array.from({ length: config.cols }, (_, idx) => {
          const number = idx + 1;
          let type: SeatType = SeatType.STANDARD;

          if (config.format === ScreenFormat.VIP || row === "A") {
            type = SeatType.RECLINER;
          } else if (row === rowLetters[rowLetters.length - 1] && number <= 2) {
            type = SeatType.ACCESSIBLE;
          }

          return { row, number, type, roomId: room.id };
        })
      );

      await prisma.seat.createMany({ data: seatsData });
    }
  }

  console.log(`   ✅ ${allRooms.length} salas criadas com mapa de cadeiras completo.\n`);

  // ── 5. Criar Filmes Reais ──────────────────────────────────────────────────
  console.log(`🎞️  A registar ${REAL_MOVIES.length} filmes no catálogo...`);

  const now = new Date();

  const createdMovies = await Promise.all(
    REAL_MOVIES.map((m) => {
      const daysOffset = m.isReleased
        ? -Math.floor(Math.random() * 120) - 5
        : Math.floor(Math.random() * 60) + 10;

      const releaseDate = new Date(now.getTime() + daysOffset * 86400000);

      return prisma.movie.create({
        data: {
          title: m.title,
          originalTitle: m.originalTitle,
          synopsis: m.synopsis,
          genres: m.genres,
          language: m.language,
          subtitleLanguage: m.subtitleLanguage,
          cast: m.cast,
          director: m.director,
          posterUrl: m.posterUrl ?? "",
          bannerUrl: m.bannerUrl,
          trailerUrl: m.trailerUrl,
          durationMin: m.durationMin,
          ageRating: m.ageRating,
          featured: m.featured,
          status: MovieStatus.ACTIVE,
          releaseDate,
        },
      });
    })
  );

  console.log(`   ✅ ${createdMovies.length} filmes registados no catálogo.\n`);

  // ── 6. Criar Sessões Reais e Bilhetes ──────────────────────────────────────
  console.log("🕒 A gerar sessões de cinema coerentes (Em Cartaz, Pré-venda)...");

  let totalSessions = 0;
  let totalTickets = 0;

  const releasedMovies = createdMovies.filter((m) => m.releaseDate <= now);
  const presaleMovies = createdMovies.filter((m) => m.releaseDate > now);

  for (const room of allRooms) {
    for (let day = 0; day < 5; day++) {
      const sessionDate = new Date(now.getTime() + day * 24 * 60 * 60 * 1000);
      const hours = [14, 17, 20];

      for (const hour of hours) {
        const movie = faker.helpers.arrayElement(releasedMovies);

        const startTime = new Date(sessionDate);
        startTime.setHours(hour, 0, 0, 0);

        const endTime = new Date(startTime.getTime() + movie.durationMin * 60_000);
        const saleOpensAt = new Date(startTime.getTime() - 10 * 24 * 60 * 60 * 1000);

        const price = room.format === ScreenFormat.VIP ? 6000 : room.format === ScreenFormat.IMAX ? 4500 : 3500;

        const sessionMovie = await prisma.sessionMovie.create({
          data: {
            movieId: movie.id,
            roomId: room.id,
            startTime,
            endTime,
            saleOpensAt,
            price,
            tier: day >= 4 ? PricingTier.WEEKEND : PricingTier.WEEKDAY,
            type: SessionMovieType.NORMAL,
          },
        });

        totalSessions++;

        const seats = await prisma.seat.findMany({ where: { roomId: room.id } });
        const ticketsData = seats.map((seat) => ({
          sessionMovieId: sessionMovie.id,
          seatId: seat.id,
          status: TicketStatus.AVAILABLE,
        }));

        await prisma.sessionTicket.createMany({ data: ticketsData });
        totalTickets += ticketsData.length;
      }
    }

    if (presaleMovies.length > 0) {
      const presaleMovie = faker.helpers.arrayElement(presaleMovies);
      const presaleStartTime = new Date(presaleMovie.releaseDate.getTime() + 1 * 24 * 60 * 60 * 1000);
      presaleStartTime.setHours(20, 30, 0, 0);

      const presaleEndTime = new Date(presaleStartTime.getTime() + presaleMovie.durationMin * 60_000);
      const saleOpensAt = new Date();

      const presaleSession = await prisma.sessionMovie.create({
        data: {
          movieId: presaleMovie.id,
          roomId: room.id,
          startTime: presaleStartTime,
          endTime: presaleEndTime,
          saleOpensAt,
          price: room.format === ScreenFormat.VIP ? 7500 : 5000,
          tier: PricingTier.HOLIDAY,
          type: SessionMovieType.PREMIERE,
        },
      });

      totalSessions++;

      const seats = await prisma.seat.findMany({ where: { roomId: room.id } });
      const ticketsData = seats.map((seat) => ({
        sessionMovieId: presaleSession.id,
        seatId: seat.id,
        status: TicketStatus.AVAILABLE,
      }));

      await prisma.sessionTicket.createMany({ data: ticketsData });
      totalTickets += ticketsData.length;
    }
  }

  console.log(`   ✅ ${totalSessions} sessões geradas e ${totalTickets} bilhetes criados no mapa de sala.\n`);

  console.log("🚀 Seed cineIze Angola concluído com sucesso!");
}

main()
  .catch((e) => {
    console.error("❌ Erro no seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
