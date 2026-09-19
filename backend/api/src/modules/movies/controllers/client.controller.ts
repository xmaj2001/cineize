import { Controller, Get, Param, Query } from "@nestjs/common";
import {
  ApiTags,
  ApiOperation,
  ApiQuery,
  ApiParam,
  ApiOkResponse,
} from "@nestjs/swagger";
import { ClientMovieService } from "../services/client/client.service";
import { AllowAnonymous } from "@thallesp/nestjs-better-auth";
import {
  SuccessResponse,
  CursorPaginatedResponse,
} from "../../../shared/common/envelope.response";
import { HomeFeedDto } from "../dtos/home-feed.dto";
import { MovieCardDto } from "../dtos/movie-card.dto";
import { MovieDetailDto } from "../dtos/movie-detail.dto";
import { ListMoviesDto } from "../dtos/list-movies.dto";

@ApiTags("Movies")
@Controller({ path: "movies", version: "1" })
@AllowAnonymous()
export class ClientMovieController {
  constructor(private readonly clientMovieService: ClientMovieService) { }

  /**
   * ENDPOINT DA HOME.
   * Devolve tudo o que a home precisa numa única viagem de rede:
   * destaques (carrossel), em cartaz, pré-venda e em breve.
   * Pensado pra reduzir round-trips em rede móvel instável.
   */
  @Get("home")
  @ApiOperation({
    summary: "Feed da Home",
    description:
      "Retorna destaques, em cartaz, pré-venda e em breve numa única resposta, já filtrados pelo cinema selecionado (se enviado).",
  })
  @ApiQuery({
    name: "locationId",
    required: false,
    description: "ID do cinema para filtrar sessões disponíveis",
  })
  @ApiOkResponse({ type: SuccessResponse(HomeFeedDto) })
  async getHomeFeed(@Query("locationId") locationId?: string) {
    return this.clientMovieService.getHomeFeed(locationId);
  }

  /**
   * Listagem completa (usada na página "/movies" quando o user clica "ver mais").
   * Aqui sim faz sentido paginação e filtros — pode crescer bastante.
   */
  @Get("")
  @ApiOperation({
    summary: "Listar filmes",
    description:
      "Retorna todos os filmes disponíveis, com filtros por cinema e status. Usado na listagem completa.",
  })
  @ApiOkResponse({ type: CursorPaginatedResponse(MovieCardDto) })
  async getMovies(@Query() query: ListMoviesDto) {
    return this.clientMovieService.getMovies(query);
  }

  @Get(":id")
  @ApiOperation({
    summary: "Detalhes de um filme",
    description:
      "Retorna filme + lista de sessões futuras disponíveis no cinema selecionado.",
  })
  @ApiParam({ name: "id", description: "ID do filme" })
  @ApiQuery({
    name: "locationId",
    required: false,
    description: "ID do cinema para carregar sessões",
  })
  @ApiOkResponse({ type: SuccessResponse(MovieDetailDto) })
  async getMovieById(
    @Param("id") id: string,
    @Query("locationId") locationId?: string,
  ) {
    return await this.clientMovieService.getMovieById(id, locationId);
  }
}
