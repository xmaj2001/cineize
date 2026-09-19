import { Injectable, Logger } from "@nestjs/common";
import { ListMoviesDto } from "../../dtos/list-movies.dto";
import { GetHomeFeedUseCase } from "./use-cases/get-home-feed.use-case";
import { GetMovieByIdUseCase } from "./use-cases/get-movie-by-id.use-case";
import { ListMoviesUseCase } from "./use-cases/list-movies.use-case";

@Injectable()
export class ClientMovieService {
  private readonly logger = new Logger(ClientMovieService.name);

  constructor(
    private readonly getHomeFeedUseCase: GetHomeFeedUseCase,
    private readonly listMoviesUseCase: ListMoviesUseCase,
    private readonly getMovieByIdUseCase: GetMovieByIdUseCase,
  ) { }

  async getHomeFeed(locationId?: string) {
    return this.getHomeFeedUseCase.execute(locationId);
  }

  async getMovies(params: ListMoviesDto) {
    return this.listMoviesUseCase.execute(params);
  }

  async getMovieById(movieId: string, locationId?: string) {
    return this.getMovieByIdUseCase.execute(movieId, locationId);
  }
}
