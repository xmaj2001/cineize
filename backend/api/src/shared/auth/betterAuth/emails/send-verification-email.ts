// import { SendEmailPort } from 'src/shared/ports/send-email-port';

// export function sendVerificationEmail(emailPort: SendEmailPort) {
//   return async ({
//     user,
//     url,
//   }: {
//     user: { name: string; email: string };
//     url: string;
//   }) => {
//     await emailPort.send({
//       to: user.email,
//       subject: 'Verifica o teu email',
//       html: `<p>Olá ${user.name}! <a href="${url}">Verificar conta</a></p>`,
//     });
//   };
// }
