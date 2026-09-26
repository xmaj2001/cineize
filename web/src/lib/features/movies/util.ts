import { Dictionary } from "@/app/lib/dictionaries";
import { MovieSession } from "./type";

export function groupSessionsByDay(
  sessions: MovieSession[],
  lang: string,
  dict: Dictionary,
): Map<string, MovieSession[]> {
  const groups = new Map<string, MovieSession[]>();
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const dayNamesFull: Record<number, string> = {
    0: dict.days.sunday,
    1: dict.days.monday,
    2: dict.days.tuesday,
    3: dict.days.wednesday,
    4: dict.days.thursday,
    5: dict.days.friday,
    6: dict.days.saturday,
  };

  const sorted = [...sessions].sort(
    (a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime(),
  );

  for (const session of sorted) {
    const date = new Date(session.startTime);
    const dateKey = date.toISOString().split("T")[0];

    let label: string;
    if (dateKey === today.toISOString().split("T")[0]) {
      label = dict.movies.sessions_list.today;
    } else if (dateKey === tomorrow.toISOString().split("T")[0]) {
      label = dict.movies.sessions_list.tomorrow;
    } else {
      const dayName = dayNamesFull[date.getDay()] ?? "";
      label = `${dayName}, ${date.toLocaleDateString(
        lang === "en" ? "en-US" : "pt-PT",
        {
          day: "numeric",
          month: "short",
        },
      )}`;
    }

    if (!groups.has(label)) groups.set(label, []);
    groups.get(label)!.push(session);
  }

  return groups;
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
