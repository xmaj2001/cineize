import Image from "next/image";

interface HeaderMoviePosterProps {
  posterUrl: string;
  title: string;
}

export function HeaderMoviePoster({ posterUrl, title }: HeaderMoviePosterProps) {
  return (
    <div className="hidden md:block relative aspect-2/3 w-full rounded-2xl overflow-hidden shadow-2xl border border-border/40 group">
      <Image
        src={posterUrl}
        alt={`Poster de ${title}`}
        fill
        className="object-cover transition-transform duration-500 group-hover:scale-105"
        sizes="(max-width: 1024px) 260px, 300px"
      />
      <div className="absolute inset-0 bg-linear-to-t from-background/80 via-transparent to-transparent opacity-60" />
    </div>
  );
}