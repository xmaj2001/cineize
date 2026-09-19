import { Processor, WorkerHost } from "@nestjs/bullmq";
import { Job } from "bullmq";
import { Logger } from "@nestjs/common";
import { PrismaService } from "src/shared/prisma/prisma.service";
import { EmailPort } from "src/shared/email.port";

interface PresaleJobData {
  movieId: string;
  sessionId: string;
  saleOpensAt: Date;
}

interface WelcomeEmailParams {
  name: string;
  movieTitle: string;
  posterUrl?: string | null;
  sessionId: string;
  appUrl: string;
  unsubscribeUrl: string;
}

function renderWelcomeEmail({
  name,
  movieTitle,
  posterUrl,
  sessionId,
  appUrl,
  unsubscribeUrl,
}: WelcomeEmailParams): string {
  const posterBlock = posterUrl
    ? `<div style="text-align: center; margin: 16px 0;">
         <img src="${posterUrl}" alt="${movieTitle}" style="max-width: 100%; height: auto; border-radius: 8px; display: block; margin: 0 auto;">
       </div>`
    : "";

  return `<!DOCTYPE html>
<html lang="pt">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f4f4f5; color: #18181b; margin: 0; padding: 20px; }
    .card { background-color: #ffffff; border-radius: 8px; padding: 24px; max-width: 500px; margin: 0 auto; border: 1px solid #e4e4e7; }
    .title { color: #09090b; font-size: 20px; font-weight: 700; margin-bottom: 12px; }
    .button { background-color: #e50914; color: #ffffff !important; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: 600; margin-top: 16px; }
    .footer { text-align: center; font-size: 12px; color: #71717a; margin-top: 24px; }
    .footer a { color: #71717a; }
    .preheader { display: none; max-height: 0; overflow: hidden; }
  </style>
</head>
<body>
  <div class="preheader">A pré-venda de ${movieTitle} já abriu — garante já o teu bilhete.</div>
  <div class="card">
    <h2 class="title">Olá, ${name}!</h2>
    <p>A pré-venda para o filme <strong>${movieTitle}</strong> já está oficialmente aberta no cineize.</p>
    ${posterBlock}
    <p>Garante o teu bilhete antes que os lugares esgotem.</p>
    <div style="text-align: center;">
      <a href="${appUrl}/sessions/${sessionId}" class="button">Comprar Bilhete Agora</a>
    </div>
  </div>
  <div class="footer">
    <p>Recebeste este e-mail porque te inscreveste na lista de pré-venda do cineize.</p>
    <p><a href="${unsubscribeUrl}">Cancelar inscrição</a></p>
  </div>
</body>
</html>`;
}

@Processor("presale")
export class PresaleProcessor extends WorkerHost {
  private readonly logger = new Logger(PresaleProcessor.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly emailPort: EmailPort,
  ) {
    super();
  }

  async process(job: Job<PresaleJobData, any, string>): Promise<any> {
    this.logger.log(
      `[JOB EXECUTION] A processar abertura de pré-venda do Job #${job.id}`,
    );
    this.logger.log(
      `Filme ID: ${job.data.movieId} | Sessão ID: ${job.data.sessionId}`,
    );

    const subscribers = await this.prisma.presaleSubscription.findMany({
      where: {
        movieId: job.data.movieId,
        notifiedAt: null,
      },
      include: {
        movie: {
          select: {
            title: true,
            posterUrl: true,
          },
        },
      },
    });

    if (subscribers.length === 0) {
      this.logger.log(
        `Nenhum subscritor pendente encontrado para o filme ${job.data.movieId}.`,
      );
      return { notifiedCount: 0, sentEmails: 0 };
    }

    const emailSubscribers = subscribers.filter(
      (sub): sub is typeof sub & { email: string } => sub.email != null,
    );

    this.logger.log(
      `🔥 Pré-venda aberta! Notificando ${subscribers.length} subscritores (${emailSubscribers.length} via e-mail):`,
    );

    const appUrl = process.env.WEB_APP_URL || "http://localhost:3000";

    const emailPromises = emailSubscribers.map((sub) => {
      const name = sub.email.split("@")[0];
      const movieTitle = sub.movie?.title ?? "o teu filme";
      const unsubscribeUrl = `${appUrl}/unsubscribe?email=${encodeURIComponent(sub.email)}`;

      this.logger.debug(`Email: ${sub.email}`);

      return this.emailPort.send({
        to: sub.email,
        subject: `A pré-venda abriu para: ${movieTitle}`,
        html: renderWelcomeEmail({
          name,
          movieTitle,
          posterUrl: sub.movie?.posterUrl,
          sessionId: job.data.sessionId,
          appUrl,
          unsubscribeUrl,
        }),
        headers: {
          "List-Unsubscribe": `<${unsubscribeUrl}>`,
          "List-Unsubscribe-Post": "List-Unsubscribe=One-Click",
        },
      });
    });

    const emailResults = await Promise.allSettled(emailPromises);

    const successfulEmails = emailResults.filter(
      (res) => res.status === "fulfilled",
    ).length;
    const failedEmails = emailResults.filter(
      (res) => res.status === "rejected",
    ).length;

    this.logger.log(
      `✉️ Envios concluídos: ${successfulEmails} com sucesso | ${failedEmails} falhas.`,
    );

    await this.prisma.presaleSubscription.updateMany({
      where: {
        id: { in: subscribers.map((s) => s.id) },
      },
      data: {
        notifiedAt: new Date(),
      },
    });

    this.logger.log(
      `${subscribers.length} subscritores marcados como notificados.`,
    );

    return {
      notifiedCount: subscribers.length,
      sentEmails: successfulEmails,
      failedEmails,
    };
  }
}
