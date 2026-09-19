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
import { CqrsModule } from "@nestjs/cqrs";
import { MoviesModule } from "./modules/movies/movies.module";
import { SessionsModule } from "./modules/sessions/sessions.module";
import { PresaleSubscriptionsModule } from "./modules/presale-subscriptions/presale-subscriptions.module";
import { BullModule } from "@nestjs/bullmq";
import { bullBaseConfig } from "./shared/config/bull.config";
import { EventEmitterModule } from "@nestjs/event-emitter";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate: validateEnv,
    }),
    BullModule.forRoot({
      ...bullBaseConfig(),
    }),
    // MailerModule.forRoot({
    //   transport: {
    //     host: process.env.SMTP_HOST,
    //     port: process.env.SMTP_PORT,
    //     auth: {
    //       user: process.env.SMTP_USER,
    //       pass: process.env.SMTP_PASS,
    //     },
    //   },
    //   defaults: {
    //     from: process.env.SMTP_FROM,
    //   },
    //   template: {
    //     dir: join(__dirname, "templates"), // 👈 Define a pasta onde estão os ficheiros .hbs
    //     adapter: new HandlebarsAdapter(),
    //     options: {
    //       strict: true, // Garante que lança erro se falta alguma variável no context
    //     },
    //   },
    // }),
    EventEmitterModule.forRoot(),
    PrismaModule,
    CqrsModule.forRoot(),
    AuthModule.forRoot(createBetterAuth()),
    BetterAuthModules,
    MoviesModule,
    LocationsModule,
    SessionsModule,
    PresaleSubscriptionsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
