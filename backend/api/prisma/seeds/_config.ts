// ============================================================
// SEED CONFIGURATION
// Ajusta aqui os valores para controlar o volume de dados gerados
// ============================================================

export const SEED_CONFIG = {
  // ── Localidades ──────────────────────────────────────────
  locations: 5, // número de cidades angolanas a criar

  // ── Cinemas ───────────────────────────────────────────────
  cinemasPerLocation: 2, // cinemas por cidade

  // ── Salas ─────────────────────────────────────────────────
  hallsPerCinema: 3, // salas por cinema

  // ── Lugares ───────────────────────────────────────────────
  seatsPerHall: {
    rows: 8, // linhas de assentos (A-H)
    seatsPerRow: 10, // lugares por linha → 80 por sala
    vipRows: ["A", "B"] as string[], // linhas VIP
    accessibilityCount: 2, // lugares de acessibilidade (últimos da última fila)
  },

  // ── Filmes ────────────────────────────────────────────────
  // Todos os filmes vêm do real-movies.json (não configurável)

  // ── Exibições ─────────────────────────────────────────────
  exhibitionsPerMovie: 2, // exibições por filme

  // ── Sessões ───────────────────────────────────────────────
  sessionsPerExhibition: 4, // sessões por exibição (horários: 10h, 14h, 17h, 20h)
} as const;

export type SeedConfig = typeof SEED_CONFIG;
