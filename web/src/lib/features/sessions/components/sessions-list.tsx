import { Suspense } from "react";
import { SessionsContent } from "./sessions-content";
import { SessionsGridSkeleton } from "./grid/session-grid-skeleton";

interface SessionsListProps {
  slug: string;
  dict: any;
  lang: string;
}

export function SessionsList({ slug, dict, lang }: SessionsListProps) {
  return (
    <Suspense fallback={<SessionsGridSkeleton />}>
      <SessionsContent slug={slug} dict={dict} lang={lang} />
    </Suspense>
  );
}