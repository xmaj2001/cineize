export interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
  headers?: Record<string, string>;
}

export abstract class EmailPort {
  abstract send(opts: SendEmailOptions): Promise<void>;
}
