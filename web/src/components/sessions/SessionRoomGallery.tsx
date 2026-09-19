"use client";

import { useState } from "react";
import Image from "next/image";
import { Camera, ChevronLeft, ChevronRight, X, Play } from "lucide-react";

export const ROOM_GALLERY = [
  {
    type: "image" as const,
    label: "Vista Geral",
    src: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=1200&q=80",
  },
  {
    type: "image" as const,
    label: "Lugares VIP",
    src: "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=1200&q=80",
  },
  {
    type: "image" as const,
    label: "Ecrã Principal",
    src: "https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=1200&q=80",
  },
];

export function SessionRoomGallery() {
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [galleryIndex, setGalleryIndex] = useState(0);

  const currentImage = ROOM_GALLERY[galleryIndex];

  return (
    <>
      <div className="hidden md:flex flex-col gap-3">
        {/* Imagem principal */}
        <div
          className="relative aspect-video w-full rounded-2xl overflow-hidden border border-border/40 shadow-2xl cursor-pointer group"
          onClick={() => setGalleryOpen(true)}
        >
          <Image
            src={ROOM_GALLERY[0].src}
            alt="Vista geral da sala"
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="380px"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/70 via-transparent to-transparent" />
          <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-white/80">
              Vista Geral
            </span>
            <div className="flex items-center gap-1.5 bg-black/60 backdrop-blur-sm rounded-full px-3 py-1">
              <Camera className="h-3 w-3 text-white/80" />
              <span className="text-[10px] font-mono text-white/80">
                {ROOM_GALLERY.length} fotos
              </span>
            </div>
          </div>
        </div>

        {/* Miniaturas */}
        <div className="grid grid-cols-3 gap-2">
          {ROOM_GALLERY.slice(0, 3).map((img, i) => (
            <button
              key={i}
              onClick={() => {
                setGalleryIndex(i);
                setGalleryOpen(true);
              }}
              className={`relative aspect-video rounded-xl overflow-hidden border transition-all duration-200 ${
                i === 0
                  ? "border-primary/60 ring-1 ring-primary/40"
                  : "border-border/40 hover:border-border"
              }`}
            >
              <Image
                src={img.src}
                alt={img.label}
                fill
                className="object-cover"
                sizes="100px"
              />
              {i === 2 && ROOM_GALLERY.length > 3 && (
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                  <span className="text-xs font-bold text-white">
                    +{ROOM_GALLERY.length - 3}
                  </span>
                </div>
              )}
            </button>
          ))}
        </div>

        {/* 360 / Vídeo placeholder */}
        <button className="flex items-center justify-center gap-2 w-full rounded-xl border border-border/60 bg-card/40 backdrop-blur-sm py-2.5 text-xs font-mono font-semibold text-muted-foreground hover:text-foreground hover:border-border transition-all duration-200">
          <Play className="h-3.5 w-3.5" />
          Ver em 360°
          <span className="ml-1 text-[9px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground">
            Em breve
          </span>
        </button>
      </div>

      {/* ── Modal Galeria ─────────────────────────────────────── */}
      {galleryOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4">
          <button
            onClick={() => setGalleryOpen(false)}
            className="absolute top-4 right-4 p-2 rounded-full bg-card/60 hover:bg-card border border-border/60 text-foreground transition-all"
          >
            <X className="h-5 w-5" />
          </button>

          <div className="relative w-full max-w-4xl aspect-video rounded-2xl overflow-hidden">
            <Image
              src={currentImage.src}
              alt={currentImage.label}
              fill
              className="object-cover"
              sizes="900px"
            />
            {/* Label */}
            <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-sm rounded-full px-4 py-1.5 text-xs font-mono text-white font-semibold">
              {currentImage.label}
            </div>

            {/* Navegação */}
            {ROOM_GALLERY.length > 1 && (
              <>
                <button
                  onClick={() =>
                    setGalleryIndex((i) =>
                      i === 0 ? ROOM_GALLERY.length - 1 : i - 1,
                    )
                  }
                  className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/60 hover:bg-black/80 border border-white/20 text-white transition-all"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button
                  onClick={() =>
                    setGalleryIndex((i) => (i + 1) % ROOM_GALLERY.length)
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/60 hover:bg-black/80 border border-white/20 text-white transition-all"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </>
            )}
          </div>

          {/* Miniaturas no modal */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
            {ROOM_GALLERY.map((_, i) => (
              <button
                key={i}
                onClick={() => setGalleryIndex(i)}
                className={`w-2 h-2 rounded-full transition-all duration-200 ${
                  i === galleryIndex
                    ? "bg-white scale-125"
                    : "bg-white/40 hover:bg-white/70"
                }`}
              />
            ))}
          </div>
        </div>
      )}
    </>
  );
}

