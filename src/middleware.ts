import { NextResponse } from "next/server";
import NextAuth from "next-auth";
import authConfig from "@/auth.config";

const { auth } = NextAuth(authConfig);

const protectedPrefixes = [
  "/dashboard/admin",
  "/dashboard/deploy",
  "/dashboard/teach",
  "/dashboard/invitations",
  "/dashboard/progress",
  "/dashboard/account",
];

export default auth((req) => {
  const pathname = req.nextUrl.pathname;
  const needsAuth = protectedPrefixes.some((prefix) =>
    pathname.startsWith(prefix),
  );

  if (needsAuth && !req.auth?.user) {
    const signInUrl = new URL("/auth/signin", req.url);
    signInUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(signInUrl);
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/dashboard/:path*"],
};
