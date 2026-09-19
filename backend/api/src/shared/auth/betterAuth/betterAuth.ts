import { PrismaPg } from '@prisma/adapter-pg';
import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { bearer, oneTap } from 'better-auth/plugins';
import { PrismaClient } from 'src/generated/prisma/client';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const plugins: any[] = [bearer(), oneTap()];

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }),
});

export function createBetterAuth() {
  const prisma = new PrismaClient({
    adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }),
  });

  return betterAuth({
    database: prismaAdapter(prisma, { provider: 'postgresql' }),

    plugins,

    emailAndPassword: {
      enabled: true,
      // requireEmailVerification: true,
      revokeSessionsOnPasswordReset: true,
      // sendResetPassword: sendResetPassword(emailPort),
      // onExistingUserSignUp: onExistingUserSignUp(emailPort),
      // onPasswordReset: onPasswordReset(),
    },

    // emailVerification: {
    //   sendVerificationEmail: sendVerificationEmail(emailPort),
    // },

    trustedOrigins: [
      'http://localhost:3000', // ← aceita pedidos do frontend
    ],
    socialProviders: {
      google: {
        clientId: process.env.GOOGLE_CLIENT_ID as string,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      },
    },
  });
}

export const authServer = betterAuth({
  database: prismaAdapter(prisma, { provider: 'postgresql' }),
  plugins,
  emailAndPassword: {
    enabled: true,
    // requireEmailVerification: true,
    revokeSessionsOnPasswordReset: true,
    // sendResetPassword: sendResetPassword(emailPort),
    // onExistingUserSignUp: onExistingUserSignUp(emailPort),
    // onPasswordReset: onPasswordReset(),
  },
  trustedOrigins: [
    'http://localhost:3000', // ← aceita pedidos do frontend
  ],
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    },
  },
});
