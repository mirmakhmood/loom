import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { SESSION_COOKIE } from "@/lib/constants";
import { parseSessionToken } from "@/lib/session-token";

export async function middleware(request: NextRequest) {
  const sessionToken = request.cookies.get(SESSION_COOKIE)?.value;
  const session = await parseSessionToken(sessionToken);

  if (!session) {
    const loginUrl = new URL("/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  const pathname = request.nextUrl.pathname;

  if (pathname.startsWith("/admin/users") && session.role !== "Admin") {
    const leadsUrl = new URL("/admin/leads", request.url);
    leadsUrl.searchParams.set("error", "forbidden");
    return NextResponse.redirect(leadsUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
