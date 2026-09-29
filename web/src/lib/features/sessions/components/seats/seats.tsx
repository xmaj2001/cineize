"use client";

import { useEffect, useState, useTransition } from "react";
import { SessionSeat } from "../../types";
import { getSeatSession } from "../../queries";
import { SeatMap } from "./seat-map";
import { formatPrice } from "@/lib/utils";
import { Armchair } from "lucide-react";
import { useSessionSeatsSSE } from "../../hooks/use-session-seats-sse";

interface SeatsProps {
  sessionId: string;
}

export function Seats({ sessionId }: SeatsProps) {
  const [isPending, startTransition] = useTransition();
  const [initialSeats, setInitialSeats] = useState<SessionSeat[]>([]);
  const [selectedSeats, setSelectedSeats] = useState<SessionSeat[]>([]);

  // TODO: Hook SSE para escutar atualizações em tempo real quando o modal está aberto
  // const { seats } = useSessionSeatsSSE(sessionId, initialSeats);

  // Carrega a matriz de lugares via Server Action quando o modal abre
  useEffect(() => {
    if (initialSeats.length === 0) {
      startTransition(async () => {
        try {
          const res = await getSeatSession(sessionId);
          if (res.success && res.data) {
            // Se o retorno for um array de lugares
            setInitialSeats(Array.isArray(res.data) ? res.data : [res.data]);
          }
        } catch (error) {
          console.error("Falha ao carregar assentos:", error);
        }
      });
    }
  }, [sessionId, initialSeats.length]);

  const toggleSeat = (seat: SessionSeat) => {
    setSelectedSeats((prev) =>
      prev.some((s) => s.id === seat.id)
        ? prev.filter((s) => s.id !== seat.id)
        : [...prev, seat],
    );
  };

  const onConfirm = (seats: SessionSeat[]) => {
    // Lógica para confirmar a seleção dos assentos
  };

    // const totalPrice = selectedSeats.length * Number(session.price);
  return (
    <div>
      <SeatMap
        seats={initialSeats}
        selectedSeats={selectedSeats}
        onToggleSeat={toggleSeat}
      />
      {/* Rodapé de Confirmação */}
      <div className="mt-8 flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-border/60">
        <div className="flex flex-col">
          <span className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
            Total ({selectedSeats.length}{" "}
            {selectedSeats.length === 1 ? "lugar" : "lugares"})
          </span>
          <span className="text-2xl font-black font-mono text-primary">
            {formatPrice(5000)}
          </span>
        </div>

        <button
          type="button"
          disabled={selectedSeats.length === 0}
          onClick={() => onConfirm(selectedSeats)}
          className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-7 py-3 text-xs font-mono font-bold uppercase tracking-wider text-primary-foreground shadow-lg shadow-primary/25 transition-all hover:brightness-110 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          <Armchair className="h-4 w-4" />
          <span>Confirmar Seleção</span>
        </button>
      </div>
    </div>
  );
}
