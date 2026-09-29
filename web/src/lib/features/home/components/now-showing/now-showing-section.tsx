import { Suspense } from "react";
import Link from "next/link";
import { getDictionary } from "@/app/lib/dictionaries";
import { NowShowingContent } from "./now-showing-content";
import { NowShowingSkeleton } from "./now-showing-skeleton";

interface NowShowingSectionProps {
  lang?: string;
}

export async function NowShowingSection({
  lang = "pt",
}: NowShowingSectionProps) {
  const dict = await getDictionary(lang);

  return (
    <section>
      {/* Cabeçalho da Secção (Carregamento instantâneo) */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          <h2 className="text-xl md:text-2xl font-extrabold text-foreground tracking-tight">
            {dict.feeds.now_showing}
          </h2>
        </div>
        <Link
          href={`/${lang}/movies?status=now-showing`}
          className="text-xs font-bold text-muted-foreground hover:text-foreground transition-colors uppercase tracking-wider"
        >
          {dict.feeds.view_all}
        </Link>
      </div>

      {/* Conteúdo Assíncrono com Fallback Skeleton */}
      <Suspense fallback={<NowShowingSkeleton />}>
        <NowShowingContent lang={lang} />
      </Suspense>
    </section>
  );
}
