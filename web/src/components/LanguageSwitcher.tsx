"use client";

import Link from "next/link";

export function LanguageSwitcher({
  currentLocale,
}: {
  currentLocale: "pt" | "en";
}) {
  const otherLocale = currentLocale === "pt" ? "en" : "pt";

  return (
    <Link href={`/${otherLocale}`}>
      {otherLocale === "pt" ? "Português" : "English"}
    </Link>
  );
}