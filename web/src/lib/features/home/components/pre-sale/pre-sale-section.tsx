import { Suspense } from "react";
import Link from "next/link";
import { getDictionary } from "@/app/lib/dictionaries";
import { PreSaleContent } from "./pre-sale-content";
import { PreSaleSkeleton } from "./pre-sale-skeleton";

interface PreSaleSectionProps {
  lang?: string;
}

export async function PreSaleSection({ lang = "pt" }: PreSaleSectionProps) {
  const dict = await getDictionary(lang);

  return (
    <section className="border-t border-border/40 pt-6">
      {/* Cabeçalho da Secção */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
          <h2 className="text-xl md:text-2xl font-extrabold text-foreground tracking-tight">
            {dict.feeds.pre_sale}
          </h2>
        </div>
        <Link
          href={`/${lang}/movies?status=presale`}
          className="text-xs font-bold text-muted-foreground hover:text-foreground transition-colors uppercase tracking-wider"
        >
          {dict.feeds.view_all}
        </Link>
      </div>

      {/* Conteúdo Assíncrono com Fallback */}
      <Suspense fallback={<PreSaleSkeleton />}>
        <PreSaleContent lang={lang} />
      </Suspense>
    </section>
  );
}