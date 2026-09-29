"use client";

import { useState } from "react";
import { Armchair } from "lucide-react";
import { MovieSessionDetail, SessionSeat } from "../../types";
import { SeatsModal } from "../seats/session-seats";

interface SessionBookingActionProps {
  session: MovieSessionDetail;
  label: string;
}

export function SessionBookingAction({
  session,
  label,
}: SessionBookingActionProps) {
  const [open, setOpen] = useState(false);
  const [selectedSeats, setSelectedSeats] = useState<SessionSeat[]>([]);

  const handleConfirmSeats = (seats: SessionSeat[]) => {
    setSelectedSeats(seats);
    setOpen(false);
    // Aqui podes redirecionar para o Checkout ou disparar a reserva
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-7 py-3.5 text-xs font-mono font-bold uppercase tracking-wider text-primary-foreground shadow-lg shadow-primary/25 transition-all duration-200 hover:brightness-110 hover:scale-[1.02] active:scale-95 cursor-pointer"
      >
        <Armchair className="h-4 w-4" />
        <span>
          {selectedSeats.length
            ? `Comprar bilhetes (${selectedSeats.length})`
            : "Escolher assentos"}
        </span>
      </button>

      {/* <SeatsModal
        session={session}
        open={open}
        onOpenChange={setOpen}
        onConfirm={handleConfirmSeats}
      /> */}
    </>
  );
}
