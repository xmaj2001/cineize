import {
    Controller,
    Get,
    Post,
    Patch,
    Delete,
    Body,
    Param,
    Query,
    HttpCode,
    HttpStatus,
    ParseBoolPipe,
} from "@nestjs/common";
import {
    ApiTags,
    ApiOperation,
    ApiQuery,
    ApiParam,
    ApiOkResponse,
    ApiCreatedResponse,
    ApiBearerAuth,
} from "@nestjs/swagger";
import { AdminMovieService } from "../services/admin.service";
import {
    CreateMovieDto,
    UpdateMovieDto,
    ListAdminMoviesDto,
} from "../dtos/movie-admin.dto";
import { SuccessResponse } from "../../../shared/common/envelope.response";
import { MovieDetailDto } from "../dtos/movie-detail.dto";
import { AllowAnonymous } from "@thallesp/nestjs-better-auth";

// Se utilizas guardas de autenticação/autorização para administradores:
// @UseGuards(AuthGuard, RolesGuard)
// @Roles(UserRole.ADMIN, UserRole.STAFF)
@ApiTags("Admin Movies")
@ApiBearerAuth()
@AllowAnonymous()
@Controller({ path: "admin/movies", version: "1" })
export class AdminMovieController {
    constructor(private readonly adminMovieService: AdminMovieService) { }

    @Post()
    @ApiOperation({
        summary: "Criar novo filme",
        description: "Permite ao administrador registar um novo filme no catálogo.",
    })
    @ApiCreatedResponse({ type: SuccessResponse(MovieDetailDto) })
    async createMovie(@Body() dto: CreateMovieDto) {
        return this.adminMovieService.createMovie(dto);
    }

    @Get()
    @ApiOperation({
        summary: "Listar filmes (Admin)",
        description:
            "Lista todos os filmes com paginação e suporte a status inclusive ARCHIVED.",
    })
    async getMovies(@Query() query: ListAdminMoviesDto) {
        return this.adminMovieService.getMovies(query);
    }

    @Get(":id")
    @ApiOperation({
        summary: "Obter detalhes do filme (Admin)",
        description: "Devolve os detalhes de um filme específico incluindo contadores.",
    })
    @ApiParam({ name: "id", description: "ID do filme" })
    @ApiOkResponse({ type: SuccessResponse(MovieDetailDto) })
    async getMovieById(@Param("id") id: string) {
        return this.adminMovieService.getMovieById(id);
    }

    @Patch(":id")
    @ApiOperation({
        summary: "Atualizar filme",
        description: "Atualiza campos específicos de um filme registado.",
    })
    @ApiParam({ name: "id", description: "ID do filme" })
    @ApiOkResponse({ type: SuccessResponse(MovieDetailDto) })
    async updateMovie(
        @Param("id") id: string,
        @Body() dto: UpdateMovieDto,
    ) {
        return this.adminMovieService.updateMovie(id, dto);
    }

    @Delete(":id")
    @HttpCode(HttpStatus.OK)
    @ApiOperation({
        summary: "Apagar/Arquivar filme",
        description:
            "Por defeito faz Soft Delete (marca como ARCHIVED para não aparecer ao público). Se hard=true for passado, apaga definitivamente.",
    })
    @ApiParam({ name: "id", description: "ID do filme" })
    @ApiQuery({
        name: "hard",
        required: false,
        type: Boolean,
        description: "Se true, faz a eliminação definitiva da BD.",
    })
    async deleteMovie(
        @Param("id") id: string,
        @Query("hard", new ParseBoolPipe({ optional: true })) hard?: boolean,
    ) {
        return this.adminMovieService.deleteMovie(id, hard);
    }
}