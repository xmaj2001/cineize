// import { TriggerClient, eventTrigger, logger } from "@trigger.dev/sdk/v3";
// import { Resend } from "resend";
// import { prisma } from "@/lib/prisma"; // ✅ IMPORTA DO SINGLETON!

// const resend = new Resend(process.env.RESEND_API_KEY);

// export const client = new TriggerClient({
//   id: "cineize-app",
//   apiKey: process.env.TRIGGER_API_KEY!,
// });

// interface MoviePresaleOpenedPayload {
//   movieId: string;
//   sessionId: string;
//   saleOpensAt: string; // ISO string
// }

// interface WelcomeEmailParams {
//   name: string;
//   movieTitle: string;
//   posterUrl?: string | null;
//   sessionId: string;
//   appUrl: string;
//   unsubscribeUrl: string;
// }

// function renderWelcomeEmail({
//   name,
//   movieTitle,
//   posterUrl,
//   sessionId,
//   appUrl,
//   unsubscribeUrl,
// }: WelcomeEmailParams): string {
//   const posterBlock = posterUrl
//     ? `<div style="text-align: center; margin: 16px 0;">
//          <img src="${posterUrl}" alt="${movieTitle}" style="max-width: 100%; height: auto; border-radius: 8px; display: block; margin: 0 auto;">
//        </div>`
//     : "";

//   return `<!DOCTYPE html>
// <html lang="pt">
// <head>
//   <meta charset="utf-8">
//   <meta name="viewport" content="width=device-width, initial-scale=1.0">
//   <style>
//     body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f4f4f5; color: #18181b; margin: 0; padding: 20px; }
//     .card { background-color: #ffffff; border-radius: 8px; padding: 24px; max-width: 500px; margin: 0 auto; border: 1px solid #e4e4e7; }
//     .title { color: #09090b; font-size: 20px; font-weight: 700; margin-bottom: 12px; }
//     .button { background-color: #e50914; color: #ffffff !important; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: 600; margin-top: 16px; }
//     .footer { text-align: center; font-size: 12px; color: #71717a; margin-top: 24px; }
//     .footer a { color: #71717a; }
//     .preheader { display: none; max-height: 0; overflow: hidden; }
//   </style>
// </head>
// <body>
//   <div class="preheader">A pré-venda de ${movieTitle} já abriu — garante já o teu bilhete.</div>
//   <div class="card">
//     <h2 class="title">Olá, ${name}!</h2>
//     <p>A pré-venda para o filme <strong>${movieTitle}</strong> já está oficialmente aberta no cineize.</p>
//     ${posterBlock}
//     <p>Garante o teu bilhete antes que os lugares esgotem.</p>
//     <div style="text-align: center;">
//       <a href="${appUrl}/sessions/${sessionId}" class="button">Comprar Bilhete Agora</a>
//     </div>
//   </div>
//   <div class="footer">
//     <p>Recebeste este e-mail porque te inscreveste na lista de pré-venda do cineize.</p>
//     <p><a href="${unsubscribeUrl}">Cancelar inscrição</a></p>
//   </div>
// </body>
// </html>`;
// }

// // ═══════════════════════════════════════════════════════════════════
// // TASK: Enviar Notificações de Pré-Venda
// // ═══════════════════════════════════════════════════════════════════
// export const presaleNotificationsTask = client.defineJob({
//   id: "presale-notifications",
//   name: "Notificações de Pré-Venda - cineize",
//   version: "1.0.0",
//   trigger: eventTrigger({
//     name: "movie.presale.opened",
//     schema: {
//       movieId: { type: "string" as const },
//       sessionId: { type: "string" as const },
//       saleOpensAt: { type: "string" as const },
//     },
//   }),

//   run: async (payload: MoviePresaleOpenedPayload) => {
//     // ═════════════════════════════════════════════════════════════════
//     // CÁLCULOS DE DELAY (Replicando o teu NestJS)
//     // ═════════════════════════════════════════════════════════════════
//     const saleOpensAtDate =
//       payload.saleOpensAt instanceof Date
//         ? payload.saleOpensAt
//         : new Date(payload.saleOpensAt);

//     const nowMs = Date.now();
//     const targetMs = saleOpensAtDate.getTime();
//     const delay = Math.max(0, targetMs - nowMs);

//     const secondsRemaining = Math.floor(delay / 1000);
//     const minutesRemaining = (secondsRemaining / 60).toFixed(2);
//     const hoursRemaining = (secondsRemaining / 3600).toFixed(2);
//     const expectedExecutionDate = new Date(nowMs + delay);

//     // Formatação para Fuso Horário Local (Africa/Luanda)
//     const options: Intl.DateTimeFormatOptions = {
//       timeZone: "Africa/Luanda",
//       year: "numeric",
//       month: "2-digit",
//       day: "2-digit",
//       hour: "2-digit",
//       minute: "2-digit",
//       second: "2-digit",
//       hour12: false,
//     };

//     const nowLocal = new Intl.DateTimeFormat("pt-PT", options).format(
//       new Date(nowMs),
//     );
//     const targetLocal = new Intl.DateTimeFormat("pt-PT", options).format(
//       saleOpensAtDate,
//     );
//     const expectedLocal = new Intl.DateTimeFormat("pt-PT", options).format(
//       expectedExecutionDate,
//     );

//     // ═════════════════════════════════════════════════════════════════
//     // LOGS ESTRUTURADOS
//     // ═════════════════════════════════════════════════════════════════
//     logger.log(
//       `=================== 🕒 DEBUG TIME: PRE-SALE EVENT ===================`,
//     );
//     logger.log(
//       `🔹 Evento Recebido para o Filme: ${payload.movieId} | Sessão: ${payload.sessionId}`,
//     );
//     logger.log(
//       `🔹 Horário Atual (UTC):    ${new Date(nowMs).toISOString()} | Local: ${nowLocal}`,
//     );
//     logger.log(
//       `🔹 Horário Alvo (UTC):     ${saleOpensAtDate.toISOString()} | Local: ${targetLocal}`,
//     );
//     logger.log(
//       `---------------------------------------------------------------------`,
//     );
//     logger.log(`⏱️ Timestamps Raw (ms):   Agora=${nowMs} | Alvo=${targetMs}`);
//     logger.log(`⏱️ Delay Total Calculado: ${delay} ms`);
//     logger.log(
//       `⏳ Tempo Restante:        ${secondsRemaining} seg (~${minutesRemaining} min / ~${hoursRemaining}h)`,
//     );
//     logger.log(
//       `🚀 Disparo Agendado Para: ${expectedExecutionDate.toISOString()} | Local: ${expectedLocal}`,
//     );

//     if (delay === 0) {
//       logger.warn(
//         `⚠️ ATENÇÃO: O delay foi zerado! A data target já passou ou é o momento atual.`,
//       );
//     }

//     logger.log(
//       `=====================================================================`,
//     );

//     // ═════════════════════════════════════════════════════════════════
//     // SE NÃO HÁ DELAY, EXECUTA IMEDIATAMENTE
//     // SE HÁ DELAY, TRIGGER.DEV AGENDA AUTOMATICAMENTE
//     // ═════════════════════════════════════════════════════════════════

//     if (delay > 0) {
//       logger.log(
//         `⏳ Job agendado para ${delay}ms no futuro. Trigger.dev vai executar automaticamente.`,
//       );
//       return { scheduled: true, executeAt: expectedExecutionDate };
//     }

//     // ═════════════════════════════════════════════════════════════════
//     // BUSCA SUBSCRITORES
//     // ═════════════════════════════════════════════════════════════════
//     logger.log(`📍 A processar abertura de pré-venda agora!`);

//     try {
//       const subscribers = await prisma.presaleSubscription.findMany({
//         where: {
//           movieId: payload.movieId,
//           notifiedAt: null,
//         },
//         include: {
//           movie: {
//             select: {
//               title: true,
//               posterUrl: true,
//             },
//           },
//         },
//       });

//       if (subscribers.length === 0) {
//         logger.log(
//           `ℹ️ Nenhum subscritor pendente encontrado para o filme ${payload.movieId}.`,
//         );
//         return { notifiedCount: 0, sentEmails: 0, failedEmails: 0 };
//       }

//       const emailSubscribers = subscribers.filter(
//         (sub): sub is typeof sub & { email: string } => sub.email != null,
//       );

//       logger.log(
//         `🔥 Pré-venda aberta! Notificando ${subscribers.length} subscritores (${emailSubscribers.length} via e-mail):`,
//       );

//       const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

//       // ═════════════════════════════════════════════════════════════════
//       // ENVIAR EMAILS (com tratamento de erros)
//       // ═════════════════════════════════════════════════════════════════
//       const emailPromises = emailSubscribers.map(async (sub) => {
//         const name = sub.email.split("@")[0];
//         const movieTitle = sub.movie?.title ?? "o teu filme";
//         const unsubscribeUrl = `${appUrl}/unsubscribe?email=${encodeURIComponent(
//           sub.email,
//         )}`;

//         logger.debug(`📧 Email: ${sub.email}`);

//         try {
//           await resend.emails.send({
//             from: "noreply@cineize.ao",
//             to: sub.email,
//             subject: `A pré-venda abriu para: ${movieTitle}`,
//             html: renderWelcomeEmail({
//               name,
//               movieTitle,
//               posterUrl: sub.movie?.posterUrl,
//               sessionId: payload.sessionId,
//               appUrl,
//               unsubscribeUrl,
//             }),
//             headers: {
//               "List-Unsubscribe": `<${unsubscribeUrl}>`,
//               "List-Unsubscribe-Post": "List-Unsubscribe=One-Click",
//             },
//           });

//           return { success: true, email: sub.email };
//         } catch (error) {
//           logger.error(`❌ Falha ao enviar email para ${sub.email}:`, error);
//           return { success: false, email: sub.email, error };
//         }
//       });

//       const emailResults = await Promise.allSettled(emailPromises);

//       const successfulEmails = emailResults.filter(
//         (res) => res.status === "fulfilled" && res.value?.success,
//       ).length;
//       const failedEmails = emailResults.filter(
//         (res) => res.status === "rejected" || !res.value?.success,
//       ).length;

//       logger.log(
//         `✉️ Envios concluídos: ${successfulEmails} com sucesso | ${failedEmails} falhas.`,
//       );

//       // ═════════════════════════════════════════════════════════════════
//       // MARCAR COMO NOTIFICADOS
//       // ═════════════════════════════════════════════════════════════════
//       await prisma.presaleSubscription.updateMany({
//         where: {
//           id: { in: subscribers.map((s) => s.id) },
//         },
//         data: {
//           notifiedAt: new Date(),
//         },
//       });

//       logger.log(
//         `✅ ${subscribers.length} subscritores marcados como notificados.`,
//       );

//       return {
//         notifiedCount: subscribers.length,
//         sentEmails: successfulEmails,
//         failedEmails,
//       };
//     } catch (error) {
//       logger.error(`❌ Pau ao processar presale notifications:`, error);
//       throw error; // Trigger.dev vai fazer retry automático
//     }
//   },
// });
