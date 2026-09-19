import { Module } from "@nestjs/common";
import { ClientSessionController } from "./controllers/client.controller";
import { ClientSessionService } from "./services/client.service";
import { SessionSeatEventService } from "./services/session-seat-event.service";
import { AdminSessionController } from "./controllers/admin-session.controller";
import { AdminSessionService } from "./services/admin/admin-session.service";

@Module({
  controllers: [ClientSessionController, AdminSessionController],
  providers: [ClientSessionService, SessionSeatEventService, AdminSessionService],
  exports: [SessionSeatEventService],
})
export class SessionsModule { }
