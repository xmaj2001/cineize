import { Dictionary } from "@/app/lib/dictionaries";
import { MovieSession } from "../../type";
import { SessionCard } from "./session-card";

interface SessionGridProps {
  sessions: MovieSession[];
  lang: string;
  dict: Dictionary;
}

export function SessionGrid({ sessions, lang, dict }: SessionGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {sessions.map((session) => {
        return (
          <SessionCard
            key={session.id}
            session={session}
            lang={lang}
            dict={dict}
          />
        );
      })}
    </div>
  );
}
