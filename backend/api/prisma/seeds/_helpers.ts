// ============================================================
// SHARED HELPERS FOR SEED FILES
// ============================================================
import { AgeRating } from "../../src/generated/prisma/client";

/**
 * Converte um título em slug URL-friendly
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // remove diacríticos
    .replace(/[^a-z0-9\s-]/g, "") // remove caracteres especiais
    .trim()
    .replace(/\s+/g, "-") // espaços → hífens
    .replace(/-+/g, "-"); // múltiplos hífens → um
}

/**
 * Mapeamento de ageRating do JSON para enum do Prisma
 */
export function mapAgeRating(jsonRating: string): AgeRating {
  const map: Record<string, AgeRating> = {
    "M/M/6": AgeRating.G,
    "M/PG": AgeRating.PG,
    "M/12": AgeRating.RATED12,
    "M/M/12": AgeRating.RATED12,
    "M/M/14": AgeRating.RATED14,
    "M/M/16": AgeRating.RATED16,
    "M/M/18": AgeRating.RATED18,
  };
  return map[jsonRating] ?? AgeRating.PG13;
}

/**
 * Gera um DateTime apenas com a parte de hora (para Time fields do Prisma)
 * O Prisma armazena Time como DateTime com data fixa 1970-01-01
 */
export function toTimeField(hours: number, minutes = 0): Date {
  const d = new Date(0); // 1970-01-01T00:00:00Z
  d.setUTCHours(hours, minutes, 0, 0);
  return d;
}

/**
 * Adiciona dias a uma data
 */
export function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

/**
 * Escolhe um elemento aleatório de um array
 */
export function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}
