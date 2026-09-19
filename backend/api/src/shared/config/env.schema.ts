import { z } from "zod";

export const envSchema = z.object({
  // Server Configuration
  PORT: z.coerce.number().default(5000),

  // Databases & Cache
  DATABASE_URL: z.string(),
  DB_USER: z.string().min(1),
  DB_NAME: z.string().min(1),
  DB_PASSWORD: z.string().min(1),
  REDIS_URL: z.string(),

  // Better Auth Configuration
  BETTER_AUTH_URL: z.string().url(),
  BETTER_AUTH_SECRET: z
    .string()
    .min(32, "BETTER_AUTH_SECRET deve ter no mínimo 32 caracteres"),

  // OAuth Providers (Google)
  GOOGLE_CLIENT_ID: z.string().min(1, "GOOGLE_CLIENT_ID é obrigatório"),
  GOOGLE_CLIENT_SECRET: z.string().min(1, "GOOGLE_CLIENT_SECRET é obrigatório"),
});

export type Env = z.infer<typeof envSchema>;

export function validateEnv(config: Record<string, unknown>) {
  const result = envSchema.safeParse(config);

  if (!result.success) {
    console.error(
      "❌ [CONFIG ERROR] Variáveis de ambiente inválidas ou em falta:",
    );
    console.error(JSON.stringify(result.error.format(), null, 2));
    throw new Error("Falha ao validar as variáveis de ambiente.");
  }

  return result.data;
}
