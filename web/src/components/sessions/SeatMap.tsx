"use client";

import { useMemo, useState, useRef } from "react";
import { Armchair, ChevronLeft, Ticket, Info, RefreshCw, AlertTriangle } from "lucide-react";
import { ApiSessionDetail, SessionSeat } from "@/lib/features/sessions";
import { motion, AnimatePresence } from "framer-motion";
import { CheckoutModal } from "./CheckoutModal";
import { formatPrice } from "@/lib/utils";

import { useParams } from "next/navigation";
import { getDictionary } from "@/app/lib/dictionaries";

interface SeatMapProps {
  session: ApiSessionDetail;
  onConfirm?: (selectedSeats: SessionSeat[]) => void;
  lang?: string;
}

export function SeatMap({ session, onConfirm, lang: propLang }: SeatMapProps) {
  const params = useParams();
  const lang = propLang || (params?.lang as string) || "pt";
  const dict = getDictionary(lang);

  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [ticketQuantity, setTicketQuantity] = useState<number>(1);
  const [isCheckoutOpen, setCheckoutOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Group seats by row
  const rows = useMemo(() => {
    const rowMap = new Map<string, SessionSeat[]>();
    session.seats.forEach(seat => {
      if (!rowMap.has(seat.row)) rowMap.set(seat.row, []);
      rowMap.get(seat.row)!.push(seat);
    });
    const sortedRows = Array.from(rowMap.keys()).sort();
    return sortedRows.map(row => ({
      row,
      seats: rowMap.get(row)!.sort((a, b) => a.number - b.number)
    }));
  }, [session.seats]);

  const handleSeatClick = (seat: SessionSeat) => {
    if (seat.status !== "AVAILABLE") return;
    
    const newSelected = new Set(selected);
    
    if (newSelected.has(seat.id)) {
      newSelected.delete(seat.id);
    } else {
      if (ticketQuantity === 1) {
        newSelected.clear();
        newSelected.add(seat.id);
      } else if (newSelected.size >= ticketQuantity) {
        const firstSelected = Array.from(newSelected)[0];
        newSelected.delete(firstSelected);
        newSelected.add(seat.id);
      } else {
        newSelected.add(seat.id);
      }
    }
    setSelected(newSelected);
  };

  const clearSelection = () => setSelected(new Set());

  const getSeatStyles = (seat: SessionSeat) => {
    if (selected.has(seat.id))
      return "text-primary fill-primary drop-shadow-[0_0_10px_rgba(var(--primary),0.9)] scale-110 z-10";
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

  const selectedSeats = useMemo(
    () => session.seats.filter(s => selected.has(s.id)),
    [selected, session.seats]
  );

  const totalPrice = selected.size * session.price;
  const allSelected = selected.size === ticketQuantity;
  const canProceed = selected.size > 0;

  return (
    <>
      <div className="relative w-full h-[calc(100vh-64px)] min-h-[650px] overflow-hidden bg-background select-none">

        {/* ── SUBTLE BACKGROUND GRID ── */}
        <div 
          className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none"
          style={{ backgroundImage: "radial-gradient(circle, currentColor 1px, transparent 1px)", backgroundSize: "32px 32px" }} 
        />

        {/* ── TOP BANNER: SIMULATION / MVP WARNING ── */}
        <div className="relative z-30 bg-amber-500/10 border-b border-amber-500/20 text-amber-600 dark:text-amber-400 text-xs px-4 py-1.5 flex items-center justify-center gap-2 font-medium text-center">
          <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
          <span>
            <strong>{dict.sessions.seat_map.mvp_warning_title}</strong> {dict.sessions.seat_map.mvp_warning_desc}
          </span>
        </div>

        {/* ── TOP NAV BAR ── */}
        <div className="relative z-20 flex items-center justify-between px-4 py-2.5 bg-background/80 backdrop-blur-md border-b border-border/50">
          <button
            onClick={() => window.history.back()}
            className="flex items-center gap-2 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors group"
          >
            <span className="flex items-center justify-center w-7 h-7 rounded-full bg-card border border-border group-hover:border-foreground/30 transition-colors">
              <ChevronLeft className="w-4 h-4" />
            </span>
            <span className="hidden sm:inline">{dict.sessions.seat_map.back}</span>
          </button>

          <div className="flex flex-col items-center text-center">
            <span className="font-bold text-sm leading-tight truncate max-w-[160px] sm:max-w-xs">
              {session.movie.title}
            </span>
            <span className="text-[11px] text-muted-foreground">
              {session.room.name} &middot;{" "}
              {new Date(session.startTime).toLocaleTimeString(lang === "en" ? "en-US" : "pt-PT", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono text-muted-foreground bg-card border border-border/80 px-2.5 py-1 rounded-full hidden sm:flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block animate-pulse" />
              {session.seats.filter(s => s.status === "AVAILABLE").length} {dict.sessions.seat_map.seats_free}
            </span>
          </div>
        </div>

        {/* ── MAP CANVAS (DRAGGABLE) ── */}
        <div
          ref={containerRef}
          className="absolute inset-0 z-0 touch-none overflow-hidden"
          style={{ top: "90px", bottom: "130px" }}
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
            {/* Screen Arc */}
            <div className="text-center mb-10 pointer-events-none">
              <div className="w-72 sm:w-[420px] mx-auto h-2.5 bg-gradient-to-b from-primary/80 via-primary/30 to-transparent rounded-t-[100%] shadow-[0_10px_35px_rgba(var(--primary),0.4)]" />
              <span className="text-[9px] font-mono tracking-[0.4em] uppercase text-muted-foreground/60 mt-2 block">
                {dict.sessions.seat_map.screen}
              </span>
            </div>

            {/* Seats Grid */}
            <div className="flex flex-col gap-2.5 pointer-events-auto" role="grid" aria-label="Mapa de Lugares">
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
                    {row.seats.map(seat => {
                      const isSelected = selected.has(seat.id);
                      return (
                        <button
                          key={seat.id}
                          onClick={e => {
                            e.stopPropagation();
                            handleSeatClick(seat);
                          }}
                          disabled={seat.status !== "AVAILABLE"}
                          aria-label={`Fila ${seat.row}, Lugar ${seat.number}. Status: ${seat.status}`}
                          aria-selected={isSelected}
                          className={`p-1 transition-all duration-150 touch-manipulation rounded focus:outline-none focus:ring-2 focus:ring-primary/50 ${getSeatStyles(seat)}`}
                          title={`Fila ${seat.row} — Lugar ${seat.number} (${formatPrice(session.price)})`}
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

        {/* ── LEGEND & HELPER (Floating) ── */}
        <div className="absolute z-10 right-4 top-[105px] pointer-events-none flex flex-col gap-2">
          <div className="hidden md:flex flex-col gap-1.5 bg-card/90 backdrop-blur-md border border-border/60 rounded-xl px-3 py-2.5 shadow-lg pointer-events-auto">
            <p className="text-[9px] font-mono uppercase tracking-widest text-muted-foreground/60 mb-1">{dict.sessions.seat_map.legend_title}</p>
            {[
              { color: "text-muted-foreground/50", label: dict.sessions.seat_map.available },
              { color: "text-primary fill-primary", label: dict.sessions.seat_map.selected, fill: true },
              { color: "text-amber-500/40", label: dict.sessions.seat_map.reserved },
              { color: "text-muted-foreground/20", label: dict.sessions.seat_map.occupied },
            ].map(({ color, label, fill }) => (
              <div key={label} className="flex items-center gap-2">
                <Armchair className={`w-3.5 h-3.5 ${color} ${fill ? "fill-primary" : ""}`} />
                <span className="text-[11px] text-muted-foreground">{label}</span>
              </div>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-1.5 bg-card/80 backdrop-blur-md border border-border/50 rounded-lg px-2.5 py-1.5 shadow pointer-events-none">
            <Info className="w-3 h-3 text-muted-foreground/60 shrink-0" />
            <span className="text-[10px] text-muted-foreground/60">{dict.sessions.seat_map.drag_helper}</span>
          </div>
        </div>

        {/* ── BOTTOM ACTION BAR ── */}
        <div className="absolute bottom-0 left-0 right-0 z-20 bg-background/95 backdrop-blur-md border-t border-border/60 shadow-2xl">
          <div className="max-w-4xl mx-auto px-4 py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">

            {/* Left Section: Ticket Counter & Reset */}
            <div className="flex items-center justify-between sm:justify-start gap-3">
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground font-medium">{dict.sessions.seat_map.qty}</span>
                <div className="flex items-center gap-1 bg-card border border-border/80 rounded-full p-0.5">
                  <button
                    onClick={() => {
                      const newQty = Math.max(1, ticketQuantity - 1);
                      setTicketQuantity(newQty);
                      if (selected.size > newQty) {
                        setSelected(new Set(Array.from(selected).slice(0, newQty)));
                      }
                    }}
                    className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold hover:bg-accent transition-colors active:scale-90"
                    title="Diminuir lugares"
                  >
                    −
                  </button>
                  <span className="font-bold text-xs min-w-[1.2rem] text-center tabular-nums">
                    {ticketQuantity}
                  </span>
                  <button
                    onClick={() => {
                      const newQty = Math.min(10, ticketQuantity + 1);
                      setTicketQuantity(newQty);
                    }}
                    className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold hover:bg-accent transition-colors active:scale-90"
                    title="Aumentar lugares"
                  >
                    +
                  </button>
                </div>
              </div>

              {selected.size > 0 && (
                <button
                  onClick={clearSelection}
                  className="text-[11px] text-muted-foreground hover:text-destructive flex items-center gap-1 transition-colors px-2 py-1 rounded-md"
                  title="Limpar seleção"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span className="hidden sm:inline">{dict.sessions.seat_map.clear}</span>
                </button>
              )}
            </div>

            {/* Center Section: Selected Seats Badges */}
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1 min-h-[32px]">
              <AnimatePresence mode="popLayout">
                {selected.size === 0 ? (
                  <motion.p
                    key="empty"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-xs text-muted-foreground/60 italic"
                  >
                    {ticketQuantity === 1
                      ? dict.sessions.seat_map.select_seats_prompt_one
                      : dict.sessions.seat_map.select_seats_prompt_many.replace("{count}", String(ticketQuantity))}
                  </motion.p>
                ) : (
                  Array.from(selected).map(seatId => {
                    const seat = session.seats.find(s => s.id === seatId);
                    return seat ? (
                      <motion.span
                        key={seat.id}
                        layout
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        transition={{ type: "spring", bounce: 0.3, duration: 0.2 }}
                        className="shrink-0 text-xs font-bold bg-primary/15 text-primary border border-primary/30 px-2.5 py-0.5 rounded-full"
                      >
                        {seat.row}{seat.number}
                      </motion.span>
                    ) : null;
                  })
                )}
              </AnimatePresence>
            </div>

            {/* Right Section: Price & Proceed CTA */}
            <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-border/40">
              <div className="flex flex-col items-start sm:items-end">
                <span className="text-[10px] text-muted-foreground/70 uppercase tracking-wider font-mono">
                  {dict.sessions.seat_map.total_simulation}
                </span>
                <span className="font-black text-base font-mono text-foreground leading-none">
                  {formatPrice(totalPrice)}
                </span>
              </div>

              <button
                disabled={!canProceed}
                onClick={() => {
                  if (canProceed) {
                    onConfirm?.(selectedSeats);
                    setCheckoutOpen(true);
                  }
                }}
                className="flex items-center gap-2 bg-primary text-primary-foreground font-bold text-xs sm:text-sm px-5 py-2.5 rounded-full shadow-lg shadow-primary/25 hover:brightness-110 disabled:opacity-40 disabled:cursor-not-allowed transition-all active:scale-95"
              >
                <Ticket className="w-4 h-4" />
                <span>{dict.sessions.seat_map.continue}</span>
                {!allSelected && selected.size > 0 && (
                  <span className="text-[10px] opacity-80 font-normal">
                    ({selected.size}/{ticketQuantity})
                  </span>
                )}
              </button>
            </div>

          </div>
        </div>
      </div>

      <CheckoutModal
        isOpen={isCheckoutOpen}
        onOpenChange={setCheckoutOpen}
        session={session}
        seats={selectedSeats}
        lang={lang}
      />
    </>
  );
}