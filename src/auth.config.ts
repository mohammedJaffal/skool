import type { NextAuthConfig } from "next-auth";

const authConfig = {
  pages: {
    signIn: "/auth/signin",
  },
  providers: [],
} satisfies NextAuthConfig;

export default authConfig;
