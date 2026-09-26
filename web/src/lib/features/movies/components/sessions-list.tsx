import { Suspense } from "react";
import { SessionsContent } from "./Sessions/sessions-content";

interface SessionsListProps {
  slug: string;
  dict: any;
  lang: string;
}

export function SessionsList({ slug, dict, lang }: SessionsListProps) {
  return (
    <Suspense fallback="Loading sessions...">
      <SessionsContent slug={slug} dict={dict} lang={lang} />
    </Suspense>
  );
}
