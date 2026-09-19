import { ApiNetworkError, ApiRequestError } from "./api-error";
import type { ApiResponseError, ErrorResponse } from "./types";

/**
 * Único ponto onde interpretamos o envelope da API. Usado tanto pelo
 * fetch de client como pelo de server, para não duplicar esta lógica
 * (e não correr o risco de um dos dois esquecer de tratar algum caso).
 *
 * - response.ok === false  -> envelope de erro -> ApiRequestError
 * - JSON inválido/ausente  -> falha de transporte -> ApiNetworkError
 * - response.ok === true   -> devolve o envelope já tipado como T
 */
export async function parseApiResponse<T>(
  response: Response,
  context: string,
): Promise<T> {
  let body: unknown;

  try {
    body = await response.json();
  } catch {
    throw new ApiNetworkError(
      `${context}: resposta sem JSON válido (status ${response.status})`,
    );
  }

  if (!response.ok) {
    throw new ApiRequestError(body as ApiResponseError<ErrorResponse>);
  }

  return body as T;
}
