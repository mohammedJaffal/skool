import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { AuthPanel } from "./auth-panel";

export const dynamic = "force-dynamic";

type SignInPageProps = {
  searchParams: Promise<{
    callbackUrl?: string;
    error?: string;
    code?: string;
    success?: string;
    mode?: string;
  }>;
};

export default async function SignInPage({ searchParams }: SignInPageProps) {
  const params = await searchParams;
  const callbackUrl = params.callbackUrl ?? "/dashboard";
  const session = await auth();

  if (session?.user) {
    redirect(callbackUrl);
  }

  const errorCode = params.error;
  const authCode = params.code;
  const successCode = params.success;
  const mode = params.mode === "signup" ? "signup" : "signin";

  const errorMessage =
    authCode === "too_many_attempts"
      ? "Too many failed sign-in attempts. This account is now locked."
      : errorCode === "invalid_credentials"
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

  const signInErrorMessage =
    authCode === "too_many_attempts" || errorCode === "invalid_credentials"
      ? errorMessage
      : errorCode === "missing_fields"
        ? errorMessage
        : undefined;

  const registerErrorMessage =
    errorCode === "password_too_short" ||
    errorCode === "email_exists" ||
    errorCode === "register_failed"
      ? errorMessage
      : undefined;

  const registerSuccessMessage =
    successCode === "registered"
      ? "Registration complete. Sign in with your new account."
      : undefined;

  return (
    <section className="flex min-h-screen items-center justify-center bg-[rgba(21,18,14,0.55)] px-4 py-10">
      <AuthPanel
        callbackUrl={callbackUrl}
        mode={mode}
        signInErrorMessage={signInErrorMessage}
        registerErrorMessage={registerErrorMessage}
        registerSuccessMessage={registerSuccessMessage}
      />
    </section>
  );
}
