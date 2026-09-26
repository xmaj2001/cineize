import Link from "next/link";
import { MovieSession } from "../../type";
import { MapPin, ArrowUpRight } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { FORMAT_MAP } from "../../util";

interface SessionCardProps {
  session: MovieSession;
  lang: string;
  dict: any;
}

export function SessionCard({ session, lang, dict }: SessionCardProps) {
  const sessionHref = `/sessoes/${session.id}`;
  const isPreEstreia = false; // Pode vir de prop ou lógica do backend
  const startDate = new Date(session.startTime);
  const endDate = new Date(session.endTime);
  const formatInfo = FORMAT_MAP[session.format];

  const locale = lang === "en" ? "en-US" : "pt-PT";

  const startTimeStr = startDate.toLocaleTimeString(locale, {
    hour: "2-digit",
    minute: "2-digit",
  });

  const endTimeStr = endDate.toLocaleTimeString(locale, {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <Link
      href={sessionHref}
      className={`session-card group relative flex flex-col justify-between h-full p-4 transition-all duration-200 ${
        isPreEstreia ? "movie-card-pre-estreia" : ""
      }`}
    >
      {/* 1. TOPO: Cinema e Badge Pré-Estreia */}
      <div className="flex items-start justify-between gap-2 mb-3">
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground min-w-0">
          <MapPin className="h-3.5 w-3.5 shrink-0 text-foreground/60" />
          <span className="font-medium text-foreground truncate">
            {session.cinema.name}
          </span>
        </div>

        {isPreEstreia && (
          <span className="shrink-0 rounded-sm bg-amber-500/10 border border-amber-500/30 px-1.5 py-0.5 text-[9px] font-mono font-bold text-amber-500 uppercase tracking-wider">
            {dict.movies.sessions_list.pre_premiere}
          </span>
        )}
      </div>

      {/* 2. CENTRO (Destaque Principal): Horário de Início + Duração + Formato da Sala */}
      <div className="my-2 flex items-baseline justify-between gap-3">
        <div>
          <div className="flex items-baseline gap-2">
            {/* Hora de início em grande destaque visual */}
            <span className="text-3xl font-display tracking-tight text-foreground group-hover:text-primary transition-colors">
              {startTimeStr}
            </span>
            {/* Hora de fim menor ao lado */}
            <span className="text-xs font-mono text-muted-foreground">
              termina às {endTimeStr}
            </span>
          </div>
        </div>

        {/* Badge do Formato (2D, 3D, IMAX, 4DX) */}
        {formatInfo && (
          <span className="shrink-0 rounded bg-secondary px-2 py-1 text-xs font-mono font-bold text-secondary-foreground border border-border/60">
            {formatInfo.label}
          </span>
        )}
      </div>

      {/* 3. RODAPÉ: Preço + Ação (CTA) */}
      <div className="flex items-center justify-between pt-3 mt-2 border-t border-hairline/40">
        <div className="flex flex-col">
          <span className="text-[10px] uppercase font-mono text-muted-foreground tracking-wider">
            Preço
          </span>
          <span className="text-base font-bold font-mono text-foreground">
            {formatPrice(Number(session.price))}
          </span>
        </div>

        {/* Botão de Ação limpo / Ícone de Link no hover */}
        <div className="inline-flex items-center gap-1 text-xs font-mono font-bold text-foreground group-hover:text-primary transition-colors">
          <span>{dict.movies.sessions_list.view_session}</span>
          <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </div>
      </div>
    </Link>
  );
}