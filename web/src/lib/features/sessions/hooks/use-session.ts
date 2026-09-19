"use client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { SESSION_QUERY_KEYS } from "../cache.keys";
import { sessionService } from "../session.service";
import type { SeatUpdateEvent, SessionSeat } from "../types";

/**
 * Hook para carregar os detalhes de uma sessão (com mapa de assentos).
 * Subscreve automaticamente o stream SSE para actualizações em tempo real.
 */
export const useSession = (id: string) => {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: SESSION_QUERY_KEYS.detail(id),
    queryFn: () => sessionService.getSessionById(id),
    enabled: !!id,
  });

  // Subscrever SSE para receber actualizações de assentos em tempo real
  useEffect(() => {
    if (!id) return;

    const API_URL = process.env.NEXT_PUBLIC_URL || "";
    const eventSource = new EventSource(
      `${API_URL}/api/sessions/${id}/seats/events`,
      { withCredentials: true },
    );

    eventSource.onmessage = (event) => {
      const update = JSON.parse(event.data) as SeatUpdateEvent;

      // Actualização optimista no cache do React Query
      queryClient.setQueryData(SESSION_QUERY_KEYS.detail(id), (old: any) => {
        if (!old?.data?.seats) return old;
        return {
          ...old,
          data: {
            ...old.data,
            seats: old.data.seats.map((seat: SessionSeat) =>
              seat.id === update.seatId
                ? { ...seat, status: update.status }
                : seat,
            ),
          },
        };
      });
    };

    eventSource.onerror = () => {
      // Em caso de erro, fechar o stream — o hook não faz retry automático;
      // o componente pode re-montar se necessário.
      eventSource.close();
    };

    return () => {
      eventSource.close();
    };
  }, [id, queryClient]);

  return query;
};
