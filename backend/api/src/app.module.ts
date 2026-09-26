import { Module } from "@nestjs/common";
import { AppController } from "./modules/app/app.controller";
import { AppService } from "./modules/app/app.service";
import { PrismaModule } from "./shared/prisma/prisma.module";
import { AuthModule } from "@thallesp/nestjs-better-auth";
import { createBetterAuth } from "./shared/auth/betterAuth/betterAuth";
import { BetterAuthModules } from "./shared/auth/betterAuth/betterAuth.module";
import { ConfigModule } from "@nestjs/config";
import { validateEnv } from "./shared/config/env.schema";
import { LocationsModule } from "./modules/locations/locations.module";
import { CinemasModule } from "./modules/cinemas/cinemas.module";
import { MoviesModule } from "./modules/movies/movies.module";
import { SessionsModule } from "./modules/sessions/sessions.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate: validateEnv, // O Nest chama esta função ao iniciar
    }),
    PrismaModule,
    AuthModule.forRoot(createBetterAuth()),
    BetterAuthModules,
    LocationsModule,
    CinemasModule,
    MoviesModule,
    SessionsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
