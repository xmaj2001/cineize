import { Injectable, Logger } from "@nestjs/common";
import * as nodemailer from "nodemailer";

import { EmailPort, SendEmailOptions } from "./email.port";

/**
 * SmtpAdapter — implementação via SMTP (nodemailer).
 * Activa em .env: EMAIL_PROVIDER=smtp
 */
@Injectable()
export class SmtpAdapter extends EmailPort {
  private readonly logger = new Logger(SmtpAdapter.name);
  private readonly transporter: nodemailer.Transporter;
  private readonly from: string;

  constructor() {
    super();
    this.from = process.env.SMTP_FROM ?? "noreply@transcender.app";
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }

  async send(opts: SendEmailOptions): Promise<void> {
    this.logger.debug(`[Email/SMTP] Enviando para ${opts.to}`);
    await this.transporter.sendMail({
      from: this.from,
      to: opts.to,
      subject: opts.subject,
      html: opts.html,
      //   text: opts.text,
      //   headers: opts.headers,
    });
    this.logger.debug(`[Email/SMTP] Enviado para ${opts.to}`);
  }
}
