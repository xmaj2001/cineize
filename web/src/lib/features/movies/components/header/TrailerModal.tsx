"use client";

import { useEffect, useCallback } from "react";
import { X } from "lucide-react";
import { useParams } from "next/navigation";
import { getDictionary } from "@/app/lib/dictionaries";

interface TrailerModalProps {
  trailerUrl: string;
  movieTitle: string;
  onClose: () => void;
  lang?: string;
}

function getYouTubeEmbedUrl(url: string): string | null {
  try {
    const parsed = new URL(url);

    if (
      parsed.hostname.includes("youtube.com") &&
      parsed.pathname === "/watch"
    ) {
      const videoId = parsed.searchParams.get("v");
      if (videoId) {
        return `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`;
      }
    }

    if (parsed.hostname === "youtu.be") {
      const videoId = parsed.pathname.slice(1);
      if (videoId) {
        return `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`;
      }
    }

    if (
      parsed.hostname.includes("youtube.com") &&
      parsed.pathname.startsWith("/embed/")
    ) {
      return url.includes("autoplay=1") ? url : `${url}?autoplay=1`;
    }
  } catch {
    // URL inválida
  }

  return null;
}

export function TrailerModal({
  trailerUrl,
  movieTitle,
  onClose,
  lang: propLang,
}: TrailerModalProps) {
  const params = useParams();
  const lang = propLang || (params?.lang as string) || "pt";
  const dict = getDictionary(lang);
  const embedUrl = getYouTubeEmbedUrl(trailerUrl);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    },
    [onClose],
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [handleKeyDown]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8"
      onClick={onClose}
      aria-modal="true"
      role="dialog"
      aria-label={`${dict.movies.trailer_modal.title} - ${movieTitle}`}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/85 backdrop-blur-sm" />

      {/* Modal */}
      <div
        className="relative w-full max-w-4xl z-10"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-3 px-1">
          <p className="text-sm font-mono text-white/70 truncate">
            {dict.movies.trailer_modal.title} — <span className="text-white font-semibold">{movieTitle}</span>
          </p>
          <button
            onClick={onClose}
            className="flex items-center justify-center h-8 w-8 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
            aria-label={dict.movies.trailer_modal.close}
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Player */}
        <div className="relative w-full aspect-video rounded-xl overflow-hidden shadow-2xl bg-black border border-white/10">
          {embedUrl ? (
            <iframe
              src={embedUrl}
              title={`Trailer de ${movieTitle}`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              className="absolute inset-0 w-full h-full"
            />
          ) : (
            /* Fallback se o URL não for do YouTube */
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 text-white/60">
              <p className="text-sm font-mono">
                {dict.movies.trailer_modal.error_message}
              </p>
              <a
                href={trailerUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-primary underline underline-offset-4"
              >
                {dict.movies.trailer_modal.watch_original}
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

