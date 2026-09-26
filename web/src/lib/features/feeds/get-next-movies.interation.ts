"use server"

import { ApiCursorEnvelope, ApiEnvelope } from "@/lib/api";
import { FeedMovieItem } from "./type";

const BACKEND_URL = process.env.BACKEND_URL;
const version = "v1";

export const getNextMovies = async (cursor: string | null, limit: number) => {
    // Evita passar "null" como texto para a API
    const url = new URL(`${BACKEND_URL}/${version}/movies`);
    url.searchParams.append("limit", limit.toString());
    
    console.log(`cursor: ${cursor}, limit: ${limit}`);
    if (cursor) {
        url.searchParams.append("cursor", cursor);
    }

    console.log(`Request URL: ${url.toString()}`);
    const response = await fetch(url.toString());
    
    if (!response.ok) {
        console.error("Failed to fetch movies");
        throw new Error("Failed to fetch movies");
    }
    
    return response.json() as Promise<ApiEnvelope<ApiCursorEnvelope<FeedMovieItem>>>;
}