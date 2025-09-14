import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

const GUARDS: { prefix: string; roles: Array<"Admin" | "Member" | "User"> }[] =
  [
    { prefix: "/admin", roles: ["Admin"] },
    { prefix: "/api/admin", roles: ["Admin"] },

    // Members area allows Member and Admin
    { prefix: "/member", roles: ["Member", "Admin"] },
    { prefix: "/api/member", roles: ["Member", "Admin"] },

    // Users area allows User, Member, and Admin
    { prefix: "/user", roles: ["User", "Member", "Admin"] },
    { prefix: "/api/user", roles: ["User", "Member", "Admin"] },
  ];

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Only guard the prefixes we declare
  const guard = GUARDS.find((g) => pathname.startsWith(g.prefix));
  if (!guard) return NextResponse.next();

  // Read JWT set by NextAuth
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  if (!token) {
    // Not signed in → redirect to login
    const url = new URL("/login", req.url);
    url.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(url);
  }

  // Check role
  const role = token.role as "Admin" | "Member" | "User" | undefined;
  if (!role || !guard.roles.includes(role)) {
    // If it’s an API route, return 403 JSON
    if (pathname.startsWith("/api/")) {
      return NextResponse.json(
        { ok: false, error: "Forbidden" },
        { status: 403 }
      );
    }
    // Otherwise, redirect to a friendly page
    const url = new URL("/unauthorized", req.url);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/member/:path*",
    "/user/:path*",
    "/api/admin/:path*",
    "/api/member/:path*",
    "/api/user/:path*",
  ],
};
