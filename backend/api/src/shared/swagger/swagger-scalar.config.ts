import { apiReference } from '@scalar/nestjs-api-reference';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export const setupSwaggerScalar = (
  app: NestExpressApplication,
  name: string,
  isProd: boolean,
) => {
  if (!isProd) {
    const swaggerCfg = new DocumentBuilder()
      .setTitle(name)
      .setDescription('Backend API')
      .setVersion('1.0.0')
      .addBearerAuth(
        {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Insere o teu JWT token aqui',
          name: 'Authorization',
          in: 'header',
        },
        'Authorization',
      )
      .build();
    const document = SwaggerModule.createDocument(app, swaggerCfg);

    app.use(
      '/doc',
      apiReference({
        content: document,
        theme: 'deepSpace',
      }),
    );
  }
};
