"use server";

import { ApiCursorEnvelope, ApiEnvelope } from "@/lib/api";
import { MovieDetails, MovieSession } from "./type";

const BACKEND_URL = process.env.BACKEND_URL;
const version = "v1";

export async function getMovieBySlug(slug: string) {
  const response = await fetch(`${BACKEND_URL}/${version}/movies/slug/${slug}`);
  if (!response.ok) throw new Error("Failed to fetch movie");
  return response.json() as Promise<ApiEnvelope<MovieDetails>>;
}

export async function getMovieSessions(slug: string) {
  const response = await fetch(
    `${BACKEND_URL}/${version}/sessions/movie/${slug}`,
  );
  if (!response.ok) throw new Error("Failed to fetch sessions");
  return response.json() as Promise<
    ApiEnvelope<ApiCursorEnvelope<MovieSession>>
  >;
}

// ✅ REFATORADO
export async function getMovieSessionsByDay(
  slug: string,
  date: string,
  cinemaId?: number,
  limit: number = 10,
  cursor?: string | null,
) {
  // ✅ Constrói URL dinâmicamente
  const url = new URL(
    `${BACKEND_URL}/${version}/sessions/movie/${slug}/${date}`,
  );
  url.searchParams.append("limit", limit.toString());

  if (cursor) {
    url.searchParams.append("cursor", cursor.toString());
  }
  if (cinemaId) {
    url.searchParams.append("cinemaId", cinemaId.toString());
  }

  try {
    const response = await fetch(url.toString());

    if (!response.ok) {
      throw new Error(
        `Failed to fetch sessions: ${response.status} ${response.statusText}`,
      );
    }

    return response.json() as Promise<
      ApiEnvelope<ApiCursorEnvelope<MovieSession>>
    >;
  } catch (error) {
    console.error("Error fetching sessions by day:", error);
    throw error;
  }
}


export async function getMovieSessionsDaysSummary(slug: string) {
  const url = `${BACKEND_URL}/${version}/sessions/movie/${slug}/days-summary`;
  
  try {
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(
        `Failed to fetch days summary: ${response.status} ${response.statusText}`
      );
    }
    
    const data = await response.json();
    
    // ✅ Tipo correto
    return  data as ApiEnvelope<Array<{ date: string; count: number }> >;
  } catch (error) {
    console.error("Error fetching days summary:", error);
    throw error;
  }
}