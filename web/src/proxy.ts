import { NextRequest, NextResponse } from "next/server";

const locales = ["en", "pt"];
const defaultLocale = "pt";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const pathnameHasLocale = locales.some(
    (locale) =>
      pathname === `/${locale}` ||
      pathname.startsWith(`/${locale}/`)
  );

  if (pathnameHasLocale) {
    return NextResponse.next();
  }

  const locale = defaultLocale;

  request.nextUrl.pathname = `/${locale}${pathname}`;

  return NextResponse.redirect(request.nextUrl);
}

export const config = {
   matcher: ["/((?!_next|api|favicon.ico|.*\\..*).*)"],
};