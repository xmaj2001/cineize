"use client";

import Image from "next/image";
import Link from "next/link";
import {
  MapPin,
  Users,
  Monitor,
  Film,
  Armchair,
  ExternalLink,
  Shuffle,
  Ticket,
} from "lucide-react";
import { ApiSessionDetail } from "@/lib/features/sessions";
import { SessionType } from "@/lib/features/movies";
import { formatPrice } from "@/lib/utils";
import { useLocations } from "@/lib/features/locations/hooks/use-locations";

import { getDictionary } from "@/app/lib/dictionaries";

const FORMAT_LABELS: Record<string, string> = {
  D2: "2D",
  D3: "3D",
  D4X: "4DX",
  IMAX: "IMAX",
  VIP: "VIP",
};

const FORMAT_COLORS: Record<string, string> = {
  IMAX: "bg-blue-500/20 text-blue-400 border-blue-500/40",
  D3: "bg-purple-500/20 text-purple-400 border-purple-500/40",
  D4X: "bg-amber-500/20 text-amber-400 border-amber-500/40",
  VIP: "bg-rose-500/20 text-rose-400 border-rose-500/40",
  D2: "bg-neutral-500/20 text-neutral-400 border-neutral-500/40",
};

interface HeaderSessionProps {
  session: ApiSessionDetail;
  lang: string;
}

export function HeaderSession({ session, lang }: HeaderSessionProps) {
  const dict = getDictionary(lang);
  const { data: locations = [] } = useLocations();
  const locationDetails = locations.find(l => l.id === session.room.location.id);

  const startDate = new Date(session.startTime);
  const endDate = new Date(session.endTime);
  const saleOpens = new Date(session.saleOpensAt);
  const now = new Date();

  const isSaleOpen = saleOpens <= now;
  const isStarted = startDate <= now;
  const tierLabels: Record<string, string> = {
    WEEKDAY: dict.sessions.header.tiers.WEEKDAY,
    WEEKEND: dict.sessions.header.tiers.WEEKEND,
    HOLIDAY: dict.sessions.header.tiers.HOLIDAY,
    STUDENT: dict.sessions.header.tiers.STUDENT,
  };

  const formatBadgeClass =
    FORMAT_COLORS[session.room.format] || FORMAT_COLORS.D2;

  return (
    <section className="relative w-full overflow-hidden bg-background">
      {/* ── Backdrop com poster do filme ──────────────────────────── */}
      {session.movie.posterUrl && (
        <div className="absolute inset-0 z-0">
          <Image
            src={session.movie.posterUrl}
            alt={`Poster de ${session.movie.title}`}
            fill
            priority
            className="object-cover opacity-15 md:opacity-20 scale-110 blur-sm"
            sizes="100vw"
          />
        </div>
      )}

      {/* Gradientes */}
      <div className="absolute inset-0 z-0 bg-gradient-to-r from-background via-background/90 to-background/50" />
      <div className="absolute inset-0 z-0 bg-gradient-to-t from-background via-transparent to-background/60" />

      {/* ── Conteúdo ────────────────────────────────────────────── */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 md:px-8 pt-28 pb-10 md:pt-36 md:pb-16">
        <div className="grid md:grid-cols-[1fr_380px] gap-8 items-end">
          {/* Lado Esquerdo */}
          <div className="flex flex-col gap-5">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-xs text-muted-foreground font-mono">
              <Film className="h-3.5 w-3.5" />
              <Link href={`/${lang}/movies/${session.movie.id}`} className="hover:text-foreground transition-colors cursor-pointer">
                {session.movie.title}
              </Link>
              <span>/</span>
              <span className="text-foreground">{dict.sessions.header.session}</span>
            </div>

            {/* Badge de Formato */}
            <div className="flex flex-wrap items-center gap-2">
              <span
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold border backdrop-blur-md ${formatBadgeClass}`}
              >
                <Monitor className="h-3 w-3" />
                {FORMAT_LABELS[session.room.format] || session.room.format}
              </span>

              {session.type === SessionType.PREMIERE && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold border bg-amber-500/20 text-amber-400 border-amber-500/40">
                  {dict.sessions.header.pre_premiere}
                </span>
              )}

              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold border bg-card/60 text-muted-foreground border-border/60">
                {tierLabels[session.tier] || session.tier}
              </span>
            </div>

            {/* Título + Data */}
            <div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-display font-black leading-tight tracking-tight text-foreground drop-shadow-sm">
                {session.movie.title}
              </h1>
              <p className="mt-2 text-lg sm:text-xl font-semibold text-muted-foreground">
                {startDate.toLocaleDateString(lang === "en" ? "en-US" : "pt-PT", {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </p>
            </div>

            {/* Horário e Duração */}
            <div className="flex flex-wrap items-center gap-6 text-sm">
              <div className="flex flex-col">
                <span className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground mb-0.5">
                  {dict.sessions.header.start}
                </span>
                <span className="text-xl font-bold font-mono text-foreground">
                  {startDate.toLocaleTimeString(lang === "en" ? "en-US" : "pt-PT", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
              <div className="w-px h-8 bg-border/60" />
              <div className="flex flex-col">
                <span className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground mb-0.5">
                  {dict.sessions.header.end}
                </span>
                <span className="text-xl font-bold font-mono text-foreground">
                  {endDate.toLocaleTimeString(lang === "en" ? "en-US" : "pt-PT", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
              <div className="w-px h-8 bg-border/60" />
              <div className="flex flex-col">
                <span className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground mb-0.5">
                  {dict.sessions.header.duration}
                </span>
                <span className="text-xl font-bold font-mono text-foreground">
                  {session.movie.durationMin} min
                </span>
              </div>
            </div>

            {/* Sala e Localização */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              {locationDetails ? (
                <a 
                  href={`https://www.google.com/maps/search/?api=1&query=${locationDetails.latitude},${locationDetails.longitude}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 hover:text-foreground transition-colors group"
                >
                  <MapPin className="h-3.5 w-3.5 text-primary group-hover:scale-110 transition-transform" />
                  <span className="underline underline-offset-4 decoration-primary/30 group-hover:decoration-primary/80 transition-colors">
                    {session.room.location.name}, {session.room.location.city}
                  </span>
                  <ExternalLink className="h-3 w-3 opacity-50 group-hover:opacity-100 transition-opacity" />
                </a>
              ) : (
                <span className="flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5 text-primary" />
                  {session.room.location.name}, {session.room.location.city}
                </span>
              )}
              <span className="w-1 h-1 rounded-full bg-border" />
              <span className="flex items-center gap-1.5">
                <Armchair className="h-3.5 w-3.5" />
                {session.room.name}
              </span>
              <span className="w-1 h-1 rounded-full bg-border" />
              <span className="flex items-center gap-1.5">
                <Users className="h-3.5 w-3.5" />
                {session.room.capacity} {dict.sessions.header.seats_count}
              </span>
            </div>

            {/* Preço + CTA */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              {/* Preço */}
              <div className="flex flex-col">
                <span className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
                  {dict.sessions.header.ticket_price}
                </span>
                <span className="text-2xl font-black font-mono text-foreground">
                  {formatPrice(session.price)}
                </span>
              </div>

              {/* Botões Principais */}
              {!isStarted && isSaleOpen && (
                <div className="flex flex-wrap gap-3">
                  {/* Comprar Bilhete → página de assentos */}
                  <Link
                    href={`/${lang}/sessions/${session.id}/seats`}
                    className="inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3 text-sm font-bold text-primary-foreground shadow-lg shadow-primary/30 transition-all duration-200 hover:brightness-110 hover:scale-[1.03] active:scale-95"
                  >
                    <Ticket className="h-4 w-4" />
                    {dict.sessions.header.buy_ticket}
                  </Link>

                  {/* Choose Seats */}
                  <Link
                    href={`/${lang}/sessions/${session.id}/seats`}
                    className="inline-flex items-center gap-2 rounded-full border border-border/80 bg-card/60 backdrop-blur-md px-6 py-3 text-sm font-semibold text-foreground transition-all duration-200 hover:border-foreground/40 hover:bg-card hover:scale-[1.02] active:scale-95"
                  >
                    <Shuffle className="h-4 w-4" />
                    {dict.sessions.header.choose_seats}
                  </Link>
                </div>
              )}

              {!isSaleOpen && (
                <div className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-card/60 px-6 py-3 text-sm font-semibold text-muted-foreground">
                  {dict.sessions.header.sale_opens}{" "}
                  {saleOpens.toLocaleDateString(lang === "en" ? "en-US" : "pt-PT", {
                    day: "numeric",
                    month: "short",
                  })}
                </div>
              )}

              {isStarted && (
                <div className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-card/60 px-6 py-3 text-sm font-semibold text-muted-foreground">
                  {dict.sessions.header.session_started}
                </div>
              )}
            </div>
          </div>

          {/* Lado Direito: Poster do Filme */}
          <div className="hidden md:block relative aspect-[2/3] w-full max-w-[280px] ml-auto rounded-2xl overflow-hidden shadow-2xl border border-border/40 group">
            <Image
              src={session.movie.posterUrl}
              alt={`Poster de ${session.movie.title}`}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="280px"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/70 via-transparent to-transparent opacity-60" />
          </div>
        </div>
      </div>

      {/* Divisor */}
      <div className="absolute bottom-0 left-0 right-0 h-3 dot-divider opacity-20 z-20" />
    </section>
  );
}

