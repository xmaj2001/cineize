// import { TriggerClient } from "@trigger.dev/sdk";

// export const client = new TriggerClient({
//   id: "cineize",
//   apiKey: process.env.TRIGGER_API_KEY,
//   apiUrl: process.env.TRIGGER_API_URL,
// });

// // Definir uma tarefa
// client.defineJob({
//   id: "send-presale-email",
//   name: "Send Presale Email",
//   version: "1.0.0",
//   trigger: io.events.event({
//     name: "movie.presale.opened",
//   }),
//   run: async (payload, io, ctx) => {
//     const { movieId, sessionId, saleOpensAt } = payload;

//     const subscribers = await prisma.presaleSubscription.findMany({
//       where: { movieId, notifiedAt: null },
//     });

//     for (const sub of subscribers) {
//       await sendEmail({
//         to: sub.email,
//         subject: `Pré-venda aberta!`,
//         movieTitle: "...",
//         sessionId,
//       });
//     }

//     return { notified: subscribers.length };
//   },
// });
