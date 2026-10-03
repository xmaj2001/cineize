export type AgeRating =
  | "G"
  | "PG"
  | "PG13"
  | "RATED12"
  | "RATED14"
  | "RATED16"
  | "RATED18";

interface AgeRatingConfig {
  label: string;
  badgeClass: string;
}

export const AGE_RATING_MAP: Record<string, AgeRatingConfig> = {
  G: { label: "Livre", badgeClass: "border-emerald-500/40 text-emerald-400 bg-emerald-500/10" },
  PG: { label: "10+", badgeClass: "border-blue-500/40 text-blue-400 bg-blue-500/10" },
  PG13: { label: "13+", badgeClass: "border-yellow-500/40 text-yellow-400 bg-yellow-500/10" },
  RATED12: { label: "12+", badgeClass: "border-yellow-500/40 text-yellow-400 bg-yellow-500/10" },
  RATED14: { label: "14+", badgeClass: "border-orange-500/40 text-orange-400 bg-orange-500/10" },
  RATED16: { label: "16+", badgeClass: "border-red-500/40 text-red-400 bg-red-500/10" },
  RATED18: { label: "18+", badgeClass: "border-purple-500/40 text-purple-400 bg-purple-500/10" },
};

export function getAgeRatingConfig(rating: string | null): AgeRatingConfig {
  if (!rating || !AGE_RATING_MAP[rating]) {
    return { label: "TBD", badgeClass: "border-border text-muted-foreground bg-muted/20" };
  }
  return AGE_RATING_MAP[rating];
}