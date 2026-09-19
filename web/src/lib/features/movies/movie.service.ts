import { apiFetch } from "@/lib/api/client";
import type { ApiMovie, HomeFeed, ApiMovieDetails } from "./types";
import { ApiCursorEnvelope, ApiEnvelope } from "@/lib/api";

export const movieService = {
  getMovies: async (
    params?: Record<string, any>,
  ): Promise<ApiEnvelope<ApiCursorEnvelope<ApiMovie>>> => {
    const searchParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
          searchParams.append(key, String(value));
        }
      });
    }

    const queryString = searchParams.toString();
    const url = queryString ? `movies?${queryString}` : "movies";
    try {
      return await apiFetch<ApiEnvelope<ApiCursorEnvelope<ApiMovie>>>(url);
    } catch (error) {
      return {
        success: false,
        data: { items: [], nextCursor: null },
        ts: Date.now().toString(),
      };
    }
  },

  getHomeFeed: async (): Promise<ApiEnvelope<HomeFeed>> => {
    try {
      return await apiFetch<ApiEnvelope<HomeFeed>>("movies/home");
    } catch (error) {
      return {
        success: false,
        data: { featured: [], nowShowing: [], comingSoon: [], presale: [] },
        ts: Date.now().toString(),
      };
    }
  },

  getMovieById: async (
    id: string,
    params?: Record<string, any>,
  ): Promise<ApiEnvelope<ApiMovieDetails>> => {
    const searchParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
          searchParams.append(key, String(value));
        }
      });
    }

    const queryString = searchParams.toString();
    const url = queryString ? `movies/${id}?${queryString}` : `movies/${id}`;
    try {
      return await apiFetch<ApiEnvelope<ApiMovieDetails>>(url);
    } catch (error) {
      return {
        success: false,
        data: null as any,
        ts: Date.now().toString(),
      };
    }
  },
};
