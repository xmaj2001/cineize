"use client";

import * as React from "react";
import { useEffect, useState, useTransition, Suspense } from "react";
import Link from "next/link";
import {
  useRouter,
  useSearchParams,
  useParams,
  usePathname,
} from "next/navigation";
import {
  Search,
  Menu,
  Film,
  MapPin,
  Sparkles,
  CalendarDays,
  Tv,
  X,
} from "lucide-react";

import { cn } from "@/lib/utils";
import Image from "next/image";
import { LanguageToggle } from "./LanguageToggle";
import { getDictionary } from "@/app/lib/dictionaries";

function NavbarContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const params = useParams();
  const pathname = usePathname();
  const lang = (params?.lang as string) || "pt";
  const dict = getDictionary(lang);
  const [, startTransition] = useTransition();

  const [isScrolled, setIsScrolled] = useState(false);
  const [searchVal, setSearchVal] = useState(searchParams.get("search") ?? "");
  const [searchOpen, setSearchOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const timerRef = React.useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSearchChange = (term: string) => {
    setSearchVal(term);
    if (timerRef.current) clearTimeout(timerRef.current);

    timerRef.current = setTimeout(() => {
      const newParams = new URLSearchParams(searchParams.toString());
      if (term) {
        newParams.set("search", term);
      } else {
        newParams.delete("search");
      }

      startTransition(() => {
        router.push(`/${lang}/movies?${newParams.toString()}`);
      });
    }, 400);
  };

  // Links Principais da Navegação
  const navLinks = [
    {
      href: `/${lang}/movies`,
      label: dict.nav?.movies || "Filmes",
      icon: Film,
      exact: true,
    },
    {
      href: `/${lang}/movies?status=brevemente`,
      label: dict.nav?.coming_soon || "Lançamentos",
      icon: CalendarDays,
    },
    {
      href: `/${lang}/movies?category=animes`,
      label: "Animes",
      icon: Tv,
      badge: "HOT",
    },
    {
      href: `/${lang}/cinemas`,
      label: dict.nav?.cinemas || "Cinemas",
      icon: MapPin,
    },
    {
      href: `/${lang}/experiencias`,
      label: "Preços & VIP",
      icon: Sparkles,
    },
  ];

  const isActiveLink = (href: string, exact = false) => {
    if (exact) return pathname === href;
    return pathname.startsWith(href.split("?")[0]);
  };

  return (
    <header
      className={`fixed top-0 z-50 w-full transition-all duration-300 ${
        isScrolled
          ? "bg-background/90 backdrop-blur-md shadow-md border-b border-border/40 py-2"
          : "bg-gradient-to-b from-background via-background/60 to-transparent py-3"
      }`}
    >
      <div className="mx-auto flex items-center justify-between px-4 sm:px-6 w-full max-w-7xl gap-4">
        
        {/* Lado Esquerdo: Hamburger Mobile + Logo */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMenuOpen(true)}
            className="lg:hidden p-2 -ml-2 text-foreground hover:bg-muted/80 rounded-full transition-colors"
            aria-label="Abrir Menu"
          >
            <Menu className="h-6 w-6" />
          </button>

          <Link
            href={`/${lang}`}
            className="flex items-center gap-2 shrink-0 transition-transform hover:scale-[1.02]"
          >
            <Image
              src="/logo.png"
              alt="CineIze"
              width={32}
              height={32}
              className="object-contain"
            />
            <span className="font-display font-black text-xl tracking-wider text-foreground">
              CINEIZE
            </span>
          </Link>
        </div>

        {/* Centro: Links Limpos no Desktop */}
        <nav className="hidden lg:flex items-center gap-1 ">
          {navLinks.map((link) => {
            const active = isActiveLink(link.href, link.exact);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "relative flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-mono font-medium transition-all duration-200",
                  false
                    ? "bg-primary text-primary-foreground font-semibold shadow-sm"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                )}
              >
                <span>{link.label}</span>
                {/* {link.badge && (
                  <span className="bg-amber-500/20 text-amber-500 border border-amber-500/30 text-[9px] font-bold px-1.5 py-0.2 rounded-full uppercase">
                    {link.badge}
                  </span>
                )} */}
              </Link>
            );
          })}
        </nav>

        {/* Lado Direito: Pesquisa + Idioma */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Campo de Pesquisa no Desktop */}
          <div className="relative hidden md:block w-48 lg:w-56">
            <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              value={searchVal}
              onChange={(e) => handleSearchChange(e.target.value)}
              placeholder={dict.nav?.search_placeholder || "Buscar filme..."}
              className="h-8 w-full rounded-full border border-border/60 bg-muted/40 pl-8 pr-3 text-xs outline-none focus:border-primary focus:bg-background transition-all placeholder:text-muted-foreground/70"
            />
          </div>

          {/* Botão de Pesquisa (Mobile) */}
          <button
            onClick={() => setSearchOpen(true)}
            className="md:hidden p-2 rounded-full hover:bg-muted text-foreground transition-colors"
          >
            <Search className="h-5 w-5" />
          </button>

          {/* Seletor de Idioma */}
          <LanguageToggle />
        </div>

      </div>
        <div className="dot-divider" />

      {/* ── Search Drawer Mobile ── */}
      {searchOpen && (
        <div
          className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm md:hidden"
          onClick={() => setSearchOpen(false)}
        />
      )}
      <aside
        className={cn(
          "fixed inset-y-0 right-0 z-[70] w-full max-w-xs bg-background border-l border-border shadow-2xl transition-transform duration-300 ease-in-out md:hidden flex flex-col p-6",
          searchOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-bold text-base text-foreground">
            {dict.nav?.search_title || "Pesquisar Filmes"}
          </h3>
          <button
            onClick={() => setSearchOpen(false)}
            className="p-1.5 bg-muted rounded-full text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            autoFocus
            type="text"
            value={searchVal}
            onChange={(e) => handleSearchChange(e.target.value)}
            placeholder="Nome do filme, ator..."
            className="h-10 w-full rounded-xl border border-border bg-muted/40 pl-9 pr-4 text-sm text-foreground outline-none focus:border-primary"
          />
        </div>
      </aside>

      {/* ── Menu Lateral Mobile ── */}
      {menuOpen && (
        <div
          className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={() => setMenuOpen(false)}
        />
      )}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-[70] w-full max-w-xs bg-background border-r border-border shadow-2xl transition-transform duration-300 ease-in-out lg:hidden flex flex-col p-6",
          menuOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex items-center justify-between mb-8">
          <Link
            href={`/${lang}`}
            className="flex items-center gap-2"
            onClick={() => setMenuOpen(false)}
          >
            <Image src="/logo.png" alt="CineIze" width={32} height={32} />
            <span className="font-display font-black text-lg tracking-wider text-foreground">
              CINEIZE
            </span>
          </Link>
          <button
            onClick={() => setMenuOpen(false)}
            className="p-1.5 bg-muted rounded-full text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <nav className="flex flex-col gap-2">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const active = isActiveLink(link.href, link.exact);
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className={cn(
                  "flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-colors",
                  active
                    ? "bg-primary text-primary-foreground font-bold"
                    : "text-foreground hover:bg-muted"
                )}
              >
                <div className="flex items-center gap-3">
                  <Icon className="h-4 w-4" />
                  <span>{link.label}</span>
                </div>
                {link.badge && (
                  <span className="bg-amber-500/20 text-amber-500 border border-amber-500/30 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                    {link.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </aside>
    </header>
  );
}

export function Navbar() {
  return (
    <Suspense
      fallback={
        <div className="fixed top-0 left-0 h-16 w-full bg-background/20 backdrop-blur" />
      }
    >
      <NavbarContent />
    </Suspense>
  );
}