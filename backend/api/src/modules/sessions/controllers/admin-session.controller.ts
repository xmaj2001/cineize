import {
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    HttpStatus,
    Param,
    Patch,
    Post,
    Query,
} from "@nestjs/common";
import {
    ApiBearerAuth,
    ApiOkResponse,
    ApiOperation,
    ApiParam,
    ApiTags,
} from "@nestjs/swagger";
import { AdminSessionService } from "../services/admin/admin-session.service";
import {
    AdminSessionDetailDto,
    CreateSessionDto,
    ListAdminSessionsDto,
    UpdateSessionDto,
} from "../dtos/admin-session.dtos";
import { SuccessResponse } from "src/shared/common/envelope.response";
import { AllowAnonymous } from "@thallesp/nestjs-better-auth";

@ApiTags("Admin Sessions")
@ApiBearerAuth()
@AllowAnonymous()
@Controller({ path: "admin/sessions", version: "1" })
export class AdminSessionController {
    constructor(private readonly adminSessionService: AdminSessionService) { }

    @Post()
    @ApiOperation({ summary: "Criar uma nova sessão (Admin)" })
    async create(@Body() dto: CreateSessionDto) {
        return this.adminSessionService.create(dto);
    }

    @Get()
    @ApiOperation({ summary: "Listar sessões com filtros (Admin)" })
    async findAll(@Query() query: ListAdminSessionsDto) {
        return this.adminSessionService.findAll(query);
    }
    @Get("salas")
    @ApiOperation({ summary: "Obter salas disponíveis para seleção em novas sessões (Admin)" })
    async salas() {
        return this.adminSessionService.Salas();
    }

    @Get(":id")
    @ApiOperation({ summary: "Detalhes avançados da sessão e mapa de bilheteira (Admin)" })
    @ApiParam({ name: "id", description: "ID da sessão" })
    @ApiOkResponse({ type: SuccessResponse(AdminSessionDetailDto) })
    async findOne(@Param("id") id: string) {
        return this.adminSessionService.findOne(id);
    }



    @Patch(":id")
    @ApiOperation({ summary: "Atualizar dados de uma sessão (Admin)" })
    @ApiParam({ name: "id", description: "ID da sessão" })
    async update(@Param("id") id: string, @Body() dto: UpdateSessionDto) {
        return this.adminSessionService.update(id, dto);
    }

    @Delete(":id")
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: "Eliminar uma sessão (Admin)" })
    @ApiParam({ name: "id", description: "ID da sessão" })
    async remove(@Param("id") id: string) {
        return this.adminSessionService.remove(id);
    }
}