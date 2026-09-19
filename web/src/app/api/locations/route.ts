import { ok, handleError } from "@/lib/api/response";
import { prisma } from "@/lib/prisma";

// ── GET /api/locations ─────────────────────────────────────────────────────────

/**
 * Lista todos os cinemas/localizações disponíveis.
 * Sem filtros — devolve sempre a lista completa ordenada por nome.
 */
export async function GET() {
  try {
    const locations = await prisma.location.findMany({
      orderBy: { name: "asc" },
      select: {
        id: true,
        name: true,
        province: true,
        city: true,
        latitude: true,
        longitude: true,
        address: true,
        phone: true,
      },
    });

    return ok(locations);
  } catch (error) {
    return handleError(error);
  }
}
