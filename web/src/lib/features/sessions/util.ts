import { Dictionary } from "@/app/lib/dictionaries";
import { MovieSession } from "./types";

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

