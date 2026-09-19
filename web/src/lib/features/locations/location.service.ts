import { ApiEnvelope } from "@/lib/api";
import { ApiLocation } from "./types";
import { apiFetch } from "@/lib/api/client";

export const locationService = {
  getLocations: async (): Promise<ApiEnvelope<ApiLocation[]>> => {
    try {
      return await apiFetch<ApiEnvelope<ApiLocation[]>>("/locations");
    } catch (error) {
      return {
        success: false,
        data: null as any,
        ts: Date.now().toString(),
      };
    }
  },
};
