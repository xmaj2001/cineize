// ============================================================
// Tipos do "envelope" de resposta da API (NestJS)
//
// Todo o backend responde sempre dentro deste envelope — sucesso
// ou erro. É este contrato que permite ao front saber sempre como
// interpretar o payload, sem ter de adivinhar o shape da resposta
// endpoint a endpoint.
// ============================================================

/** Envelope de sucesso: { success: true, data: T, ts } */
export interface ApiEnvelope<T> {
  success: boolean;
  data: T;
  ts: string;
}

/** Envelope de erro: { success: false, data: ErrorResponse, ts, path } */
export interface ApiResponseError<T> {
  success: boolean;
  data: T;
  ts: string;
  path: string;
}

export interface Fields {
  field: string;
  messages: string[];
}

export type ErrorResponse = {
  code: number;
  message: string;
  fields: Fields[];
};

/** Envelope de listagem paginada por cursor */
export interface ApiCursorEnvelope<T> {
  items: T[];
  nextCursor: string | null;
}

/** Envelope de listagem paginada por página/limite */
export interface ApiPaginationEnvelope<T> {
  items: T[];
  page: number;
  limit: number;
  total: number;
}
