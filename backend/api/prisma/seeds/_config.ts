export const SEED_CONFIG = {
  locations: 5,
  cinemasPerLocation: 2,
  hallsPerCinema: 3,

  seatsPerHall: {
    rows: 8,
    seatsPerRow: 10,
    vipRows: ["A", "B"] as string[],
    accessibilityCount: 2,
  },
  scenarioSplit: {
    nowShowing: 0.6,
    presale: 0.2,
    comingSoon: 0.2,
  },

  // Horários das sessões (hora de Luanda)
  sessionHours: [10, 14, 17, 20],

  // ── Cenários de filmes ────────────────────────────────────
  nowShowing: {
    releasedDaysAgo: { min: 3, max: 60 }, // estreou há X dias
    daysAhead: 7, // sessões nos próximos X dias
    sessionsPerDay: 4,
  },
  presale: {
    launchInDays: { min: 5, max: 30 }, // estreia daqui a X dias
    startedDaysAgo: 3, // pré-venda abriu há X dias
    sessionDays: 3, // dias de sessões a partir da estreia
    sessionsPerDay: 2,
  },
  comingSoon: {
    launchInDays: { min: 45, max: 120 },
  },

  // ── Destaques (carrossel) ─────────────────────────────────
  featured: {
    globalNowShowing: 3,
    perCinema: 2,
  },
} as const;

export type SeedConfig = typeof SEED_CONFIG;
