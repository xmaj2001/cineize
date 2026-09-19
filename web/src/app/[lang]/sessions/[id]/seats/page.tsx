import { sessionService } from "@/lib/features/sessions";
import { Metadata } from "next";
import NotFound from "../../../not-found";
import { SeatMap } from "@/components/sessions/SeatMap";

interface SeatsPageProps {
  params: Promise<{ lang: string; id: string }>;
}

export async function generateMetadata({
  params,
}: SeatsPageProps): Promise<Metadata> {
  const { id } = await params;
  const res = await sessionService.getSessionById(id);
  if (!res || !res.success)
    return { title: "Sessão não encontrada - cineIze Angola" };
  const session = res.data;

  return {
    title: `Escolher Assentos — ${session.movie.title} - cineIze Angola`,
    description: `Escolha os seus lugares para a sessão de ${session.movie.title}.`,
  };
}

export default async function SeatsPage({ params }: SeatsPageProps) {
  const { id } = await params;
  const res = await sessionService.getSessionById(id);
  if (!res || !res.success) return NotFound();
  const session = res.data;

  return (
    <div className="flex flex-col min-h-screen bg-background py-4 mt-16">
      <SeatMap session={session} />
    </div>
  );
}
