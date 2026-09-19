import { apiFetch } from "@/lib/api/client";
import type { ApiSessionDetail } from "./types";
import { ApiEnvelope } from "@/lib/api";

export const sessionService = {
  /**
   * Busca os detalhes completos de uma sessão, incluindo o mapa
   * de assentos com o estado actual de cada um.
   */
  getSessionById: async (id: string): Promise<ApiEnvelope<ApiSessionDetail>> => {
    try {
      return await apiFetch<ApiEnvelope<ApiSessionDetail>>(`sessions/${id}`);
    } catch (error) {
      return {
        success: false,
        data: null as any,
        ts: Date.now().toString(),
      };
    }
  },
};
