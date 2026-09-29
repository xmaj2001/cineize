import { FeedMovieItem } from "../type";
import InfiniteList from "./feeds/InfiniteList";
import { Suspense } from "react";
import { FeedMovieCardSkeleton } from "./feeds/feed-movie-skeleton";
import { getCursorMovies } from "../queries";

interface InfiniteMoviesFeedProps {
  lang: string;
  dict: any;
}

export function InfiniteMoviesFeed({ lang, dict }: InfiniteMoviesFeedProps) {
  return (
    <Suspense fallback={<InfiniteMoviesFeedContentSkeleton />}>
      <InfiniteMoviesFeedContent lang={lang} dict={dict} />
    </Suspense>
  );
}

async function InfiniteMoviesFeedContent({
  lang,
  dict,
}: InfiniteMoviesFeedProps) {
  const res = await getCursorMovies();
  return (
    <InfiniteList
      initialItems={res.data?.items || []}
      initialCursor={res.data?.nextCursor || null}
    />
  );
}

function InfiniteMoviesFeedContentSkeleton() {
  return (
    <div className="space-y-8 w-full">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
        {Array.from({ length: 8 }).map((_, index) => (
          <FeedMovieCardSkeleton key={index} />
        ))}
      </div>
    </div>
  );
}
