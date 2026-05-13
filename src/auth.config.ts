import type { NextAuthConfig } from "next-auth";

const authConfig = {
  trustHost: true,
  pages: {
    signIn: "/auth/signin",
  },
  providers: [],
} satisfies NextAuthConfig;

export default authConfig;
