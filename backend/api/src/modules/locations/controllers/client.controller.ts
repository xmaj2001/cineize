import { Controller, Get, Param } from "@nestjs/common";
import {
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from "@nestjs/swagger";
import { LocationClientService } from "../services/location-client.service";
import { LocationDto } from "../dtos/location.dto";
import { LocationDetailDto } from "../dtos/location-detail.dto";
import { AllowAnonymous } from "@thallesp/nestjs-better-auth";
import {
  SuccessArrayResponse,
  SuccessResponse,
} from "../../../shared/common/envelope.response";

@ApiTags("Locations")
@Controller({ path: "locations", version: "1" })
@AllowAnonymous()
export class PublicLocationsController {
  constructor(private readonly locationService: LocationClientService) {}

  @Get()
  @ApiOperation({
    summary: "Listar localizações",
    description:
      "Retorna a lista de todos os cinemas/localizações disponíveis.",
  })
  @ApiOkResponse({ type: SuccessArrayResponse(LocationDto) })
  async findAll() {
    return await this.locationService.findAll(); // Devolve { items: [...] } para ser interceptado e envolvido se necessário, ou para condizer com o envelope SuccessArrayResponse
  }

  @Get(":id")
  @ApiOperation({
    summary: "Detalhes de uma localização",
    description:
      "Retorna os detalhes de um cinema específico, incluindo as suas salas.",
  })
  @ApiParam({ name: "id", description: "ID da localização" })
  @ApiOkResponse({ type: SuccessResponse(LocationDetailDto) })
  async getLocationById(@Param("id") id: string) {
    return await this.locationService.getLocationById(id);
  }
}
