import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  ParseIntPipe,
} from "@nestjs/common";
import { ApiTags, ApiOperation, ApiQuery } from "@nestjs/swagger";
import { AllowAnonymous } from "@thallesp/nestjs-better-auth";
import { MoviesService } from "./movies.service";
import { CatalogQueryDto, CreateMovieDto } from "./dto/create-movie.dto";
import { UpdateMovieDto } from "./dto/update-movie.dto";
import { ListNowShowingUseCase } from "./use-cases/list-now-showing.use-case";
import { ListComingSoonUseCase } from "./use-cases/list-coming-soon.use-case";
import { ListPresaleUseCase } from "./use-cases/list-presale.use-case";
import { ListFeaturedUseCase } from "./use-cases/list-featured.use-case";

@ApiTags("Movies")
@Controller({
  version: "1",
  path: "movies",
})
export class MoviesController {
  constructor(
    private readonly moviesService: MoviesService,
    private readonly listNowShowing: ListNowShowingUseCase,
    private readonly listPresale: ListPresaleUseCase,
    private readonly listComingSoon: ListComingSoonUseCase,
    private readonly listFeatured: ListFeaturedUseCase,
  ) {}

  @Post()
  @ApiOperation({ summary: "Criar filme (SUPER_ADMIN)" })
  create(@Body() dto: CreateMovieDto) {
    return this.moviesService.create(dto);
  }

  // ─────────────────────────────────────────────
  // CATÁLOGO (rotas estáticas SEMPRE antes de ":id")
  // ─────────────────────────────────────────────

  @AllowAnonymous()
  @Get("featured")
  @ApiOperation({ summary: "Filmes em destaque (carrossel)" })
  featured(@Query() q: CatalogQueryDto) {
    return this.listFeatured.execute({
      cinemaSlug: q.cinema,
      limit: q.limit,
    });
  }

  @AllowAnonymous()
  @Get("now-showing")
  @ApiOperation({ summary: "Filmes em cartaz (próximos 7 dias)" })
  nowShowing(@Query() q: CatalogQueryDto) {
    return this.listNowShowing.execute({
      cinemaSlug: q.cinema,
      limit: q.limit,
      cursor: q.cursor,
    });
  }

  @AllowAnonymous()
  @Get("presale")
  @ApiOperation({ summary: "Filmes em pré-venda" })
  presale(@Query() q: CatalogQueryDto) {
    return this.listPresale.execute({
      cinemaSlug: q.cinema,
      limit: q.limit,
      cursor: q.cursor,
    });
  }

  @AllowAnonymous()
  @Get("coming-soon")
  @ApiOperation({ summary: "Filmes em breve (sem sessões à venda)" })
  comingSoon(@Query() q: CatalogQueryDto) {
    return this.listComingSoon.execute({
      limit: q.limit,
      cursor: q.cursor,
    });
  }

  // ─────────────────────────────────────────────
  // LISTAGEM GERAL (página "todos os filmes")
  // ─────────────────────────────────────────────

  @AllowAnonymous()
  @Get()
  @ApiOperation({ summary: "Listar filmes (Feed com Cursor Pagination)" })
  @ApiQuery({ name: "genre", required: false })
  @ApiQuery({ name: "ageRating", required: false })
  @ApiQuery({ name: "search", required: false })
  @ApiQuery({ name: "active", required: false })
  @ApiQuery({ name: "cursor", required: false, type: Number })
  @ApiQuery({ name: "limit", required: false, type: Number })
  findAll(
    @Query("cursor") cursor?: string,
    @Query("limit") limit?: string,
    @Query("genre") genre?: string,
    @Query("ageRating") ageRating?: string,
    @Query("search") search?: string,
    @Query("active") active?: string,
  ) {
    const parsedLimit = limit ? parseInt(limit, 10) : 10;
    const parsedCursor = cursor ? parseInt(cursor, 10) : undefined;

    return this.moviesService.findFeed({
      genre,
      ageRating,
      search,
      active: active !== undefined ? active === "true" : true,
      limit: parsedLimit,
      cursor: parsedCursor,
    });
  }

  @AllowAnonymous()
  @Get("slug/:slug")
  @ApiOperation({ summary: "Obter filme por slug" })
  findMovieBySlug(@Param("slug") slug: string) {
    return this.moviesService.findMovieBySlug(slug);
  }

  @AllowAnonymous()
  @Get(":id")
  @ApiOperation({ summary: "Obter filme por ID" })
  findOne(@Param("id", ParseIntPipe) id: number) {
    return this.moviesService.findOne(id);
  }

  @Put(":id")
  @ApiOperation({ summary: "Atualizar filme (SUPER_ADMIN)" })
  update(@Param("id", ParseIntPipe) id: number, @Body() dto: UpdateMovieDto) {
    return this.moviesService.update(id, dto);
  }

  @Delete(":id")
  @ApiOperation({ summary: "Desativar filme (SUPER_ADMIN)" })
  remove(@Param("id", ParseIntPipe) id: number) {
    return this.moviesService.remove(id);
  }
}
