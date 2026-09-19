import { type NextRequest } from "next/server";
import { ok, err, handleError } from "@/lib/api/response";
import { prisma } from "@/lib/prisma";

// ── GET /api/locations/[id] ────────────────────────────────────────────────────

/**
 * Detalhes de uma localização específica, incluindo as suas salas.
 */
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    const location = await prisma.location.findUnique({
      where: { id },
      include: {
        rooms: {
          select: {
            id: true,
            name: true,
            capacity: true,
            format: true,
          },
          orderBy: { name: "asc" },
        },
      },
    });

    if (!location) {
      return err("Localização não encontrada", 404);
    }

    return ok(location);
  } catch (error) {
    return handleError(error);
  }
}
