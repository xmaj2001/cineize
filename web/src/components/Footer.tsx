"use client";

import Image from "next/image";
import Link from "next/link";
import { Ticket, Film, MapPin, PhoneCall } from "lucide-react";

import { useParams } from "next/navigation";
import { getDictionary } from "@/app/lib/dictionaries";

/* Ícones de redes sociais */
function IconInstagram({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}
function IconFacebook({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  );
}
function IconYoutube({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z" />
      <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" />
    </svg>
  );
}

interface FooterProps {
  dict?: any;
}

export function Footer({ dict: propDict }: FooterProps) {
  const params = useParams();
  const lang = (params?.lang as string) || "pt";
  const dict = propDict || getDictionary(lang);
  const footerDict = dict.footer || getDictionary(lang).footer;

  const columns = [
    {
      title: footerDict.programming,
      links: [
        { label: footerDict.now_showing, href: `/${lang}/movies?status=em-cartaz` },
        { label: footerDict.coming_soon, href: `/${lang}/movies?status=brevemente` },
        { label: footerDict.vip_rooms, href: `/${lang}/experiencias` },
        { label: footerDict.experience_3d, href: `/${lang}/experiencias` },
      ],
    },
    {
      title: footerDict.cinemas_angola,
      links: [
        { label: "Talatona (Luanda)", href: `/${lang}/cinemas/talatona` },
        { label: "Kilamba (Luanda)", href: `/${lang}/cinemas/kilamba` },
        { label: "Nova Vida (Luanda)", href: `/${lang}/cinemas/nova-vida` },
        { label: "Benguela", href: `/${lang}/cinemas/benguela` },
        { label: "Lubango", href: `/${lang}/cinemas/lubango` },
        { label: "Huambo", href: `/${lang}/cinemas/huambo` },
      ],
    },
    {
      title: footerDict.support_info,
      links: [
        { label: footerDict.faq, href: "#" },
        { label: footerDict.terms, href: "#" },
        { label: footerDict.privacy, href: "#" },
        { label: footerDict.rules, href: "#" },
        { label: footerDict.contact, href: "#" },
      ],
    },
  ];

  const bio = dict?.about?.short_bio || footerDict.bio;

  return (
    <footer className="px-2 pb-2 sm:px-3 pt-8">
      <div className="relative rounded-3xl bg-background px-6 py-12 shadow-2xl sm:px-12 overflow-hidden border border-neutral-100/10">
        <div className="mx-auto max-w-7xl relative z-10">
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-12">
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <Image
                  src="/logo.png"
                  alt="Logótipo cineIze"
                  width={40}
                  height={40}
                  className="object-contain"
                />
                <span className="text-2xl font-display font-extrabold tracking-wider text-white">
                  CINEIZE
                </span>
              </div>
              <p className="text-xs leading-relaxed text-neutral-400 max-w-xs">
                {bio}
              </p>

              <div className="mt-1 flex flex-col gap-2">
                <a
                  href="tel:+244923000000"
                  className="inline-flex w-fit items-center gap-2 rounded-full border border-neutral-800 bg-neutral-900 px-3.5 py-1.5 text-xs font-semibold text-neutral-300 transition hover:bg-neutral-800 hover:text-white"
                >
                  <PhoneCall className="h-3.5 w-3.5 text-primary" />
                  {footerDict.customer_support}
                </a>
              </div>

              <div className="flex items-center gap-2.5 mt-2">
                {[
                  {
                    Icon: IconInstagram,
                    label: "Instagram",
                    href: "https://instagram.com",
                  },
                  {
                    Icon: IconFacebook,
                    label: "Facebook",
                    href: "https://facebook.com",
                  },
                  {
                    Icon: IconYoutube,
                    label: "YouTube",
                    href: "https://youtube.com",
                  },
                ].map(({ Icon, label, href }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={label}
                    className="flex h-8 w-8 items-center justify-center rounded-full border border-neutral-800 bg-neutral-900 text-neutral-400 transition-all hover:border-primary hover:text-primary hover:scale-105"
                  >
                    <Icon className="h-4 w-4" />
                  </a>
                ))}
              </div>
            </div>

            {columns.map((col) => (
              <div key={col.title}>
                <h4 className="mb-4 text-xs font-bold uppercase tracking-widest text-primary font-mono">
                  {col.title}
                </h4>
                <ul className="space-y-2.5">
                  {col.links.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="text-xs text-neutral-400 transition-colors hover:text-white"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="mt-12 border-t border-neutral-800/80 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-[11px] text-neutral-500 font-mono">
              © {new Date().getFullYear()} {footerDict.rights}
            </p>

            <div className="flex items-center gap-4 text-[11px] text-neutral-500 font-mono">
              <span>{footerDict.slogan}</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
