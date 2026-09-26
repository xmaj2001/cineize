import { PrismaPg } from "@prisma/adapter-pg";
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { bearer, oneTap } from "better-auth/plugins";
import { PrismaClient } from "src/generated/prisma/client";

const plugins: any[] = [bearer(), oneTap()];

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }),
});

function createAuthConfig() {
  return {
    database: prismaAdapter(prisma, { provider: "postgresql" }),
    plugins,

    // 🔑 CONFIGURAÇÃO DE SESSÃO (IMPORTANTE!)
    session: {
      updateAge: 60 * 60 * 24, // Update session every 24h
      absoluteLifetime: 60 * 60 * 24 * 30, // Session expires after 30 days
      cookieCache: {
        enabled: true,
        maxAge: 5 * 60, // cache por 5 minutos
      },
    },

    // 🔑 CONFIGURAÇÃO DE COOKIES (ISTO É O CRÍTICO!)
    cookie: {
      name: "better-auth.session_token",
      path: "/", // ← TUDO! Antes era restritivo
      domain: undefined, // usa o domain atual (localhost / seu domain)
      sameSite: "lax", // permite cookies em cross-path requests
      secure: process.env.NODE_ENV === "production", // só HTTPS em prod
      httpOnly: true, // JavaScript não pode acessar (segurança)
      maxAge: 60 * 60 * 24 * 30, // 30 dias
    },

    emailAndPassword: {
      enabled: true,
      revokeSessionsOnPasswordReset: true,
    },

    trustedOrigins: [
      "http://localhost:3000",
      "http://localhost:5000", // ← adiciona também o backend
    ],

    socialProviders: {
      google: {
        clientId: process.env.GOOGLE_CLIENT_ID as string,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      },
    },
  };
}

export function createBetterAuth() {
  return betterAuth(createAuthConfig());
}

export const authServer = betterAuth(createAuthConfig());
