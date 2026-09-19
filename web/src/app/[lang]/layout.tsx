import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { getDictionary, Locale } from "../lib/dictionaries";
import { ThemeProvider } from "@/components/theme-provider";
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { QueryProvider } from "@/components/providers/query-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: Locale }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const dict = getDictionary(lang);
  return {
    title: dict.meta.title,
    description: dict.meta.description,
    icons: {
      icon: "/favicon.svg",
    },
    metadataBase: new URL("https://www.cinema.co.ao"),
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
      },
    },
    openGraph: {
      title: dict.meta.title,
      description: dict.meta.description,
      url: "https://www.cinema.co.ao",
      siteName: "cineIze Angola",
      images: [
        {
          url: "/banner.png",
          width: 1200,
          height: 630,
          alt: "cineIze Angola",
        },
      ],
      locale: lang,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: dict.meta.title,
      description: dict.meta.description,
      images: ["/banner.png"],
    },
  };
}

export default async function RootLayout({
  children,
  params,
}: LayoutProps<"/[lang]">) {
  const { lang } = await params;
  const dict = getDictionary(lang);
  return (
    <html
      lang={lang}
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <QueryProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
            <div className="min-h-screen bg-background pb-16 lg:pb-0">
              <Navbar />
              {children}
              <Footer dict={dict} />
            </div>
          </ThemeProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
