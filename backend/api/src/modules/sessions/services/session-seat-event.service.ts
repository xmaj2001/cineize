import { Injectable, Logger } from "@nestjs/common";
import { Subject, Observable } from "rxjs";
import { map } from "rxjs/operators";

export interface SeatUpdateEvent {
  sessionId: string;
  seatId: string;
  status: "AVAILABLE" | "RESERVED" | "SOLD";
}

/**
 * Serviço de eventos SSE para notificar clientes em tempo real
 * sobre alterações de estado dos assentos de uma sessão.
 *
 * Qualquer outro serviço (ex: OrdersService) pode injectar este serviço
 * e chamar emit() para disparar um evento.
 */
@Injectable()
export class SessionSeatEventService {
  private readonly logger = new Logger(SessionSeatEventService.name);

  // Subject global — todos os subscribers recebem todos os eventos;
  // o filtro por sessionId é feito do lado do controller (no pipe rxjs).
  private readonly updates$ = new Subject<SeatUpdateEvent>();

  /**
   * Emite um evento de actualização de assento.
   * Deve ser chamado após qualquer alteração de SessionTicket.
   */
  emit(event: SeatUpdateEvent): void {
    this.logger.log(
      `SSE emit: session=${event.sessionId} seat=${event.seatId} status=${event.status}`,
    );
    this.updates$.next(event);
  }

  /**
   * Retorna um Observable filtrado para a sessão especificada,
   * formatado no protocolo SSE (data: ...\n\n).
   */
  getStream(sessionId: string): Observable<MessageEvent> {
    return this.updates$.pipe(
      map((event) => {
        if (event.sessionId !== sessionId) {
          // Emite null para eventos de outras sessões — o controller filtra
          return null as unknown as MessageEvent;
        }
        return {
          data: JSON.stringify(event),
        } as MessageEvent;
      }),
    ) as Observable<MessageEvent>;
  }

  /**
   * Retorna o Observable raw (sem filtro) — útil para filtrar no controller
   * com o operador filter().
   */
  getRawStream(): Observable<SeatUpdateEvent> {
    return this.updates$.asObservable();
  }
}
