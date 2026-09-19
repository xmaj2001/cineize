import { Controller, Get, Param, Sse } from "@nestjs/common";
import type { Response } from "express";
import {
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from "@nestjs/swagger";
import { Observable, filter, map } from "rxjs";
import { AllowAnonymous } from "@thallesp/nestjs-better-auth";
import { ClientSessionService } from "../services/client.service";
import { SessionSeatEventService } from "../services/session-seat-event.service";
import { SuccessResponse } from "../../../shared/common/envelope.response";
import { SessionDetailDto } from "../dtos/session.dto";

@ApiTags("Sessions")
@Controller({ path: "sessions", version: "1" })
@AllowAnonymous()
export class ClientSessionController {
  constructor(
    private readonly clientSessionService: ClientSessionService,
    private readonly seatEventService: SessionSeatEventService,
  ) {}

  @Get(":id")
  @ApiOperation({
    summary: "Detalhes de uma sessão",
    description:
      "Retorna os dados da sessão + estado actualizado de cada assento da sala (AVAILABLE, RESERVED, SOLD).",
  })
  @ApiParam({ name: "id", description: "ID da sessão (SessionMovie)" })
  @ApiOkResponse({ type: SuccessResponse(SessionDetailDto) })
  async getSessionById(@Param("id") id: string) {
    return this.clientSessionService.getSessionById(id);
  }

  /**
   * SSE — Server-Sent Events.
   *
   * O cliente Web subscreve este endpoint uma única vez após carregar
   * o mapa de assentos. Sempre que um assento é reservado, pago ou
   * libertado, o backend emite um evento e o mapa actualiza-se em
   * tempo real sem necessidade de polling.
   */
  @Sse(":id/seats/events")
  @ApiOperation({
    summary: "Stream SSE de actualizações de assentos",
    description:
      "Abre um stream SSE para receber em tempo real as alterações de estado dos assentos desta sessão.",
  })
  @ApiParam({ name: "id", description: "ID da sessão" })
  streamSeatUpdates(@Param("id") sessionId: string): Observable<MessageEvent> {
    return this.seatEventService.getRawStream().pipe(
      filter((event) => event.sessionId === sessionId),
      map(
        (event): MessageEvent =>
          ({
            data: JSON.stringify(event),
          }) as MessageEvent,
      ),
    );
  }
}
