"use client";

import * as React from "react";
import { useState, useEffect, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useInView } from "framer-motion";
import { MovieCard } from "./MovieCard";
import { Sparkles, Loader2, Filter, X, Film, Monitor } from "lucide-react";
import { useInfiniteMovies } from "@/lib/features/movies/hooks/use-movies";

import { getDictionary } from "@/app/lib/dictionaries";

interface MoviesClientProps {
  lang: string;
  initialPage?: any;
}

// ─────────────────────────────────────────────────────────────────────────────
// 1. Filter Sidebar Component
// ─────────────────────────────────────────────────────────────────────────────
function FilterSidebar({
  open = false,
  onClose = () => {},
  lang,
}: {
  open?: boolean;
  onClose?: () => void;
  lang: string;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dict = getDictionary(lang);

  const search = searchParams.get("search") || "";
  const urlStatus = searchParams.get("status") || "todos";
  const format = searchParams.get("format") || "todos";

  const updateParams = (key: string, value: string) => {
    const newParams = new URLSearchParams(searchParams.toString());
    if (value && value !== "todos" && value !== "") {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }
    router.replace(`/${lang}/movies?${newParams.toString()}`, {
      scroll: false,
    });
  };

  return (
    <>
      {/* Mobile backdrop */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside
        className={`
          fixed inset-y-0 left-0 z-50 w-72 shrink-0 overflow-y-auto space-y-6 p-6
          border-r border-border bg-background shadow-2xl
          transition-transform duration-300 ease-in-out
          lg:sticky lg:top-24 lg:z-0 lg:h-fit lg:block
          lg:w-72 lg:translate-x-0 lg:rounded-md lg:border lg:bg-neutral-900/40 lg:backdrop-blur-xl lg:shadow-lg
          ${open ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        {/* Mobile close header */}
        <div className="flex items-center justify-between lg:hidden mb-4">
          <span className="font-bold text-lg text-foreground">{dict.movies.list.filters}</span>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 bg-muted hover:bg-muted/80 transition-colors text-foreground"
            aria-label={dict.movies.list.close_menu}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Status */}
        <section className="border-t pt-5 border-border/50">
          <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3 flex items-center gap-2">
            <Film className="h-4 w-4" /> {dict.movies.list.status}
          </h4>
          <ul className="space-y-1">
            {[
              { id: "todos", label: dict.movies.list.all_movies },
              { id: "em-cartaz", label: dict.movies.list.now_showing },
              { id: "pre-venda", label: dict.movies.list.pre_sale },
              { id: "brevemente", label: dict.movies.list.coming_soon },
            ].map((tab) => {
              const isActive = urlStatus === tab.id;
              return (
                <li key={tab.id}>
                  <button
                    onClick={() => {
                      updateParams("status", tab.id);
                      if (window.innerWidth < 1024) onClose();
                    }}
                    className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                      isActive
                        ? "bg-primary text-primary-foreground shadow-md"
                        : "text-muted-foreground hover:bg-neutral-800/60 hover:text-foreground"
                    }`}
                  >
                    {tab.label}
                  </button>
                </li>
              );
            })}
          </ul>
        </section>

        {/* Formato */}
        <section className="border-t pt-5 border-border/50">
          <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3 flex items-center gap-2">
            <Monitor className="h-4 w-4" /> {dict.movies.list.format}
          </h4>
          <select
            value={format}
            onChange={(e) => {
              updateParams("format", e.target.value);
              if (window.innerWidth < 1024) onClose();
            }}
            className="w-full h-11 rounded-xl border border-border/50 bg-background/60 px-4 text-sm font-medium text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary cursor-pointer appearance-none transition-all shadow-sm"
          >
            <option value="todos">{dict.movies.list.any_format}</option>
            <option value="VIP">VIP</option>
            <option value="IMAX">IMAX</option>
            <option value="3D">3D</option>
            <option value="2D">2D</option>
          </select>
        </section>
      </aside>
    </>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 2. Infinite Feed Component
// ─────────────────────────────────────────────────────────────────────────────
function InfiniteMoviesFeed({
  lang,
  initialPage,
}: {
  lang: string;
  initialPage?: any;
}) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const dict = getDictionary(lang);

  const search = searchParams.get("search")?.toLowerCase() || "";
  const urlStatus = searchParams.get("status") || "todos";
  const format = searchParams.get("format") || "todos";
  const locationId = searchParams.get("locationId") || undefined;

  const triggerRef = useRef<HTMLDivElement>(null);

  // Mapear status da URL para status da API
  let apiStatus: string | undefined = undefined;
  if (urlStatus === "em-cartaz") apiStatus = "nowShowing";
  else if (urlStatus === "pre-venda") apiStatus = "presale";
  else if (urlStatus === "brevemente") apiStatus = "comingSoon";

  // Fetch movies da API
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useInfiniteMovies(
      {
        search: search || undefined,
        status: apiStatus,
        format: format !== "todos" ? format : undefined,
        locationId: locationId,
        limit: 10,
      },
      initialPage,
    );

  const moviesList = React.useMemo(() => {
    if (!data) return [];
    return data.pages.flatMap((page) => page.data.items);
  }, [data]);

  const inView = useInView(triggerRef, {
    amount: 0.1,
  });

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  const clearFilters = () => {
    router.replace(`/${lang}/movies`, { scroll: false });
  };

  return (
    <div className="flex-1 space-y-6">
      {/* Loading inicial */}
      {isLoading && moviesList.length === 0 ? (
        <div className="flex justify-center items-center py-24 w-full">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
        </div>
      ) : null}

      {/* Grid de Filmes */}
      {!isLoading && moviesList.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center border border-dashed border-border/60 rounded-3xl bg-neutral-900/20 w-full">
          <div className="h-16 w-16 bg-neutral-800/50 rounded-full flex items-center justify-center mb-4 shadow-inner">
            <Sparkles className="h-8 w-8 text-muted-foreground animate-pulse" />
          </div>
          <h3 className="text-xl font-extrabold text-foreground tracking-tight">
            {dict.movies.list.no_movies}
          </h3>
          <p className="text-sm text-muted-foreground mt-2 max-w-md">
            {dict.movies.list.no_results_desc}
          </p>
          <button
            onClick={clearFilters}
            className="mt-6 px-6 py-2.5 bg-neutral-800 hover:bg-neutral-700 text-foreground rounded-full text-sm font-semibold transition-all hover:scale-105 active:scale-95 shadow-md"
          >
            {dict.movies.list.clear_filters}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {moviesList.map((movie, index) => (
            <MovieCard key={index} movie={movie as any} lang={lang} />
          ))}
        </div>
      )}

      {/* Elemento de Gatilho / Loading ao final da página */}
      {hasNextPage && moviesList.length > 0 && (
        <div ref={triggerRef} className="flex w-full justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      )}

      {!hasNextPage && moviesList.length > 0 && (
        <p className="py-8 text-center text-sm text-muted-foreground">
          {dict.movies.list.end_of_catalog}
        </p>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 3. Main Client Container
// ─────────────────────────────────────────────────────────────────────────────
function MovieListContent(props: MoviesClientProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <>
      <InfiniteMoviesFeed lang={props.lang} initialPage={props.initialPage} />

      {/* Floating Filter Button for Mobile */}
      <button
        onClick={() => setSidebarOpen(true)}
        className="fixed bottom-24 right-1 z-40 flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-3.5 font-bold text-primary-foreground shadow-xl shadow-primary/40 transition-transform hover:scale-105 active:scale-95 lg:hidden"
        aria-label="Filtros"
      >
        <Filter className="h-5 w-5" />
      </button>
    </>
  );
}

export function MovieList(props: MoviesClientProps) {
  return (
    <React.Suspense
      fallback={
        <div className="py-12 flex justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      }
    >
      <MovieListContent {...props} />
    </React.Suspense>
  );
}
