import { NextResponse } from "next/server";

/**
 * Devolve uma resposta de sucesso com envelope padronizado.
 * Espelha o formato do NestJS (SuccessResponse / SuccessArrayResponse).
 */
export function ok<T>(data: T, status = 200): NextResponse {
  return NextResponse.json(
    { success: true, data, ts: Date.now().toString() },
    { status },
  );
}

/**
 * Devolve uma resposta de erro com envelope padronizado.
 */
export function err(message: string, status = 400): NextResponse {
  return NextResponse.json(
    { success: false, error: message, ts: Date.now().toString() },
    { status },
  );
}

/**
 * Trata erros de forma consistente nos Route Handlers.
 * Devolve 500 para erros inesperados.
 */
export function handleError(error: unknown): NextResponse {
  if (error instanceof Error) {
    // Erros conhecidos: not found
    if (
      error.message.includes("não encontrada") ||
      error.message.includes("não encontrado")
    ) {
      return err(error.message, 404);
    }
    // Erros de validação de negócio
    if (
      error.message.includes("já está inscrito") ||
      error.message.includes("Deve fornecer")
    ) {
      return err(error.message, 409);
    }
    console.error("[API Error]", error.message);
  }
  return err("Erro interno do servidor", 500);
}
