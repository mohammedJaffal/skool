import { redirect } from "next/navigation";
import { AuthError } from "next-auth";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { signIn } from "@/auth";
import { db } from "@/lib/db";
import { hashPassword } from "@/lib/password";
import { AuthModeLink } from "./auth-mode-link";
import { AuthModeSwitcher } from "./auth-mode-switcher";

type AuthPanelProps = {
  callbackUrl: string;
  mode: "signin" | "signup";
  signInErrorMessage?: string;
  registerErrorMessage?: string;
  registerSuccessMessage?: string;
};

export function AuthPanel({
  callbackUrl,
  mode,
  signInErrorMessage,
  registerErrorMessage,
  registerSuccessMessage,
}: AuthPanelProps) {
  const encodedCallback = encodeURIComponent(callbackUrl);
  const communitySlugMatch = callbackUrl.match(/\/communities\/([^/]+)/);
  const contextLabel = communitySlugMatch
    ? `Continue to join ${communitySlugMatch[1].replace(/-/g, " ")}`
    : "Continue to your workspace";

  async function signInWithCredentials(formData: FormData) {
    "use server";

    const email = String(formData.get("email") ?? "").trim().toLowerCase();
    const password = String(formData.get("password") ?? "");

    if (!email || !password) {
      redirect(
        `/auth/signin?callbackUrl=${encodedCallback}&mode=signin&error=missing_fields`,
      );
    }

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
        redirectTo: callbackUrl,
      });

      redirect(result);
    } catch (error) {
      if (error instanceof AuthError) {
        const code =
          typeof error.cause === "object" &&
          error.cause &&
          "code" in error.cause &&
          typeof error.cause.code === "string"
            ? error.cause.code
            : "invalid_credentials";

        redirect(
          `/auth/signin?callbackUrl=${encodedCallback}&mode=signin&error=invalid_credentials&code=${encodeURIComponent(code)}`,
        );
      }

      throw error;
    }
  }

  async function registerAccount(formData: FormData) {
    "use server";

    const firstName = String(formData.get("firstName") ?? "").trim();
    const lastName = String(formData.get("lastName") ?? "").trim();
    const email = String(formData.get("email") ?? "").trim().toLowerCase();
    const birthDate = String(formData.get("birthDate") ?? "").trim();
    const password = String(formData.get("password") ?? "");

    if (!email || !password) {
      redirect(
        `/auth/signin?callbackUrl=${encodedCallback}&mode=signup&error=missing_fields`,
      );
    }

    if (password.length < 8) {
      redirect(
        `/auth/signin?callbackUrl=${encodedCallback}&mode=signup&error=password_too_short`,
      );
    }

    const existing = await db.user.findUnique({ where: { email } });

    if (existing) {
      redirect(
        `/auth/signin?callbackUrl=${encodedCallback}&mode=signup&error=email_exists`,
      );
    }

    try {
      await db.user.create({
        data: {
          name: [firstName, lastName].filter(Boolean).join(" ") || undefined,
          email,
          passwordHash: hashPassword(password),
          birthDate: birthDate ? new Date(birthDate) : undefined,
        },
      });
    } catch (error) {
      if (isRedirectError(error)) {
        throw error;
      }

      redirect(
        `/auth/signin?callbackUrl=${encodedCallback}&mode=signup&error=register_failed`,
      );
    }

    redirect(
      `/auth/signin?callbackUrl=${encodedCallback}&success=registered&mode=signin`,
    );
  }

  return (
    <article className="w-full max-w-[560px] rounded-[28px] border border-[color:var(--line)] bg-white p-8 shadow-[0_24px_80px_rgba(24,20,16,0.22)]">
      <div className="text-center">
        <p className="text-[2.25rem] font-black tracking-[-0.05em] text-[color:var(--foreground)]">
          skool
        </p>
        <h1 className="mt-5 text-4xl font-black tracking-[-0.05em]">
          {mode === "signin" ? "Log in to your account" : "Create your account"}
        </h1>
        <p className="mt-3 text-base text-[color:var(--muted)]">{contextLabel}</p>
      </div>

      <AuthModeSwitcher mode={mode} callbackUrl={callbackUrl} />

      {mode === "signin" ? (
        <form action={signInWithCredentials} className="mt-8 space-y-4">
          {signInErrorMessage ? (
            <div className="rounded-2xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
              {signInErrorMessage}
            </div>
          ) : null}
          {registerSuccessMessage ? (
            <div className="rounded-2xl border border-green-200 bg-green-50 p-3 text-sm text-green-700">
              {registerSuccessMessage}
            </div>
          ) : null}
          <input
            name="email"
            type="email"
            required
            placeholder="Email"
            className="w-full rounded-2xl border border-[color:var(--line)] px-5 py-4 text-base outline-none transition focus:border-[color:var(--brand)]"
          />
          <input
            name="password"
            type="password"
            required
            placeholder="Password"
            className="w-full rounded-2xl border border-[color:var(--line)] px-5 py-4 text-base outline-none transition focus:border-[color:var(--brand)]"
          />
          <button
            type="submit"
            className="w-full rounded-2xl bg-[color:var(--foreground)] px-5 py-4 text-base font-semibold text-white transition hover:opacity-92"
          >
            Log in
          </button>
          <p className="text-center text-sm text-[color:var(--muted)]">
            Don&apos;t have an account?{" "}
            <AuthModeLink
              mode="signup"
              callbackUrl={callbackUrl}
              className="font-semibold text-[color:var(--foreground)] underline underline-offset-4"
            >
              Sign up
            </AuthModeLink>
          </p>
        </form>
      ) : (
        <form action={registerAccount} className="mt-8 space-y-4">
          {registerErrorMessage ? (
            <div className="rounded-2xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
              {registerErrorMessage}
            </div>
          ) : null}
          <div className="grid gap-4 sm:grid-cols-2">
            <input
              name="firstName"
              type="text"
              placeholder="First name"
              className="w-full rounded-2xl border border-[color:var(--line)] px-5 py-4 text-base outline-none transition focus:border-[color:var(--brand)]"
            />
            <input
              name="lastName"
              type="text"
              placeholder="Last name"
              className="w-full rounded-2xl border border-[color:var(--line)] px-5 py-4 text-base outline-none transition focus:border-[color:var(--brand)]"
            />
          </div>
          <input
            name="email"
            type="email"
            required
            placeholder="Email"
            className="w-full rounded-2xl border border-[color:var(--line)] px-5 py-4 text-base outline-none transition focus:border-[color:var(--brand)]"
          />
          <input
            name="password"
            type="password"
            required
            minLength={8}
            placeholder="Password"
            className="w-full rounded-2xl border border-[color:var(--line)] px-5 py-4 text-base outline-none transition focus:border-[color:var(--brand)]"
          />
          <input
            name="birthDate"
            type="date"
            className="w-full rounded-2xl border border-[color:var(--line)] px-5 py-4 text-base outline-none transition focus:border-[color:var(--brand)]"
          />
          <button
            type="submit"
            className="w-full rounded-2xl bg-[color:var(--foreground)] px-5 py-4 text-base font-semibold text-white transition hover:opacity-92"
          >
            Sign up
          </button>
          <p className="text-center text-sm text-[color:var(--muted)]">
            Already have an account?{" "}
            <AuthModeLink
              mode="signin"
              callbackUrl={callbackUrl}
              className="font-semibold text-[color:var(--foreground)] underline underline-offset-4"
            >
              Log in
            </AuthModeLink>
          </p>
        </form>
      )}
    </article>
  );
}
