import type { NextAuthConfig } from "next-auth";
import GitHub from "next-auth/providers/github";

const githubConfigured = Boolean(
  process.env.AUTH_GITHUB_ID && process.env.AUTH_GITHUB_SECRET,
);

const authConfig = {
  pages: {
    signIn: "/auth/signin",
  },
  providers: githubConfigured
    ? [
        GitHub({
          clientId: process.env.AUTH_GITHUB_ID ?? "",
          clientSecret: process.env.AUTH_GITHUB_SECRET ?? "",
        }),
      ]
    : [],
} satisfies NextAuthConfig;

export default authConfig;
