import { z } from "zod";

/**
 * Espelha o CreatePresaleSubscriptionDto do NestJS backend.
 * Pelo menos um de email ou whatsapp é obrigatório.
 */
export const createPresaleSchema = z
  .object({
    email: z.string().email("Email inválido").optional(),
    whatsapp: z.string().min(6, "WhatsApp inválido").optional(),
  })
  .refine((data) => data.email || data.whatsapp, {
    message: "Deve fornecer pelo menos um email ou whatsapp.",
    path: ["email"],
  });

export type CreatePresaleInput = z.infer<typeof createPresaleSchema>;
