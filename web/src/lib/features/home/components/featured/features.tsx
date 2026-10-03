import { Suspense } from "react";
import { getDictionary } from "@/app/lib/dictionaries";
import { FeaturesContent } from "./features-content";
import { FeaturesHeroSkeleton } from "./features-hero-skeleton";

interface FeaturesHeroProps {
  lang?: string;
}

export async function FeaturesHero({ lang = "pt" }: FeaturesHeroProps) {
  const dict = getDictionary(lang);

  return (
    <Suspense fallback={<FeaturesHeroSkeleton />}>
      <FeaturesContent lang={lang} dict={dict} />
    </Suspense>
  );
}
