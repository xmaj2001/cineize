import {
  UnprocessableEntityException,
  ValidationError,
  ValidationPipe,
  ValidationPipeOptions,
} from '@nestjs/common';

function flattenErrors(
  errors: ValidationError[],
  parentField = '',
): { field: string; messages: string[] }[] {
  const result: { field: string; messages: string[] }[] = [];

  for (const error of errors) {
    const field = parentField
      ? `${parentField}.${error.property}`
      : error.property;

    if (error.constraints) {
      result.push({
        field,
        messages: Object.values(error.constraints),
      });
    }

    if (error.children?.length) {
      result.push(...flattenErrors(error.children, field));
    }
  }

  return result;
}

export class AppValidationPipe extends ValidationPipe {
  constructor(options: ValidationPipeOptions = {}, isProd: boolean = false) {
    super({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
      errorHttpStatusCode: 422,
      exceptionFactory: (errors) => {
        const flat = flattenErrors(errors);
        return new UnprocessableEntityException({
          message: 'Erro de validação',
          // dev → fields detalhados, prod → só as mensagens simples
          ...(!isProd
            ? { fields: flat }
            : { details: flat.map((f) => f.messages).flat() }),
        });
      },
      ...options,
    });
  }
}
