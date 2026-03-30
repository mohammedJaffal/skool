import type { NextAuthConfig } from "next-auth";
import GitHub from "next-auth/providers/github";

const authConfig = {
  pages: {
    signIn: "/auth/signin",
  },
  providers: [
    GitHub({
      clientId: process.env.AUTH_GITHUB_ID ?? "",
      clientSecret: process.env.AUTH_GITHUB_SECRET ?? "",
    }),
  ],
} satisfies NextAuthConfig;

export default authConfig;
