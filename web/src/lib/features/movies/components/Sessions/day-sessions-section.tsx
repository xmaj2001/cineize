"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { SessionCard } from "./session-card";
import { Loader } from "lucide-react";
import { getMovieSessionsByDay } from "../../queries";

interface DaySessionsProps {
  slug: string;
  date: string;
  dayLabel: string;
  dict: any;
  lang: string;
}

export function DaySessionsSection({
  slug,
  date,
  dayLabel,
  dict,
  lang,
}: DaySessionsProps) {
  const [sessions, setSessions] = useState<any[]>([]);
  const [nextCursor, setNextCursor] = useState<string | null>(null); // ← Muda para number
  const [isPending, startTransition] = useTransition();
  const [selectedCinema, setSelectedCinema] = useState<number | undefined>(
    undefined,
  );
  const observerTarget = useRef<HTMLDivElement>(null);

  // Carrega inicial
  useEffect(() => {
    const loadInitial = async () => {
      const res = await getMovieSessionsByDay(
        slug,
        date,
        selectedCinema, // cinemaId
        10,             // limit (default)
        undefined       // cursor (primeira carga)
      );
      setSessions(res.data.items || []);
      setNextCursor(res.data.nextCursor);
    };
    loadInitial();
  }, [slug, date, selectedCinema]);

  // Intersection Observer para "load more"
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && nextCursor && !isPending) {
        startTransition(async () => {
          const res = await getMovieSessionsByDay(
            slug,
            date,
            selectedCinema, // cinemaId
            10,             // limit
            nextCursor      // cursor ✅ AGORA NA POSIÇÃO CORRETA
          );
          setSessions((prev) => [...prev, ...res.data.items]);
          setNextCursor(res.data.nextCursor);
        });
      }
    });

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => observer.disconnect();
  }, [slug, date, selectedCinema, nextCursor, isPending]);

  const uniqueCinemas = Array.from(
    new Set(sessions.map((s) => s.cinema.id)),
  ).map((id) => sessions.find((s) => s.cinema.id === id)!.cinema);

  return (
    <div className="mb-8">
      {/* Header com Label */}
      <div className="flex items-center gap-3 mb-4">
        <h3 className="text-sm font-mono font-bold text-foreground uppercase">
          {dayLabel}
        </h3>
        <span className="flex-1 dotted-x text-foreground/15" />
        <span className="text-[10px] font-mono text-muted-foreground">
          {sessions.length} {sessions.length > 1 ? "sessões" : "sessão"}
        </span>
      </div>

      {/* Filtro de Cinema (só aparece se tem múltiplos cinemas) */}
      {uniqueCinemas.length > 1 && (
        <div className="mb-4 flex gap-2 overflow-x-auto pb-2">
          <button
            onClick={() => setSelectedCinema(undefined)}
            className={`px-3 py-1 text-xs font-mono rounded transition-all ${
              selectedCinema === undefined
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
            }`}
          >
            Todos os cinemas
          </button>
          {uniqueCinemas.map((cinema) => (
            <button
              key={cinema.id}
              onClick={() => setSelectedCinema(cinema.id)}
              className={`px-3 py-1 text-xs font-mono rounded transition-all whitespace-nowrap ${
                selectedCinema === cinema.id
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
              }`}
            >
              {cinema.name}
            </button>
          ))}
        </div>
      )}

      {/* Grid de Sessões */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {sessions.map((session) => (
          <SessionCard
            key={session.id}
            session={session}
            lang={lang}
            dict={dict}
          />
        ))}
      </div>

      {/* Load More Trigger */}
      {nextCursor && (
        <div
          ref={observerTarget}
          className="mt-6 p-4 text-center text-gray-500"
        >
          {isPending ? <Loader className="animate-spin mx-auto" /> : "..."}
        </div>
      )}
    </div>
  );
}