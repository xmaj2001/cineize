import { getDictionary, Locale } from "@/app/lib/dictionaries";
import { ComingSoonSection } from "@/components/feeds/ComingSoonSection";
import { NowShowingSection } from "@/components/feeds/NowShowingSection";
import { PreSaleSection } from "@/components/feeds/PreSaleSection";
import { JsonLd } from "@/components/JsonLd";
import { Hero } from "@/components/movies/Hero";
import { movieService } from "@/lib/features/moviesss";
import { Metadata } from "next";

interface pageProps {
  params: Promise<{ lang: Locale }>;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const dict = getDictionary(lang as Locale);
  return {
    title: dict.meta.title,
    description: dict.meta.description,
    openGraph: {
      title: dict.meta.title,
      description: dict.meta.description,
      url: "https://www.cinema.co.ao",
      type: "website",
    },
    alternates: {
      canonical: "https://www.cinema.co.ao",
      languages: {
        "pt-AO": "/pt",
        "en-US": "/en",
      },
    },
  };
}

export default async function Home({ params }: pageProps) {
  const { lang } = await params;
  const dict = getDictionary(lang as Locale);
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": "https://www.cineize.co.ao/#website",
        url: "https://www.cineize.co.ao",
        name: "cineIze Angola",
        description: dict.meta.description,
        potentialAction: {
          "@type": "SearchAction",
          target:
            "https://www.cineize.co.ao/pt/movies?search={search_term_string}",
          "query-input": "required name=search_term_string",
        },
      },
      {
        "@type": "Organization",
        "@id": "https://www.cineize.co.ao/#organization",
        name: "cineIze Angola",
        url: "https://www.cineize.co.ao",
        logo: "https://www.cineize.co.ao/logo.png",
        sameAs: [
          "https://facebook.com/cineizeangola",
          "https://instagram.com/cineizeangola",
        ],
      },
    ],
  };

  const feeds = await movieService.getHomeFeed();
  return (
    <>
      <JsonLd data={jsonLd} />
      <Hero movies={feeds.data.featured} />
      <div className="px-4 py-8 md:px-8 max-w-7xl mx-auto flex flex-col gap-10">
        <NowShowingSection lang={lang} movies={feeds.data.nowShowing} />
        <PreSaleSection lang={lang} movies={feeds.data.presale} />
        <ComingSoonSection lang={lang} movies={feeds.data.comingSoon} />
      </div>
    </>
  );
}
