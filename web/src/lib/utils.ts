import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const socialLinks = {
  facebook: "https://www.facebook.com/cinema.co.ao",
  twitter: "https://twitter.com/cinema_co_ao",
  instagram: "https://www.instagram.com/cinema.co.ao",
};

export function formatPrice(price: number): string {
  return new Intl.NumberFormat("pt-AO", {
    style: "currency",
    currency: "AOA",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
}

export const FORMAT_MAP: Record<string, { label: string; order: number }> = {
  TWOD: { label: "2D", order: 1 },
  THREED: { label: "3D", order: 2 },
  FOURD: { label: "4DX", order: 3 },
  IMAX: { label: "IMAX", order: 4 },
};

export const getMoviesFormat = (
  sessionMovies: { format: string }[],
): string[] => {
  if (!sessionMovies?.length) return [];

  const rawFormats = new Set(sessionMovies.map((sm) => sm.format));
  return Array.from(rawFormats)
    .filter((format) => format in FORMAT_MAP)
    .sort((a, b) => FORMAT_MAP[a].order - FORMAT_MAP[b].order)
    .map((format) => FORMAT_MAP[format].label);
};
