import createMiddleware from "next-intl/middleware";
import { NextRequest } from "next/server";
import { routing } from "@/lib/i18n/routing";

const intlMiddleware = createMiddleware(routing);

export default function middleware(request: NextRequest) {
  const hasSavedLocale = request.cookies.has("NEXT_LOCALE");

  // First visit (no cookie): force Spanish regardless of browser language.
  // Returning visit (has cookie): next-intl reads the cookie automatically.
  if (!hasSavedLocale) {
    const headers = new Headers(request.headers);
    headers.set("Accept-Language", "es");
    const modifiedRequest = new NextRequest(request.url, {
      headers,
    });
    for (const cookie of request.cookies.getAll()) {
      modifiedRequest.cookies.set(cookie.name, cookie.value);
    }
    return intlMiddleware(modifiedRequest);
  }

  return intlMiddleware(request);
}

export const config = {
  matcher: [
    "/",
    "/(es|en|fr)/:path*",
    "/((?!api|_next|_vercel|.*\\..*).*)",
  ],
};
