import { Module } from "@nestjs/common";
import { PublicPresaleSubscriptionsController } from "./controllers/client.controller";
import { PresaleSubscriptionClientService } from "./services/client.service";
import { BullModule } from "@nestjs/bullmq";
import { PresaleProcessor } from "./job/presale.process";
import { PresaleSubscriptionsListener } from "./listeners/listeners";
import { EmailModule } from "src/shared/email.module";

@Module({
  controllers: [PublicPresaleSubscriptionsController],
  providers: [
    PresaleSubscriptionClientService,
    PresaleProcessor,
    PresaleSubscriptionsListener,
  ],
  imports: [
    BullModule.registerQueue({
      name: "presale",
    }),
    EmailModule,
  ],
})
export class PresaleSubscriptionsModule {}
