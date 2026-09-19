import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

// ─── SUCCESS ─────────────────────────────────────────────────────────────────

export function SuccessResponse<T>(DataClass: new () => T) {
  class SuccessEnvelope {
    @ApiProperty({ example: true })
    success: boolean;

    @ApiProperty({ type: () => DataClass })
    data: T;

    @ApiProperty({ example: "2026-03-17T10:00:00.000Z" })
    ts: string;
  }

  // nome único por tipo → "ServiceResponse", "UserResponse", etc.
  Object.defineProperty(SuccessEnvelope, "name", {
    value: `${DataClass.name}Response`,
  });

  return SuccessEnvelope;
}

export function SuccessArrayResponse<T>(DataClass: new () => T) {
  class SuccessArrayEnvelope {
    @ApiProperty({ example: true })
    success: boolean;

    @ApiProperty({ type: () => [DataClass] })
    items: T[];

    @ApiProperty({ example: "2026-03-17T10:00:00.000Z" })
    ts: string;
  }

  Object.defineProperty(SuccessArrayEnvelope, "name", {
    value: `${DataClass.name}ArrayResponse`,
  });

  return SuccessArrayEnvelope;
}

export function PaginatedResponse<T>(DataClass: new () => T) {
  class PaginatedEnvelope {
    @ApiProperty({ example: true })
    success: boolean;

    @ApiProperty({ type: () => [DataClass] })
    items: T[];

    @ApiProperty({
      example: { total: 100, page: 1, limit: 10, totalPages: 10 },
    })
    meta: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };

    @ApiProperty({ example: "2026-03-17T10:00:00.000Z" })
    ts: string;
  }

  Object.defineProperty(PaginatedEnvelope, "name", {
    value: `${DataClass.name}PaginatedResponse`,
  });

  return PaginatedEnvelope;
}

export function CursorPaginatedResponse<T>(DataClass: new () => T) {
  class CursorPaginatedEnvelope {
    @ApiProperty({ example: true })
    success: boolean;

    @ApiProperty({ type: () => [DataClass] })
    items: T[];

    @ApiPropertyOptional({ example: "cm0x1..." })
    nextCursor?: string;

    @ApiProperty({ example: "2026-03-17T10:00:00.000Z" })
    ts: string;
  }

  Object.defineProperty(CursorPaginatedEnvelope, "name", {
    value: `${DataClass.name}CursorPaginatedResponse`,
  });

  return CursorPaginatedEnvelope;
}

// ─── ERROR DETAIL ─────────────────────────────────────────────────────────────

export class ErrorDetailDto {
  @ApiProperty({ example: 422 })
  code: number;

  @ApiProperty({ example: "Erro de validação" })
  message: string;

  @ApiProperty({
    example: ["Email inválido", "Senha fraca", "Telefone inválido"],
  })
  detail: string[];
}

// ─── ERRORS ──────────────────────────────────────────────────────────────────

export class ErrorResponse {
  @ApiProperty({ example: false })
  success: boolean;

  @ApiProperty({ type: () => ErrorDetailDto })
  data: ErrorDetailDto;

  @ApiProperty({ example: "2026-03-17T10:00:00.000Z" })
  ts: string;

  @ApiProperty({ example: "/auth/sign-up" })
  path: string;
}

export class BadRequestResponse extends ErrorResponse {
  @ApiProperty({
    example: { code: 400, message: "Pedido inválido" },
    type: () => ErrorDetailDto,
  })
  declare data: ErrorDetailDto;
}

export class UnauthorizedResponse extends ErrorResponse {
  @ApiProperty({
    example: { code: 401, message: "Não autorizado" },
    type: () => ErrorDetailDto,
  })
  declare data: ErrorDetailDto;
}

export class ForbiddenResponse extends ErrorResponse {
  @ApiProperty({
    example: { code: 403, message: "Sem permissão para esta ação" },
    type: () => ErrorDetailDto,
  })
  declare data: ErrorDetailDto;
}

export class NotFoundResponse extends ErrorResponse {
  @ApiProperty({
    example: { code: 404, message: "Recurso não encontrado" },
    type: () => ErrorDetailDto,
  })
  declare data: ErrorDetailDto;
}

export class ValidationErrorResponse extends ErrorResponse {
  @ApiProperty({
    example: {
      code: 422,
      message: "Erro de validação",
    },
    type: () => ErrorDetailDto,
  })
  declare data: ErrorDetailDto;
}

export class ConflictResponse extends ErrorResponse {
  @ApiProperty({
    example: { code: 409, message: "Recurso já existe" },
    type: () => ErrorDetailDto,
  })
  declare data: ErrorDetailDto;
}

export class RateLimitResponse extends ErrorResponse {
  @ApiProperty({
    example: {
      code: 429,
      message: "Demasiadas tentativas, tenta novamente mais tarde",
    },
    type: () => ErrorDetailDto,
  })
  declare data: ErrorDetailDto;
}

export class InternalErrorResponse extends ErrorResponse {
  @ApiProperty({
    example: { code: 500, message: "Erro interno do servidor" },
    type: () => ErrorDetailDto,
  })
  declare data: ErrorDetailDto;
}
