"use client";

import { useEffect, useState } from "react";
import { SessionSeat } from "../types";

export function useSessionSeatsSSE(sessionId: string, initialSeats: SessionSeat[]) {
  const [seats, setSeats] = useState<SessionSeat[]>(initialSeats);

  // Sincroniza se os assentos iniciais mudarem
  useEffect(() => {
    setSeats(initialSeats);
  }, [initialSeats]);

  useEffect(() => {
    if (!sessionId) return;

    // URL do endpoint SSE no seu Backend NestJS/Node
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3000";
    const eventSource = new EventSource(`${backendUrl}/v1/sessions/${sessionId}/seats/stream`);

    eventSource.onmessage = (event) => {
      try {
        const payload: { seatId: string; status: SessionSeat["status"] } = JSON.parse(event.data);

        setSeats((prevSeats) =>
          prevSeats.map((seat) =>
            seat.id === payload.seatId ? { ...seat, status: payload.status } : seat
          )
        );
      } catch (err) {
        console.error("Erro ao processar mensagem do SSE:", err);
      }
    };

    eventSource.onerror = (error) => {
      console.error("Erro na conexão SSE de assentos:", error);
      eventSource.close();
    };

    return () => {
      eventSource.close();
    };
  }, [sessionId]);

  return { seats, setSeats };
}