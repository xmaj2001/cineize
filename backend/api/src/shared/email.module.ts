import { Module } from "@nestjs/common";
import { EmailPort } from "./email.port";
import { SmtpAdapter } from "./smtp.adapter";

@Module({
  providers: [
    {
      provide: EmailPort,
      useClass: SmtpAdapter,
    },
  ],
  exports: [EmailPort],
})
export class EmailModule {}
