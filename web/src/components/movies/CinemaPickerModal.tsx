"use client";

import { useState, useMemo } from "react";
import { Search, MapPin, X, Film } from "lucide-react";
import { ApiSessionMovie } from "@/lib/features/movies";
import { useParams } from "next/navigation";
import { getDictionary } from "@/app/lib/dictionaries";

interface CinemaLocation {
  id: string;
  name: string;
  city: string;
  province: string;
  sessionCount: number;
}

interface CinemaPickerModalProps {
  sessions: ApiSessionMovie[];
  onSelect: (locationId: string) => void;
  onClose: () => void;
  lang?: string;
}

export function CinemaPickerModal({
  sessions,
  onSelect,
  onClose,
  lang: propLang,
}: CinemaPickerModalProps) {
  const params = useParams();
  const lang = propLang || (params?.lang as string) || "pt";
  const dict = getDictionary(lang);
  const [search, setSearch] = useState("");

  // Extract unique locations from sessions
  const cinemas = useMemo(() => {
    const map = new Map<string, CinemaLocation>();
    for (const session of sessions) {
      const loc = session.room.location;
      if (!map.has(loc.id)) {
        map.set(loc.id, {
          id: loc.id,
          name: loc.name,
          city: loc.city,
          province: loc.province,
          sessionCount: 0,
        });
      }
      map.get(loc.id)!.sessionCount++;
    }
    return Array.from(map.values()).sort(
      (a, b) => b.sessionCount - a.sessionCount,
    );
  }, [sessions]);

  const filtered = useMemo(() => {
    if (!search.trim()) return cinemas;
    const q = search.toLowerCase();
    return cinemas.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.city.toLowerCase().includes(q) ||
        c.province.toLowerCase().includes(q),
    );
  }, [cinemas, search]);

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal-panel modal-animate w-full max-w-lg mx-4 p-0"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-border">
          <div>
            <h2 className="text-base font-display font-bold uppercase tracking-wider text-foreground">
              {dict.movies.cinema_picker.title}
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5 font-mono">
              {dict.movies.cinema_picker.subtitle}
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-2 hover:bg-secondary transition"
          >
            <X className="h-4 w-4 text-muted-foreground" />
          </button>
        </div>

        {/* Search */}
        <div className="p-4 border-b border-border/50">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={dict.movies.cinema_picker.placeholder}
              className="w-full rounded-lg border border-border bg-background pl-10 pr-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring font-mono"
              autoFocus
            />
          </div>
        </div>

        {/* Cinema list */}
        <div className="max-h-[400px] overflow-y-auto p-2">
          {filtered.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-sm text-muted-foreground font-mono">
                {dict.movies.cinema_picker.no_cinemas}
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-1">
              {filtered.map((cinema) => {
                const hasNoCinemaSessions = cinema.sessionCount === 0;
                return (
                  <button
                    key={cinema.id}
                    onClick={() => !hasNoCinemaSessions && onSelect(cinema.id)}
                    disabled={hasNoCinemaSessions}
                    className={`w-full flex items-center gap-4 rounded-lg p-4 text-left transition ${
                      hasNoCinemaSessions
                        ? "cinema-disabled"
                        : "hover:bg-secondary/60 cursor-pointer"
                    }`}
                  >
                    <div className="w-10 h-10 rounded-lg bg-secondary border border-border flex items-center justify-center shrink-0">
                      <Film className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-foreground truncate">
                        {cinema.name}
                      </p>
                      <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                        <MapPin className="h-3 w-3" />
                        {cinema.city}, {cinema.province}
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      {hasNoCinemaSessions ? (
                        <span className="text-[10px] font-mono text-muted-foreground uppercase">
                          {dict.movies.cinema_picker.no_sessions}
                        </span>
                      ) : (
                        <span className="text-[10px] font-mono text-primary font-bold">
                          {cinema.sessionCount} {cinema.sessionCount > 1 ? dict.movies.cinema_picker.session_many : dict.movies.cinema_picker.session_one}
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
