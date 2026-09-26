import "dotenv/config";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { setupSwaggerScalar } from "./shared/swagger/swagger-scalar.config";
import { NestExpressApplication } from "@nestjs/platform-express";
import cookieParser from "cookie-parser";
import { AppValidationPipe } from "./shared/common/pipes/validation.pipe";
import { HttpExceptionFilter } from "./shared/common/filters/http-exception.filter";
import { BigIntInterceptor } from "./shared/common/interceptors/bigint.interceptor";
import { ResponseInterceptor } from "./shared/common/interceptors/response.interceptor";
import { VersioningType } from "@nestjs/common";

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    // bodyParser: false, // Required for Better Auth
  });

  app.enableVersioning({
    type: VersioningType.URI,
  });
  app.use(cookieParser());

  app.useGlobalPipes(new AppValidationPipe({}, false));
  // app.useWebSocketAdapter(new IoAdapter(app));
  app.useGlobalInterceptors(new BigIntInterceptor());
  app.useGlobalInterceptors(new ResponseInterceptor());
  app.useGlobalFilters(new HttpExceptionFilter(false));
  // ── Swagger ─────────────────────────────────────────────────────────────────
  setupSwaggerScalar(app, "API", process.env.NODE_ENV === "production");
  const port = process.env.PORT ?? 5000;
  await app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
    console.log(`Documentation http://localhost:${port}/doc`);
  });
}
bootstrap();
