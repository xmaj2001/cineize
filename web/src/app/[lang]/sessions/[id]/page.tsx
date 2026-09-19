import { sessionService } from "@/lib/features/sessions";
import { Metadata } from "next";
import NotFound from "../../not-found";
import { HeaderSession } from "@/components/sessions/HeaderSession";
import { JsonLd } from "@/components/JsonLd";

interface SessionPageProps {
  params: Promise<{ lang: string; id: string }>;
}

export async function generateMetadata({
  params,
}: SessionPageProps): Promise<Metadata> {
  const { id } = await params;
  const res = await sessionService.getSessionById(id);
  if (!res || !res.success)
    return { title: "Sessão não encontrada - cineIze Angola" };
  const session = res.data;
  const startDate = new Date(session.startTime);
  const dateStr = startDate.toLocaleDateString("pt-PT", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
  const timeStr = startDate.toLocaleTimeString("pt-PT", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return {
    title: `${session.movie.title} — ${dateStr} às ${timeStr} - cineIze Angola`,
    description: `Sessão de ${session.movie.title} na sala ${session.room.name} do ${session.room.location.name}. Reserve o seu lugar já!`,
    openGraph: {
      title: `${session.movie.title} — ${dateStr} às ${timeStr}`,
      description: `Sessão no ${session.room.location.name}, ${session.room.location.city}.`,
      images: [session.movie.posterUrl],
    },
  };
}

export default async function SessionPage({ params }: SessionPageProps) {
  const { lang, id } = await params;
  const res = await sessionService.getSessionById(id);
  if (!res || !res.success) return NotFound();
  const session = res.data;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ScreeningEvent",
    name: `${session.movie.title} - Sessão em ${session.room.location.name}`,
    description: `Sessão de cinema para o filme ${session.movie.title} no ${session.room.location.name}.`,
    image: session.movie.posterUrl,
    startDate: session.startTime,
    endDate: session.endTime,
    location: {
      "@type": "MovieTheater",
      name: session.room.location.name,
      address: {
        "@type": "PostalAddress",
        addressLocality: session.room.location.city,
        addressCountry: "AO",
      },
    },
    workPresented: {
      "@type": "Movie",
      name: session.movie.title,
      image: session.movie.posterUrl,
    },
    offers: {
      "@type": "Offer",
      price: session.price / 100,
      priceCurrency: "AOA",
      availability: "https://schema.org/InStock",
      validFrom: session.saleOpensAt,
      url: `https://www.cineize.co.ao/${lang}/sessions/${id}`,
    },
  };

  return (
    <>
      <JsonLd data={jsonLd} />
      <HeaderSession lang={lang} session={session} />
    </>
  );
}
