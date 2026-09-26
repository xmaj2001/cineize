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
import { CinemasService } from "./cinemas.service";
import { CreateCinemaDto } from "./dto/create-cinema.dto";
import { UpdateCinemaDto } from "./dto/update-cinema.dto";
import { PaginationDto } from "src/shared/common/pagination.dto";
import { AllowAnonymous } from "@thallesp/nestjs-better-auth";

@ApiTags("Cinemas")
@Controller({
  version: "1",
  path: "cinemas",
})
export class CinemasController {
  constructor(private readonly cinemasService: CinemasService) {}

  @Post()
  @ApiOperation({ summary: "Criar cinema (SUPER_ADMIN)" })
  create(@Body() dto: CreateCinemaDto) {
    return this.cinemasService.create(dto);
  }

  @Get()
  @AllowAnonymous()
  @ApiOperation({ summary: "Listar cinemas" })
  @ApiQuery({ name: "locationId", required: false })
  @ApiQuery({ name: "active", required: false })
  findAll(
    @Query() pagination: PaginationDto,
    @Query("locationId") locationId?: string,
    @Query("active") active?: string,
  ) {
    return this.cinemasService.findAll({
      locationId: locationId ? +locationId : undefined,
      active: active !== undefined ? active === "true" : true,
      limit: pagination.limit,
      offset: pagination.offset,
    });
  }

  @Get(":id")
  @AllowAnonymous()
  @ApiOperation({ summary: "Obter cinema por ID" })
  findOne(@Param("id", ParseIntPipe) id: number) {
    return this.cinemasService.findOne(id);
  }

  @Put(":id")
  @ApiOperation({ summary: "Atualizar cinema" })
  update(@Param("id", ParseIntPipe) id: number, @Body() dto: UpdateCinemaDto) {
    return this.cinemasService.update(id, dto);
  }

  @Delete(":id")
  @ApiOperation({ summary: "Desativar cinema (SUPER_ADMIN)" })
  remove(@Param("id", ParseIntPipe) id: number) {
    return this.cinemasService.remove(id);
  }
}
