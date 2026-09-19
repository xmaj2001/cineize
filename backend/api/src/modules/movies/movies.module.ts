import { Module } from "@nestjs/common";
import { ClientMovieController } from "./controllers/client.controller";
import { ClientMovieService } from "./services/client/client.service";
import { AdminMovieController } from "./controllers/admin.controller";
import { AdminMovieService } from "./services/admin.service";
import { GetHomeFeedUseCase } from "./services/client/use-cases/get-home-feed.use-case";
import { ListMoviesUseCase } from "./services/client/use-cases/list-movies.use-case";
import { GetMovieByIdUseCase } from "./services/client/use-cases/get-movie-by-id.use-case";

@Module({
  controllers: [
    ClientMovieController, AdminMovieController],
  providers: [
    GetHomeFeedUseCase,
    ListMoviesUseCase,
    GetMovieByIdUseCase,
    ClientMovieService,
    AdminMovieService
  ],
})
export class MoviesModule { }
