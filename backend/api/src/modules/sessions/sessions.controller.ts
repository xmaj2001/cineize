import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  ParseIntPipe,
  Query,
  BadRequestException,
} from "@nestjs/common";
import { ApiTags, ApiOperation, ApiQuery } from "@nestjs/swagger";
import { SessionsService } from "./sessions.service";
import { CreateSessionDto } from "./dto/create-session.dto";
import { UpdateSessionDto } from "./dto/update-session.dto";
import { AllowAnonymous } from "@thallesp/nestjs-better-auth";

@ApiTags("Sessions")
@Controller({
  version: "1",
  path: "sessions",
})
export class SessionsController {
  constructor(private readonly sessionsService: SessionsService) {}

  @Post()
  @ApiOperation({ summary: "Criar sessão" })
  create(@Body() dto: CreateSessionDto) {
    return this.sessionsService.create(dto);
  }

  @Get("movie/:slug")
  @AllowAnonymous()
  @ApiOperation({
    summary: "Listar sessões de um filme (por slug) usando paginação de cursor",
  })
  @ApiQuery({ name: "cursor", required: false, type: Number })
  @ApiQuery({ name: "limit", required: false, type: Number })
  @ApiQuery({ name: "cinemaId", required: false, type: Number })
  findSessionsByMovieSlug(
    @Param("slug") slug: string,
    @Query("cursor") cursor?: string,
    @Query("limit") limit?: string,
    @Query("cinemaId") cinemaId?: string,
  ) {
    const parsedLimit = limit ? parseInt(limit, 10) : 10;
    const parsedCursor = cursor ? parseInt(cursor, 10) : undefined;
    const parsedCinemaId = cinemaId ? parseInt(cinemaId, 10) : undefined;

    return this.sessionsService.findSessionsByMovieSlug(
      slug,
      parsedLimit,
      parsedCursor,
      parsedCinemaId,
    );
  }

  @Get("movie/:slug/days-summary")
  @AllowAnonymous()
  @ApiOperation({
    summary: "Listar dias da semana com sessões de um filme",
  })
  async findSessionsByMovieSlugDaysSummary(@Param("slug") slug: string) {
    return this.sessionsService.findSessionsByMovieSlugDaysSummary(slug);
  }

  @Get("movie/:slug/:date")
  @AllowAnonymous()
  @ApiOperation({
    summary: "Listar sessões de um filme (por slug) usando paginação de cursor",
  })
  @ApiQuery({ name: "cursor", required: false, type: Number })
  @ApiQuery({ name: "limit", required: false, type: Number })
  @ApiQuery({ name: "cinemaId", required: false, type: Number })
  findSessionsByMovieSlugAndDay(
    @Param("slug") slug: string,
    @Param("date") date: string, // ← Valida isto!
    @Query("cursor") cursor?: string,
    @Query("limit") limit?: string,
    @Query("cinemaId") cinemaId?: string,
  ) {
    // ✅ Valida se a data é válida
    if (!this.isValidDate(date)) {
      throw new BadRequestException("Invalid date format. Use YYYY-MM-DD");
    }

    const parsedLimit = limit ? parseInt(limit, 10) : 10;
    const parsedCursor = cursor ? parseInt(cursor, 10) : undefined;
    const parsedCinemaId = cinemaId ? parseInt(cinemaId, 10) : undefined;

    return this.sessionsService.findSessionsByMovieSlugAndDay(
      slug,
      date,
      parsedCinemaId,
      parsedLimit,
      parsedCursor,
    );
  }

  // Helper method
  private isValidDate(dateString: string): boolean {
    const regex = /^\d{4}-\d{2}-\d{2}$/;
    if (!regex.test(dateString)) return false;
    const date = new Date(dateString);
    return date instanceof Date && !isNaN(date.getTime());
  }
  @Get(":id")
  @AllowAnonymous()
  @ApiOperation({ summary: "Obter sessão por ID" })
  findOne(@Param("id", ParseIntPipe) id: number) {
    return this.sessionsService.findOne(id);
  }

  @Put(":id")
  @ApiOperation({ summary: "Atualizar sessão (preço, estado)" })
  update(@Param("id", ParseIntPipe) id: number, @Body() dto: UpdateSessionDto) {
    return this.sessionsService.update(id, dto);
  }

  @Delete(":id")
  @ApiOperation({ summary: "Cancelar sessão" })
  remove(@Param("id", ParseIntPipe) id: number) {
    return this.sessionsService.remove(id);
  }
}
