import { Dictionary } from "@/app/lib/dictionaries";
import { FORMAT_MAP, formatPrice } from "@/lib/utils";
import { Film, ChevronRight, Monitor, Calendar, Clock, MapPin, ExternalLink, Armchair, Users, Ticket } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { getSession } from "../../queries";
import { SessionBookingAction } from "./SessionBookingAction";

interface SessionDetailProps {
  lang: string;
  dict: Dictionary;
  sessionId: string;
}

export async function SessionContentDetails({
  lang,
  dict,
  sessionId,
}: SessionDetailProps) {
  const res = await getSession(sessionId);

  if (!res.success || !res.data) {
    return null;
  }

  const session = res.data;
  const {
    movie,
    cinema,
    startTime,
    endTime,
    room,
    seats,
    price,
    format,
    type,
  } = session;

  const startDate = new Date(startTime);
  const endDate = new Date(endTime);

  const formattedDate = startDate.toLocaleDateString(
    lang === "en" ? "en-US" : "pt-PT",
    { weekday: "long", day: "numeric", month: "long", year: "numeric" },
  );

  const startTimeStr = startDate.toLocaleTimeString(
    lang === "en" ? "en-US" : "pt-PT",
    { hour: "2-digit", minute: "2-digit" },
  );

  const endTimeStr = endDate.toLocaleTimeString(
    lang === "en" ? "en-US" : "pt-PT",
    { hour: "2-digit", minute: "2-digit" },
  );

  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${cinema.latitude},${cinema.longitude}`;

  return (
    <header className="relative w-full min-h-[100vh] flex items-center overflow-hidden">
      {/* Backdrop de Fundo com Blur sutil */}
      {movie.backdropUrl && (
        <div className="absolute inset-0 z-0">
          <Image
            src={movie.backdropUrl}
            alt={`Backdrop de ${movie.title}`}
            fill
            priority
            className="object-cover blur-md sm:blur-sm scale-105 opacity-30 transition-transform duration-1000"
            sizes="100vw"
          />
        </div>
      )}

      {/* Máscaras de Gradiente Direcionadas para Leitura Perfeita */}
      <div className="absolute inset-0 z-0 bg-gradient-to-r from-background via-background/20 to-transparent" />
      <div className="absolute inset-0 z-0 bg-gradient-to-t from-background via-background/10 to-transparent" />

      {/* Container Principal */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 md:px-8 w-full grid md:grid-cols-[1fr_260px] lg:grid-cols-[1fr_300px] gap-8 md:gap-12 items-center">
        {/* Lado Esquerdo: Detalhes da Sessão */}
        <div className="flex flex-col gap-6">
          {/* Breadcrumb + Tags */}
          <div className="flex flex-wrap items-center gap-3">
            <nav className="flex items-center gap-1.5 text-xs text-muted-foreground font-mono">
              <Film className="h-3.5 w-3.5 text-primary" />
              <Link
                href={`/${lang}/movies/${movie.slug}`}
                className="hover:text-foreground transition-colors font-medium"
              >
                {movie.title}
              </Link>
              <ChevronRight className="h-3 w-3 opacity-50" />
              <span className="text-foreground font-semibold">
                {dict.sessions?.header?.session || "Sessão"}
              </span>
            </nav>

            <div className="h-3 w-px bg-border/60 hidden sm:block" />

            {/* Badges: Formato da Tela & Pré-venda */}
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-xs font-mono font-bold bg-primary/10 border border-primary/20 text-primary backdrop-blur-md">
                <Monitor className="h-3 w-3" />
                {FORMAT_MAP[format]?.label || format}
              </span>

              {type === "PRE_SALE" && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-mono font-extrabold uppercase bg-amber-500/10 border border-amber-500/30 text-amber-500">
                  Pré-Venda
                </span>
              )}
            </div>
          </div>

          {/* Título do Filme e Data */}
          <div className="space-y-2">
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-display font-black tracking-tight text-foreground drop-shadow-md leading-tight">
              {movie.title}
            </h1>
            <p className="flex items-center gap-2 text-sm sm:text-base font-mono text-muted-foreground capitalize">
              <Calendar className="h-4 w-4 text-primary shrink-0" />
              <span>{formattedDate}</span>
            </p>
          </div>

          {/* Card de Horários e Duração */}
          <div className="inline-flex flex-wrap items-center gap-4 sm:gap-6 p-4 rounded-sm bg-card/10 border border-border/20 backdrop-blur-md shadow-sm w-fit">
            <div className="flex flex-col">
              <span className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
                {dict.sessions?.header?.start || "Início"}
              </span>
              <span className="text-xl sm:text-2xl font-black font-mono text-foreground">
                {startTimeStr}
              </span>
            </div>

            <div className="h-8 w-px bg-border/60" />

            <div className="flex flex-col">
              <span className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
                {dict.sessions?.header?.end || "Fim"}
              </span>
              <span className="text-xl sm:text-2xl font-black font-mono text-foreground">
                {endTimeStr}
              </span>
            </div>

            <div className="h-8 w-px bg-border/60" />

            <div className="flex flex-col">
              <span className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
                {dict.sessions?.header?.duration || "Duração"}
              </span>
              <span className="text-sm sm:text-base font-bold font-mono text-foreground/90 flex items-center gap-1 mt-1">
                <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                {movie.durationMinutes} min
              </span>
            </div>
          </div>

          {/* Localização e Sala */}
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs sm:text-sm text-muted-foreground font-mono">
            <Link
              href={mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 hover:text-foreground transition-colors group"
            >
              <MapPin className="h-4 w-4 text-primary shrink-0 group-hover:scale-110 transition-transform" />
              <span className="underline underline-offset-4 decoration-primary/30 group-hover:decoration-primary/80">
                {cinema.name} — {cinema.address}
              </span>
              <ExternalLink className="h-3 w-3 opacity-60" />
            </Link>

            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5">
                <Armchair className="h-4 w-4 text-muted-foreground" />
                Sala {room}
              </span>

              <span className="flex items-center gap-1.5">
                <Users className="h-4 w-4 text-muted-foreground" />
                {seats.length} {dict.sessions?.header?.seats_count || "lugares"}
              </span>
            </div>
          </div>

          {/* Bloco de Preço & Ação de Compra */}
          <div className="flex flex-wrap items-end gap-6 pt-2">
            <div className="flex flex-col">
              <span className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
                {dict.sessions?.header?.ticket_price || "Preço do Bilhete"}
              </span>
              <span className="text-3xl font-black font-mono text-primary tracking-tight">
                {formatPrice(Number(price))}
              </span>
            </div>

            {/* <div className="flex items-center gap-3">
              <SessionBookingAction
                session={session}
                label={dict.sessions?.header?.buy_ticket || "Comprar Bilhete"}
              />
            </div> */}
          </div>
        </div>

        {/* Lado Direito: Capa do Filme */}
        <div className="hidden md:block relative aspect-[2/3] w-full max-w-[280px] lg:max-w-[300px] justify-self-end rounded-2xl overflow-hidden shadow-2xl border border-border/40 group">
          <Image
            src={movie.posterUrl}
            alt={`Poster de ${movie.title}`}
            fill
            priority
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 1024px) 260px, 300px"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-60" />
        </div>
      </div>
    </header>
  );
}
