import { Module } from "@nestjs/common";
import { SessionsService } from "./sessions.service";
import { SessionsController } from "./sessions.controller";
import { CancelSessionUseCase } from "./use-cases/cancel-session.use-case";
import { CreateSessionUseCase } from "./use-cases/create-session.use-case";
import { FindSessionUseCase } from "./use-cases/find-session.use-case";
import { FindSessionSeatsUseCase } from "./use-cases/find-session-seats.use-case";
import { FindSessionsByMovieSlugAndDayUseCase } from "./use-cases/find-sessions-by-movie-slug-and-day.use-case";
import { FindSessionsByMovieSlugDaysSummaryUseCase } from "./use-cases/find-sessions-by-movie-slug-days-summary.use-case";
import { FindSessionsByMovieSlugUseCase } from "./use-cases/find-sessions-by-movie-slug.use-case";
import { UpdateSessionUseCase } from "./use-cases/update-session.use-case";

@Module({
  controllers: [SessionsController],
  providers: [
    SessionsService,
    CreateSessionUseCase,
    FindSessionsByMovieSlugUseCase,
    FindSessionsByMovieSlugDaysSummaryUseCase,
    FindSessionsByMovieSlugAndDayUseCase,
    FindSessionUseCase,
    FindSessionSeatsUseCase,
    UpdateSessionUseCase,
    CancelSessionUseCase,
  ],
  exports: [SessionsService],
})
export class SessionsModule {}
