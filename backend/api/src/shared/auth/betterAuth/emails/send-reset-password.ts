// import { SendEmailPort } from 'src/shared/ports/send-email-port';

// export function sendResetPassword(emailPort: SendEmailPort) {
//   return async ({
//     user,
//     url,
//   }: {
//     user: { name: string; email: string };
//     url: string;
//   }) => {
//     await emailPort.send({
//       to: user.email,
//       subject: 'Repõe a tua password',
//       html: `<p>Olá ${user.name}! <a href="${url}">Repor password</a></p>`,
//     });
//   };
// }
