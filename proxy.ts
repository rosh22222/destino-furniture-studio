import { NextResponse, type NextRequest } from "next/server";

const legacyRedirects = new Map<string, string>([
  ["/Clients", "/clients"],
  ["/featured-categories", "/products"],
  ["/admin-login", "/admin/login"],
  ["/dashboard", "/admin"],
]);

export function proxy(request: NextRequest) {
  const target = legacyRedirects.get(request.nextUrl.pathname);

  if (!target) {
    return NextResponse.next();
  }

  return NextResponse.redirect(new URL(target, request.url), 301);
}

export const config = {
  matcher: ["/Clients", "/featured-categories", "/admin-login", "/dashboard"],
};

