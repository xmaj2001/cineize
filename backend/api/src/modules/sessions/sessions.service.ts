import { Injectable } from "@nestjs/common";
import { CreateSessionDto } from "./dto/create-session.dto";
import { UpdateSessionDto } from "./dto/update-session.dto";
import { CancelSessionUseCase } from "./use-cases/cancel-session.use-case";
import { CreateSessionUseCase } from "./use-cases/create-session.use-case";
import { FindSessionUseCase } from "./use-cases/find-session.use-case";
import { FindSessionSeatsUseCase } from "./use-cases/find-session-seats.use-case";
import { FindSessionsByMovieSlugAndDayUseCase } from "./use-cases/find-sessions-by-movie-slug-and-day.use-case";
import { FindSessionsByMovieSlugDaysSummaryUseCase } from "./use-cases/find-sessions-by-movie-slug-days-summary.use-case";
import { FindSessionsByMovieSlugUseCase } from "./use-cases/find-sessions-by-movie-slug.use-case";
import { UpdateSessionUseCase } from "./use-cases/update-session.use-case";

@Injectable()
export class SessionsService {
  constructor(
    private readonly createSession: CreateSessionUseCase,
    private readonly findByMovieSlug: FindSessionsByMovieSlugUseCase,
    private readonly findByMovieSlugDaysSummary: FindSessionsByMovieSlugDaysSummaryUseCase,
    private readonly findByMovieSlugAndDay: FindSessionsByMovieSlugAndDayUseCase,
    private readonly findSession: FindSessionUseCase,
    private readonly findSessionSeats: FindSessionSeatsUseCase,
    private readonly updateSession: UpdateSessionUseCase,
    private readonly cancelSession: CancelSessionUseCase,
  ) {}

  create(dto: CreateSessionDto) {
    return this.createSession.execute(dto);
  }
  findSessionsByMovieSlug(
    slug: string,
    limit: number,
    cursor?: number,
    cinemaId?: number,
  ) {
    return this.findByMovieSlug.execute(slug, limit, cursor, cinemaId);
  }
  findSessionsByMovieSlugDaysSummary(slug: string) {
    return this.findByMovieSlugDaysSummary.execute(slug);
  }
  findSessionsByMovieSlugAndDay(
    slug: string,
    date: string,
    cinemaId?: number,
    limit = 10,
    cursor?: number,
  ) {
    return this.findByMovieSlugAndDay.execute(
      slug,
      date,
      cinemaId,
      limit,
      cursor,
    );
  }
  findOne(id: number) {
    return this.findSession.execute(id);
  }
  findSeats(id: number) {
    return this.findSessionSeats.execute(id);
  }
  update(id: number, dto: UpdateSessionDto) {
    return this.updateSession.execute(id, dto);
  }
  remove(id: number) {
    return this.cancelSession.execute(id);
  }
}
