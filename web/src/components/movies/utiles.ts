// Mapeamento que converte o enum para a versão visual e define a ordem de exibição
export const FORMAT_MAP: Record<string, { label: string; order: number }> = {
  TWOD: { label: "2D", order: 1 },
  THREED: { label: "3D", order: 2 },
  FOURD: { label: "4DX", order: 3 },
  MAX: { label: "4DX", order: 4 },
  IMAX: { label: "IMAX", order: 5 },
  VIP: { label: "VIP", order: 6 },
};

export const getMoviesFormat = (
  sessionMovies: { room: { format: string } }[],
): string[] => {
  if (!sessionMovies?.length) return [];

  const rawFormats = new Set(sessionMovies.map((sm) => sm.room.format));

  return Array.from(rawFormats)
    .filter((format) => format in FORMAT_MAP)
    .sort((a, b) => FORMAT_MAP[a].order - FORMAT_MAP[b].order)
    .map((format) => FORMAT_MAP[format].label);
};
