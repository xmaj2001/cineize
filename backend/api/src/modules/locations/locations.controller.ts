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
import { LocationsService } from "./locations.service";
import { CreateLocationDto } from "./dto/create-location.dto";
import { UpdateLocationDto } from "./dto/update-location.dto";
import { PaginationDto } from "src/shared/common/pagination.dto";
import { AllowAnonymous } from "@thallesp/nestjs-better-auth";

@ApiTags("Locations")
@Controller({
  version: "1",
  path: "locations",
})
export class LocationsController {
  constructor(private readonly locationsService: LocationsService) {}

  @Post()
  @ApiOperation({ summary: "Criar localidade (SUPER_ADMIN)" })
  create(@Body() dto: CreateLocationDto) {
    return this.locationsService.create(dto);
  }

  @Get()
  @AllowAnonymous()
  @ApiOperation({ summary: "Listar localidades" })
  @ApiQuery({ name: "province", required: false })
  @ApiQuery({ name: "active", required: false, type: Boolean })
  findAll(
    @Query() pagination: PaginationDto,
    @Query("province") province?: string,
    @Query("active") active?: string,
  ) {
    return this.locationsService.findAll({
      province,
      active: active !== undefined ? active === "true" : true,
      limit: pagination.limit,
      offset: pagination.offset,
    });
  }

  @Get(":id")
  @AllowAnonymous()
  @ApiOperation({ summary: "Obter localidade por ID" })
  findOne(@Param("id", ParseIntPipe) id: number) {
    return this.locationsService.findOne(id);
  }

  @Put(":id")
  @ApiOperation({ summary: "Atualizar localidade (SUPER_ADMIN)" })
  update(
    @Param("id", ParseIntPipe) id: number,
    @Body() dto: UpdateLocationDto,
  ) {
    return this.locationsService.update(id, dto);
  }

  @Delete(":id")
  @ApiOperation({ summary: "Desativar localidade - soft delete (SUPER_ADMIN)" })
  remove(@Param("id", ParseIntPipe) id: number) {
    return this.locationsService.remove(id);
  }
}
