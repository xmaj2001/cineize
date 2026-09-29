import { Suspense } from "react";
import { Dictionary } from "@/app/lib/dictionaries";
import { SessionDetailSkeleton } from "./detail/SessionDetailSkeleton";
import { SessionContentDetails } from "./detail/SessionContentDetails";

interface SessionDetailsProps {
  lang: string;
  dict: Dictionary;
  sessionId: string;
}

export function SessionDetails({ lang, dict, sessionId }: SessionDetailsProps) {
  return (
    <Suspense fallback={<SessionDetailSkeleton />}>
      <SessionContentDetails lang={lang} dict={dict} sessionId={sessionId} />
    </Suspense>
  );
}
