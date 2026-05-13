import NextAuth from "next-auth";
import { CredentialsSignin } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import type { Adapter } from "next-auth/adapters";
import { PrismaAdapter } from "@auth/prisma-adapter";
import authConfig from "@/auth.config";
import { db } from "@/lib/db";
import { verifyPassword } from "@/lib/password";

const MAX_SIGN_IN_ATTEMPTS = 3;

class TooManyAttemptsError extends CredentialsSignin {
  code = "too_many_attempts";
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  trustHost: true,
  providers: [
    ...(authConfig.providers ?? []),
    Credentials({
      name: "Email and Password",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const email = credentials?.email;
        const password = credentials?.password;

        if (
          typeof email !== "string" ||
          typeof password !== "string" ||
          !email.trim() ||
          !password
        ) {
          return null;
        }

        const user = await db.user.findUnique({
          where: { email: email.trim().toLowerCase() },
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
            passwordHash: true,
            failedSignInAttempts: true,
            signInLockedAt: true,
          },
        });

        if (!user?.passwordHash) {
          return null;
        }

        if (
          user.failedSignInAttempts >= MAX_SIGN_IN_ATTEMPTS &&
          user.signInLockedAt
        ) {
          throw new TooManyAttemptsError();
        }

        const valid = verifyPassword(password, user.passwordHash);

        if (!valid) {
          const nextFailedAttempts = user.failedSignInAttempts + 1;

          await db.user.update({
            where: { id: user.id },
            data: {
              failedSignInAttempts: nextFailedAttempts,
              signInLockedAt:
                nextFailedAttempts >= MAX_SIGN_IN_ATTEMPTS ? new Date() : null,
            },
          });

          if (nextFailedAttempts >= MAX_SIGN_IN_ATTEMPTS) {
            throw new TooManyAttemptsError();
          }

          return null;
        }

        if (user.failedSignInAttempts > 0 || user.signInLockedAt) {
          await db.user.update({
            where: { id: user.id },
            data: {
              failedSignInAttempts: 0,
              signInLockedAt: null,
            },
          });
        }

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        };
      },
    }),
  ],
  adapter: PrismaAdapter(db) as Adapter,
  session: { strategy: "jwt" },
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role ?? "MEMBER";
      }

      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.id = String(token.id ?? token.sub ?? "");
        session.user.role =
          token.role === "OWNER" || token.role === "ADMIN"
            ? token.role
            : "MEMBER";
      }

      return session;
    },
  },
});
