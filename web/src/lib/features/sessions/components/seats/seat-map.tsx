"use client";

import { useMemo, useRef } from "react";
import { Armchair, Info } from "lucide-react";
import { motion } from "framer-motion";
import { SessionSeat } from "../../types";

interface SeatMapProps {
  seats: SessionSeat[];
  selectedSeats: SessionSeat[];
  onToggleSeat: (seat: SessionSeat) => void;
  price?: number;
  dict?: any;
}

export function SeatMap({
  seats,
  selectedSeats,
  onToggleSeat,
  price,
  dict,
}: SeatMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  // Set de IDs selecionados para busca O(1) rápida na renderização
  const selectedSeatIds = useMemo(
    () => new Set(selectedSeats.map((s) => s.id)),
    [selectedSeats]
  );

  // Agrupa os assentos por fileira/linha e ordena
  const rows = useMemo(() => {
    const rowMap = new Map<string, SessionSeat[]>();
    seats.forEach((seat) => {
      if (!rowMap.has(seat.row)) rowMap.set(seat.row, []);
      rowMap.get(seat.row)!.push(seat);
    });

    const sortedRows = Array.from(rowMap.keys()).sort();
    return sortedRows.map((row) => ({
      row,
      seats: rowMap.get(row)!.sort((a, b) => a.number - b.number),
    }));
  }, [seats]);

  const getSeatStyles = (seat: SessionSeat, isSelected: boolean) => {
    if (isSelected) {
      return "text-primary fill-primary drop-shadow-[0_0_10px_rgba(var(--primary),0.9)] scale-110 z-10";
    }
    switch (seat.status) {
      case "AVAILABLE":
        return "text-muted-foreground/50 hover:text-primary hover:scale-115 cursor-pointer active:scale-95";
      case "RESERVED":
        return "text-amber-500/40 cursor-not-allowed opacity-60";
      case "SOLD":
        return "text-muted-foreground/20 cursor-not-allowed opacity-40";
      default:
        return "text-muted-foreground/30";
    }
  };

  return (
    <div className="relative w-full h-[600px] min-h-[450px] overflow-hidden select-none">
      {/* Grid sutil de fundo */}
      <div
        className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(circle, currentColor 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />

      {/* Helper visual / Legenda flutuante */}
      <div className="absolute z-10 right-4 top-4 pointer-events-none flex flex-col gap-2">
        <div className="hidden md:flex flex-col gap-1.5 bg-card/90 backdrop-blur-md border border-border/60 rounded-xl px-3 py-2.5 shadow-lg pointer-events-auto">
          <p className="text-[9px] font-mono uppercase tracking-widest text-muted-foreground/60 mb-1">
            {dict?.legend_title || "Legenda"}
          </p>
          {[
            {
              color: "text-muted-foreground/50",
              label: dict?.available || "Disponível",
            },
            {
              color: "text-primary fill-primary",
              label: dict?.selected || "Selecionado",
              fill: true,
            },
            {
              color: "text-amber-500/40",
              label: dict?.reserved || "Reservado",
            },
            {
              color: "text-muted-foreground/20",
              label: dict?.occupied || "Ocupado",
            },
          ].map(({ color, label, fill }) => (
            <div key={label} className="flex items-center gap-2">
              <Armchair
                className={`w-3.5 h-3.5 ${color} ${fill ? "fill-primary" : ""}`}
              />
              <span className="text-[11px] text-muted-foreground">
                {label}
              </span>
            </div>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-1.5 bg-card/80 backdrop-blur-md border border-border/50 rounded-lg px-2.5 py-1.5 shadow pointer-events-none">
          <Info className="w-3 h-3 text-muted-foreground/60 shrink-0" />
          <span className="text-[10px] text-muted-foreground/60">
            {dict?.drag_helper || "Arraste para navegar no mapa"}
          </span>
        </div>
      </div>

      {/* ÁREA INTERATIVA DO MAPA (CANVAS PAN/DRAG COM FRAMER-MOTION) */}
      <div
        ref={containerRef}
        className="absolute inset-0 z-0 touch-none overflow-hidden"
      >
        <motion.div
          drag
          dragConstraints={containerRef}
          dragElastic={0.1}
          dragTransition={{ bounceStiffness: 400, bounceDamping: 30 }}
          className="w-full h-full flex flex-col items-center justify-center min-w-[650px] min-h-[450px] cursor-grab active:cursor-grabbing"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          {/* Arco da Tela / Ecrã */}
          <div className="text-center mb-10 pointer-events-none">
            <div className="w-72 sm:w-[420px] mx-auto h-2.5 bg-gradient-to-b from-primary/80 via-primary/30 to-transparent rounded-t-[100%] shadow-[0_10px_35px_rgba(var(--primary),0.4)]" />
            <span className="text-[9px] font-mono tracking-[0.4em] uppercase text-muted-foreground/60 mt-2 block">
              {dict?.screen || "ECRÃ / TELA"}
            </span>
          </div>

          {/* Grid de Lugares */}
          <div
            className="flex flex-col gap-2.5 pointer-events-auto"
            role="grid"
            aria-label="Mapa de Lugares"
          >
            {rows.map((row, rowIdx) => (
              <motion.div
                key={row.row}
                className="flex items-center gap-2.5"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: rowIdx * 0.03, duration: 0.2 }}
              >
                <span className="w-4 text-center text-[10px] font-bold text-muted-foreground/50 font-mono">
                  {row.row}
                </span>

                <div className="flex gap-1.5">
                  {row.seats.map((seat) => {
                    const isSelected = selectedSeatIds.has(seat.id);
                    const isAvailable = seat.status === "AVAILABLE";

                    return (
                      <button
                        key={seat.id}
                        onClick={(e) => {
                          e.stopPropagation();
                          if (isAvailable) {
                            onToggleSeat(seat);
                          }
                        }}
                        disabled={!isAvailable}
                        aria-label={`Fila ${seat.row}, Lugar ${seat.number}. Status: ${seat.status}`}
                        aria-selected={isSelected}
                        className={`p-1 transition-all duration-150 touch-manipulation rounded focus:outline-none focus:ring-2 focus:ring-primary/50 ${getSeatStyles(
                          seat,
                          isSelected
                        )}`}
                        title={`Fila ${seat.row} — Lugar ${seat.number}${
                          price ? ` (${price} Kz)` : ""
                        }`}
                      >
                        <Armchair className="w-6 h-6 sm:w-7 sm:h-7 transition-transform duration-150" />
                      </button>
                    );
                  })}
                </div>

                <span className="w-4 text-center text-[10px] font-bold text-muted-foreground/50 font-mono">
                  {row.row}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}