import { z } from "zod";

/**
 * Espelha o ListMoviesDto do NestJS backend.
 * Usado nos handlers GET /api/movies e GET /api/movies/home.
 */
export const listMoviesSchema = z.object({
  locationId: z.string().uuid("locationId inválido").optional(),
  search: z.string().max(200).optional(),
  status: z.enum(["nowShowing", "presale", "comingSoon"]).optional(),
  cursor: z.string().optional(),
  limit: z.coerce.number().min(1).max(100).default(20),
});

export type ListMoviesInput = z.infer<typeof listMoviesSchema>;

/**
 * Schema para o query param ?locationId= usado em GET /api/movies/home
 * e GET /api/movies/:id.
 */
export const locationQuerySchema = z.object({
  locationId: z.string().uuid("locationId inválido").optional(),
});

export type LocationQueryInput = z.infer<typeof locationQuerySchema>;
