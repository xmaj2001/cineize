import { Injectable, Logger } from "@nestjs/common";
import { OnEvent } from "@nestjs/event-emitter";
import { InjectQueue } from "@nestjs/bullmq";
import { Queue } from "bullmq";
import { MoviePresaleOpenedEvent } from "src/modules/sessions/events/MoviePresaleOpenedEvent";

@Injectable()
export class PresaleSubscriptionsListener {
    private readonly logger = new Logger(PresaleSubscriptionsListener.name);

    constructor(
        @InjectQueue('presale')
        private readonly presaleNotificationsQueue: Queue,
    ) {
        this.logger.log("PresaleSubscriptionsListener initialized");
    }

    @OnEvent('movie.presale.opened')
    async handleMoviePresaleOpened(event: MoviePresaleOpenedEvent) {
        // 1. Instanciação e validação de datas
        const saleOpensAtDate = event.saleOpensAt instanceof Date
            ? event.saleOpensAt
            : new Date(event.saleOpensAt);

        const nowMs = Date.now();
        const targetMs = saleOpensAtDate.getTime();
        const delay = Math.max(0, targetMs - nowMs);

        // 2. Cálculos para leitura humana no log
        const secondsRemaining = Math.floor(delay / 1000);
        const minutesRemaining = (secondsRemaining / 60).toFixed(2);
        const hoursRemaining = (secondsRemaining / 3600).toFixed(2);
        const expectedExecutionDate = new Date(nowMs + delay);

        // 3. Formatação para Fuso Horário Local (Africa/Luanda)
        const options: Intl.DateTimeFormatOptions = {
            timeZone: 'Africa/Luanda',
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false,
        };

        const nowLocal = new Intl.DateTimeFormat('pt-PT', options).format(new Date(nowMs));
        const targetLocal = new Intl.DateTimeFormat('pt-PT', options).format(saleOpensAtDate);
        const expectedLocal = new Intl.DateTimeFormat('pt-PT', options).format(expectedExecutionDate);

        // 4. Logs Estruturados de Debug
        this.logger.debug(`=================== 🕒 DEBUG TIME: PRE-SALE EVENT ===================`);
        this.logger.debug(`🔹 Evento Recebido para o Filme: ${event.movieId} | Sessão: ${event.sessionId}`);
        this.logger.debug(`🔹 Horário Atual (UTC):    ${new Date(nowMs).toISOString()} | Local: ${nowLocal}`);
        this.logger.debug(`🔹 Horário Alvo (UTC):     ${saleOpensAtDate.toISOString()} | Local: ${targetLocal}`);
        this.logger.debug(`---------------------------------------------------------------------`);
        this.logger.debug(`⏱️ Timestamps Raw (ms):   Agora=${nowMs} | Alvo=${targetMs}`);
        this.logger.debug(`⏱️ Delay Total Calculado: ${delay} ms`);
        this.logger.debug(`⏳ Tempo Restante:        ${secondsRemaining} seg (~${minutesRemaining} min / ~${hoursRemaining}h)`);
        this.logger.debug(`🚀 Disparo Agendado Para: ${expectedExecutionDate.toISOString()} | Local: ${expectedLocal}`);

        if (delay === 0) {
            this.logger.warn(`⚠️ ATENÇÃO: O delay foi zerado! A data target já passou ou é o momento atual.`);
        }
        this.logger.debug(`=====================================================================`);

        await this.presaleNotificationsQueue.add(
            'notify-presale-open',
            {
                movieId: event.movieId,
                sessionId: event.sessionId,
                saleOpensAt: saleOpensAtDate,
            },
            {
                delay,
                removeOnComplete: true,
                jobId: `presale-${event.movieId}-${event.sessionId}`,
            },
        );
    }
}