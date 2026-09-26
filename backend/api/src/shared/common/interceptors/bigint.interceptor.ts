import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from "@nestjs/common";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";

function serializeBigInt(value: any): any {
  // 1. Converte BigInt diretamente para string
  if (typeof value === "bigint") {
    return value.toString();
  }

  // 2. Valores nulos ou primitivos mantêm-se inalterados
  if (value === null || typeof value !== "object") {
    return value;
  }

  // 3. Preserva instâncias de Date (não altera o comportamento de serialização do JSON)
  if (value instanceof Date) {
    return value;
  }

  // 4. Preserva Buffers (se utilizares streams/ficheiros)
  if (Buffer.isBuffer(value)) {
    return value;
  }

  // 5. Percorre Arrays recursivamente
  if (Array.isArray(value)) {
    return value.map(serializeBigInt);
  }

  // 6. Percorre apenas Objetos Literais / Planos ({})
  // Evita corromper outras instâncias de classes que não sejam objetos normais
  const isPlainObject =
    Object.prototype.toString.call(value) === "[object Object]";

  if (isPlainObject) {
    const result: Record<string, any> = {};
    for (const key of Object.keys(value)) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
      result[key] = serializeBigInt(value[key]);
    }
    return result;
  }

  return value;
}

@Injectable()
export class BigIntInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return next.handle().pipe(map((data) => serializeBigInt(data)));
  }
}
