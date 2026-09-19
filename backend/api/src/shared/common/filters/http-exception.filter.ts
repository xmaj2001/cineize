/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { ERROR_MESSAGES } from './message-error';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  constructor(private readonly isDev: boolean) {}

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const req = ctx.getRequest<Request>();
    const res = ctx.getResponse<Response>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = ERROR_MESSAGES.INTERNAL_ERROR;
    let details: string[] | undefined;
    let fields: { field: string; messages: string[] }[] | undefined;
    let stack: string | undefined;

    if (this.isBetterAuthError(exception)) {
      status = (exception as any).statusCode ?? HttpStatus.BAD_REQUEST;
      message =
        (exception as any).body?.message ?? ERROR_MESSAGES.AUTHENTICATION;
    } else if (exception instanceof HttpException) {
      status = exception.getStatus();
      const raw = exception.getResponse() as any;

      if (typeof raw === 'string') {
        message = raw;
      } else {
        message = raw.message ?? message;
        if (raw.fields) fields = raw.fields;
        if (raw.details) details = raw.details;
      }
    } else if (exception instanceof Error) {
      this.logger.error(`Unhandled: ${exception.message}`, exception.stack);
      if (this.isDev) {
        message = exception.message;
        stack = exception.stack;
      }
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-enum-comparison
    if (status >= 500) {
      this.logger.error(
        `[${req.method}] ${req.url} → ${status}`,
        exception instanceof Error ? exception.stack : String(exception),
      );
    } else {
      this.logger.warn(`[${req.method}] ${req.url} → ${status} — ${message}`);
    }

    const extra: Record<string, unknown> = {};
    if (fields) extra.fields = fields;
    if (details) extra.details = details;
    if (!this.isDev && stack) extra.stack = stack; // nunca — stack só em dev

    res.status(status).json({
      success: false,
      data: { code: status, message, ...extra },
      ts: new Date().toISOString(),
      path: req.url,
    });
  }

  private isBetterAuthError(exception: unknown): boolean {
    return (
      typeof exception === 'object' &&
      exception !== null &&
      'statusCode' in exception &&
      'body' in exception &&
      typeof (exception as any).body?.message === 'string'
    );
  }
}
