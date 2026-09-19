// import { SendEmailPort } from 'src/shared/ports/send-email-port';

// export function onExistingUserSignUp(emailPort: SendEmailPort) {
//   return async ({ user }: { user: { name: string; email: string } }) => {
//     await emailPort.send({
//       to: user.email,
//       subject: 'Tentativa de registo com o teu email',
//       html: `<p>Olá ${user.name}! Alguém tentou criar uma conta com o teu email. Se não foste tu, ignora este email.</p>`,
//     });
//   };
// }
