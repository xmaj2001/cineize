import { Suspense } from "react";
import Link from "next/link";
import { getDictionary } from "@/app/lib/dictionaries";
import { ComingSoonSkeleton } from "./coming-soon/coming-soon-skeleton";
import { ComingSoonContent } from "./coming-soon/coming-soon-content";

interface ComingSoonSectionProps {
  lang?: string;
}

export async function ComingSoonSection({
  lang = "pt",
}: ComingSoonSectionProps) {
  const dict = await getDictionary(lang);

  return (
    <section className="border-t border-border/40 pt-6">
      {/* Cabeçalho da Secção (Carregamento instantâneo) */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
          <h2 className="text-xl md:text-2xl font-extrabold text-foreground tracking-tight">
            {dict.feeds.coming_soon}
          </h2>
        </div>
        <Link
          href={`/${lang}/movies?status=coming-soon`}
          className="text-xs font-bold text-muted-foreground hover:text-foreground transition-colors uppercase tracking-wider"
        >
          {dict.feeds.view_all}
        </Link>
      </div>

      {/* Conteúdo Assíncrono com Fallback Skeleton */}
      <Suspense fallback={<ComingSoonSkeleton />}>
        <ComingSoonContent lang={lang} />
      </Suspense>
    </section>
  );
}