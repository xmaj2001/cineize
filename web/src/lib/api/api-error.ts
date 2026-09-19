import type { ApiResponseError, ErrorResponse, Fields } from "./types";

/**
 * Erro "de negócio": a API respondeu, só que com success:false
 * (validação falhou, não encontrado, sem permissão, etc). O envelope
 * de erro chegou completo, por isso conseguimos extrair code/fields/path.
 */
export class ApiRequestError extends Error {
  private readonly _code: number;
  private readonly _fields: Fields[];
  private readonly _path: string;
  private readonly _ts: string;

  constructor(response: ApiResponseError<ErrorResponse>) {
    super(response.data.message);
    this.name = "ApiRequestError";
    this._code = response.data.code;
    this._fields = response.data.fields ?? [];
    this._path = response.path;
    this._ts = response.ts;
  }

  get code(): number {
    return this._code;
  }

  get fields(): Fields[] {
    return this._fields;
  }

  get path(): string {
    return this._path;
  }

  get ts(): string {
    return this._ts;
  }

  isNotFoundError(): boolean {
    return this._code === 404;
  }

  isUnauthorizedError(): boolean {
    return this._code === 401;
  }

  isForbiddenError(): boolean {
    return this._code === 403;
  }

  isValidationError(): boolean {
    return this._code === 400 || this._code === 422;
  }

  isServerError(): boolean {
    return this._code >= 500;
  }
}

/**
 * Erro "de transporte": o pedido nem chegou a ter uma resposta da API
 * no formato esperado (rede caiu, timeout, API offline, JSON inválido).
 * Nunca confundir com ApiRequestError — aqui não há envelope nenhum
 * para ler, é falha de comunicação.
 */
export class ApiNetworkError extends Error {
  readonly code = 503;

  constructor(message: string) {
    super(message);
    this.name = "ApiNetworkError";
  }
}
