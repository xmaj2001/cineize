"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { FeedMovieCard } from "./feed-movie-card";
import { FeedMovieCardSkeleton } from "./feed-movie-skeleton";
import { Loader } from "lucide-react";
import { FeedMovieItem } from "../../type";
import { getCursorMovies } from "../../queries";

interface InfiniteListProps {
  initialItems: FeedMovieItem[];
  initialCursor: string | null;
}

export default function InfiniteList({
  initialItems,
  initialCursor,
}: InfiniteListProps) {
  const [items, setItems] = useState<FeedMovieItem[]>(initialItems);
  const [nextCursor, setNextCursor] = useState<string | null>(initialCursor);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const isLoadingRef = useRef(false);
  const observerTarget = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && nextCursor && !isLoadingRef.current) {
          isLoadingRef.current = true;
          startTransition(async () => {
            try {
              setError(null);
              const res = await getCursorMovies(nextCursor, 10);
              const newItems = res.data?.items || [];
              const newCursor = res.data?.nextCursor || null;

              setItems((prevItems) => {
                const existingIds = new Set(
                  prevItems.map((item: FeedMovieItem) => item.id),
                );
                const filteredNewItems = newItems.filter(
                  (item: FeedMovieItem) => !existingIds.has(item.id),
                );
                return [...prevItems, ...filteredNewItems];
              });

              setNextCursor(newCursor);
            } catch (err) {
              setError("Erro ao carregar mais filmes. Tenta novamente.");
              console.error(err);
            } finally {
              isLoadingRef.current = false;
            }
          });
        }
      },
      { threshold: 0.1 },
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => observer.disconnect();
  }, [nextCursor]);

  return (
    <div className="space-y-8 w-full">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
        {items.map((movie) => (
          <FeedMovieCard key={movie.id} movie={movie} />
        ))}

        {/* Loading skeletons */}
        {isPending && (
          <>
            {Array.from({ length: 10 }).map((_, i) => (
              <FeedMovieCardSkeleton key={`skeleton-${i}`} />
            ))}
          </>
        )}
      </div>

      {/* 
        Error state
        //TODO: Implement better error handling
      */}
      {error && (
        <div className="p-4 text-center text-red-500 bg-red-50 rounded">
          {error}
        </div>
      )}

      {/* Trigger */}
      {nextCursor && (
        <div ref={observerTarget} className="p-4 text-center text-gray-500">
          {isPending ? (
            <Loader className="animate-spin mx-auto" />
          ) : (
            "Scroll para mais filmes..."
          )}
        </div>
      )}

      {!nextCursor && (
        <div className="p-4 text-center text-gray-500">
          Você chegou ao final da lista.
        </div>
      )}
    </div>
  );
}
