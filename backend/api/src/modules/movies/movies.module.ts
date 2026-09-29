import { Module } from "@nestjs/common";
import { MoviesController } from "./movies.controller";
import { MoviesService } from "./movies.service";
import { ListNowShowingUseCase } from "./use-cases/list-now-showing.use-case";
import { ListPresaleUseCase } from "./use-cases/list-presale.use-case";
import { ListComingSoonUseCase } from "./use-cases/list-coming-soon.use-case";
import { ListFeaturedUseCase } from "./use-cases/list-featured.use-case";

@Module({
  controllers: [MoviesController],
  providers: [
    MoviesService,
    ListNowShowingUseCase,
    ListPresaleUseCase,
    ListComingSoonUseCase,
    ListFeaturedUseCase,
  ],
})
export class MoviesModule {}
