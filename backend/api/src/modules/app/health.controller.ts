import { Controller, Get, VERSION_NEUTRAL } from "@nestjs/common";
import { ApiExcludeController } from "@nestjs/swagger";
import { AllowAnonymous } from "@thallesp/nestjs-better-auth";

@ApiExcludeController()
@Controller({ path: "health", version: VERSION_NEUTRAL })
export class HealthController {
  @AllowAnonymous()
  @Get()
  check() {
    return { status: "ok", timestamp: new Date().toISOString() };
  }
}
