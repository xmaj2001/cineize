import { type NextRequest } from "next/server";
import { ok, err, handleError } from "@/lib/api/response";
import { prisma } from "@/lib/prisma";
import { createPresaleSchema } from "@/lib/schemas/presale.schema";

// ── POST /api/presale-subscriptions/[movieId] ──────────────────────────────────

/**
 * Subscrever notificações de pré-venda de um filme.
 *
 * Body (JSON):
 *   { email?: string, whatsapp?: string }
 *   (pelo menos um é obrigatório)
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ movieId: string }> },
) {
  try {
    const { movieId } = await params;

    // Validar body com Zod
    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return err("Body JSON inválido", 400);
    }

    const parsed = createPresaleSchema.safeParse(body);
    if (!parsed.success) {
      const firstError = parsed.error.errors[0];
      return err(firstError?.message ?? "Dados inválidos", 400);
    }

    const { email, whatsapp } = parsed.data;

    // Verificar se o filme existe
    const movie = await prisma.movie.findUnique({
      where: { id: movieId },
      select: { id: true },
    });

    if (!movie) {
      return err("Filme não encontrado.", 404);
    }

    // Verificar subscrição duplicada
    const existing = await prisma.presaleSubscription.findFirst({
      where: {
        movieId,
        OR: [
          ...(email ? [{ email }] : []),
          ...(whatsapp ? [{ whatsapp }] : []),
        ],
      },
    });

    if (existing) {
      const campo = existing.email === email ? "email" : "número de WhatsApp";
      return err(`Este ${campo} já está inscrito para este filme.`, 409);
    }

    // Criar subscrição
    const subscription = await prisma.presaleSubscription.create({
      data: { movieId, email, whatsapp },
    });

    return ok(subscription, 201);
  } catch (error) {
    return handleError(error);
  }
}
