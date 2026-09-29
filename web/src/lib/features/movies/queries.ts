"use server";

import { ApiCursorEnvelope, ApiEnvelope } from "@/lib/api";
import {
  CatalogMovieItem,
  ComingSoonMovieItem,
  FeaturedMovieItem,
  FeedMovieItem,
  MovieDetails,
} from "./type";

const BACKEND_URL = process.env.BACKEND_URL;
const version = "v1";

type CatalogParams = {
  cinema?: string | null; // slug do cinema
  cursor?: string | null;
  limit?: number;
};

// helper interno (sem export)
async function request<T>(
  path: string,
  params: CatalogParams = {},
  revalidate = 60,
): Promise<T> {
  const url = new URL(
    path
      ? `${BACKEND_URL}/${version}/movies/${path}`
      : `${BACKEND_URL}/${version}/movies`,
  );

  if (params.limit) url.searchParams.set("limit", String(params.limit));
  if (params.cursor) url.searchParams.set("cursor", params.cursor);
  if (params.cinema) url.searchParams.set("cinema", params.cinema);

  const response = await fetch(url, { next: { revalidate } });

  if (!response.ok) {
    throw new Error(`Failed to fetch movies/${path} (${response.status})`);
  }
  return response.json() as Promise<T>;
}

export async function getMovieBySlug(slug: string) {
  return request<ApiEnvelope<MovieDetails>>(`slug/${slug}`);
}

// Página "todos os filmes" (mantém o endpoint antigo)
export async function getCursorMovies(
  cursor: string | null = null,
  limit: number = 10,
) {
  return request<ApiEnvelope<ApiCursorEnvelope<FeedMovieItem>>>("", {
    cursor,
    limit,
  });
}

export async function getFeaturedMovies(cinema?: string | null, limit = 5) {
  return request<ApiEnvelope<FeaturedMovieItem[]>>("featured", {
    cinema,
    limit,
  });
}

export async function getNowShowingMovies(params: CatalogParams = {}) {
  return request<ApiEnvelope<ApiCursorEnvelope<FeedMovieItem>>>(
    "now-showing",
    params,
  );
}

export async function getPresaleMovies(params: CatalogParams = {}) {
  return request<ApiEnvelope<ApiCursorEnvelope<FeedMovieItem>>>(
    "presale",
    params,
  );
}

export async function getComingSoonMovies(params: CatalogParams = {}) {
  // em breve não depende de cinema
  return request<ApiEnvelope<ApiCursorEnvelope<FeedMovieItem>>>(
    "coming-soon",
    { cursor: params.cursor, limit: params.limit },
  );
}
