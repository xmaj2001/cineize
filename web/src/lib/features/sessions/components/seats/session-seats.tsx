"use client";

import { useEffect, useState, useTransition } from "react";
import { Dialog } from "@base-ui/react";
import { MovieSessionDetail, SessionSeat } from "../../types";
import { getSeatSession } from "../../queries";
import { Loader2, X, Armchair } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { useSessionSeatsSSE } from "../../hooks/use-session-seats-sse";
import { SeatMap } from "./seat-map";

interface SeatsModalProps {
  session: MovieSessionDetail;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (seats: SessionSeat[]) => void;
}

export function SeatsModal({
  session,
  open,
  onOpenChange,
  onConfirm,
}: SeatsModalProps) {
  const [isPending, startTransition] = useTransition();
  const [initialSeats, setInitialSeats] = useState<SessionSeat[]>([]);
  const [selectedSeats, setSelectedSeats] = useState<SessionSeat[]>([]);

  // Hook SSE para escutar atualizações em tempo real quando o modal está aberto
  const { seats } = useSessionSeatsSSE(session.id, initialSeats);

  // Carrega a matriz de lugares via Server Action quando o modal abre
  useEffect(() => {
    if (open && initialSeats.length === 0) {
      startTransition(async () => {
        try {
          const res = await getSeatSession(session.id);
          if (res.success && res.data) {
            // Se o retorno for um array de lugares
            setInitialSeats(Array.isArray(res.data) ? res.data : [res.data]);
          }
        } catch (error) {
          console.error("Falha ao carregar assentos:", error);
        }
      });
    }
  }, [open, session.id, initialSeats.length]);

  const toggleSeat = (seat: SessionSeat) => {
    setSelectedSeats((prev) =>
      prev.some((s) => s.id === seat.id)
        ? prev.filter((s) => s.id !== seat.id)
        : [...prev, seat]
    );
  };

  const totalPrice = selectedSeats.length * Number(session.price);

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Backdrop className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm transition-opacity" />
        <Dialog.Popup className="fixed left-1/2 top-1/2 z-50 max-h-[90vh] w-screen -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-xl border border-border bg-background p-6 shadow-2xl sm:p-8">
          
          {/* Cabeçalho do Modal */}
          <div className="mb-6 flex items-start justify-between gap-4 border-b border-border/40 pb-4">
            <div>
              <Dialog.Title className="text-xl font-bold font-display">
                Escolha os seus lugares
              </Dialog.Title>
              <Dialog.Description className="mt-1 text-sm text-muted-foreground font-mono">
                {session.movie.title} · Sala {session.room}
              </Dialog.Description>
            </div>
            <Dialog.Close
              className="rounded-full p-2 text-muted-foreground hover:bg-muted transition-colors"
              aria-label="Fechar"
            >
              <X className="h-5 w-5" />
            </Dialog.Close>
          </div>

          {/* Conteúdo: Loading State x SeatMap */}
          {isPending ? (
            <div className="flex flex-col items-center justify-center py-16 gap-3 text-muted-foreground">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="text-xs font-mono">A carregar mapa de lugares...</span>
            </div>
          ) : (
            <SeatMap
              seats={seats}
              selectedSeats={selectedSeats}
              onToggleSeat={toggleSeat}
            />
          )}

          {/* Rodapé de Confirmação */}
          <div className="mt-8 flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-border/60">
            <div className="flex flex-col">
              <span className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
                Total ({selectedSeats.length} {selectedSeats.length === 1 ? "lugar" : "lugares"})
              </span>
              <span className="text-2xl font-black font-mono text-primary">
                {formatPrice(totalPrice)}
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

        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
}