import { redirect } from "next/navigation";
import { AuthError } from "next-auth";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { auth, signIn } from "@/auth";
import { db } from "@/lib/db";
import { hashPassword } from "@/lib/password";

export const dynamic = "force-dynamic";

type SignInPageProps = {
  searchParams: Promise<{ callbackUrl?: string; error?: string }>;
};

export default async function SignInPage({ searchParams }: SignInPageProps) {
  const session = await auth();

  if (session?.user) {
    redirect("/dashboard");
  }

  const params = await searchParams;
  const callbackUrl = params.callbackUrl ?? "/dashboard";
  const errorCode = params.error;
  const encodedCallback = encodeURIComponent(callbackUrl);

  const errorMessage =
    errorCode === "invalid_credentials"
      ? "Invalid email or password."
      : errorCode === "missing_fields"
        ? "Please fill all required fields."
        : errorCode === "password_too_short"
          ? "Password must be at least 8 characters."
          : errorCode === "email_exists"
            ? "This email is already used."
            : errorCode === "register_failed"
              ? "Could not create account. Please try again."
              : undefined;

  return (
    <section className="mx-auto flex min-h-[80vh] w-full max-w-md items-center px-4 py-10">
      <article className="w-full space-y-4 rounded-2xl border border-[color:var(--line)] bg-white p-6 shadow-sm">
        <p className="text-xs uppercase tracking-[0.2em] text-[color:var(--muted)]">
          Campus Digital
        </p>
        <h1 className="text-2xl font-bold">Sign In</h1>
        <p className="text-sm text-[color:var(--muted)]">
          Sign in with email/password stored in your database.
        </p>

        {errorMessage ? (
          <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            {errorMessage}
          </div>
        ) : null}

        <form
          action={async (formData) => {
            "use server";

            const email = String(formData.get("email") ?? "").trim().toLowerCase();
            const password = String(formData.get("password") ?? "");

            if (!email || !password) {
              redirect(`/auth/signin?callbackUrl=${encodedCallback}&error=missing_fields`);
            }

            try {
              await signIn("credentials", {
                email,
                password,
                redirectTo: callbackUrl,
              });
            } catch (error) {
              if (error instanceof AuthError) {
                redirect(`/auth/signin?callbackUrl=${encodedCallback}&error=invalid_credentials`);
              }

              throw error;
            }
          }}
          className="space-y-3 rounded-xl border border-[color:var(--line)] p-4"
        >
          <p className="text-xs uppercase tracking-[0.2em] text-[color:var(--muted)]">
            Email Login
          </p>
          <input
            name="email"
            type="email"
            required
            placeholder="email@example.com"
            className="w-full rounded-xl border border-[color:var(--line)] px-3 py-2 text-sm outline-none focus:border-[color:var(--brand)]"
          />
          <input
            name="password"
            type="password"
            required
            placeholder="Password"
            className="w-full rounded-xl border border-[color:var(--line)] px-3 py-2 text-sm outline-none focus:border-[color:var(--brand)]"
          />
          <button
            type="submit"
            className="w-full rounded-xl bg-black px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90"
          >
            Sign In With Email
          </button>
        </form>

        <form
          action={async (formData) => {
            "use server";

            const name = String(formData.get("name") ?? "").trim();
            const email = String(formData.get("email") ?? "").trim().toLowerCase();
            const password = String(formData.get("password") ?? "");

            if (!email || !password) {
              redirect(`/auth/signin?callbackUrl=${encodedCallback}&error=missing_fields`);
            }

            if (password.length < 8) {
              redirect(`/auth/signin?callbackUrl=${encodedCallback}&error=password_too_short`);
            }

            const existing = await db.user.findUnique({ where: { email } });

            if (existing) {
              redirect(`/auth/signin?callbackUrl=${encodedCallback}&error=email_exists`);
            }

            try {
              await db.user.create({
                data: {
                  name: name || undefined,
                  email,
                  passwordHash: hashPassword(password),
                },
              });

              await signIn("credentials", {
                email,
                password,
                redirectTo: callbackUrl,
              });
            } catch (error) {
              if (isRedirectError(error)) {
                throw error;
              }

              if (error instanceof AuthError) {
                redirect(`/auth/signin?callbackUrl=${encodedCallback}&error=invalid_credentials`);
              }

              redirect(`/auth/signin?callbackUrl=${encodedCallback}&error=register_failed`);
            }
          }}
          className="space-y-3 rounded-xl border border-[color:var(--line)] p-4"
        >
          <p className="text-xs uppercase tracking-[0.2em] text-[color:var(--muted)]">
            Create Account
          </p>
          <input
            name="name"
            type="text"
            placeholder="Name (optional)"
            className="w-full rounded-xl border border-[color:var(--line)] px-3 py-2 text-sm outline-none focus:border-[color:var(--brand)]"
          />
          <input
            name="email"
            type="email"
            required
            placeholder="email@example.com"
            className="w-full rounded-xl border border-[color:var(--line)] px-3 py-2 text-sm outline-none focus:border-[color:var(--brand)]"
          />
          <input
            name="password"
            type="password"
            required
            minLength={8}
            placeholder="Password (min 8 chars)"
            className="w-full rounded-xl border border-[color:var(--line)] px-3 py-2 text-sm outline-none focus:border-[color:var(--brand)]"
          />
          <button
            type="submit"
            className="w-full rounded-xl border border-[color:var(--line)] px-4 py-2 text-sm font-semibold text-black transition hover:bg-[color:var(--surface-soft)]"
          >
            Create Account
          </button>
        </form>

        <div className="rounded-xl border border-[color:var(--line)] bg-[color:var(--surface-soft)] p-3 text-sm text-[color:var(--muted)]">
          Account access is database-only in this version.
        </div>
      </article>
    </section>
  );
}
