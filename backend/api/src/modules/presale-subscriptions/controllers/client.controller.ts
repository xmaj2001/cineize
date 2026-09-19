import { Controller, Post, Body, Param } from "@nestjs/common";
import {
  ApiTags,
  ApiOperation,
  ApiParam,
  ApiCreatedResponse,
} from "@nestjs/swagger";
import { AllowAnonymous } from "@thallesp/nestjs-better-auth";
import { PresaleSubscriptionClientService } from "../services/client.service";
import { CreatePresaleSubscriptionDto } from "../dtos/create-presale-subscription.dto";

@ApiTags("Presale")
@Controller({ path: "presale-subscriptions", version: "1" })
@AllowAnonymous()
export class PublicPresaleSubscriptionsController {
  constructor(private readonly service: PresaleSubscriptionClientService) {}

  @Post("/:movieId")
  @ApiOperation({
    summary: "Subscrever a notificações de pré-venda",
    description:
      "Permite a um utilizador receber um aviso quando a pré-venda deste filme estiver disponível.",
  })
  @ApiParam({ name: "movieId", description: "ID do filme" })
  @ApiCreatedResponse({ description: "Subscrição criada com sucesso." })
  async subscribe(
    @Param("movieId") movieId: string,
    @Body() dto: CreatePresaleSubscriptionDto,
  ) {
    const subscription = await this.service.createSubscription(movieId, dto);
    return subscription;
  }
}
