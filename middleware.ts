import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const LOCALES = ["ko", "en"] as const;
type Locale = (typeof LOCALES)[number];

function preferredLocale(header: string | null): Locale {
  if (!header) return "en";

  const ranked = header
    .split(",")
    .map((part) => {
      const [tagRaw, ...params] = part.trim().split(";");
      const qParam = params.find((param) => param.trim().startsWith("q="));
      const q = qParam ? Number(qParam.trim().slice(2)) : 1;
      return {
        tag: tagRaw.toLowerCase(),
        q: Number.isFinite(q) ? q : 0,
      };
    })
    .sort((a, b) => b.q - a.q);

  for (const item of ranked) {
    if (item.tag.startsWith("ko")) return "ko";
    if (item.tag.startsWith("en")) return "en";
  }

  return "en";
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (LOCALES.some((locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`))) {
    return NextResponse.next();
  }

  const locale = preferredLocale(request.headers.get("accept-language"));
  const url = request.nextUrl.clone();
  url.pathname = pathname === "/" ? `/${locale}` : `/${locale}${pathname}`;
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|icon.svg|textures|.*\\..*).*)"],
};
