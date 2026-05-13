import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { AuthPanel } from "@/app/auth/signin/auth-panel";
import { AuthModalShell } from "@/components/auth/auth-modal-shell";

type SignInModalPageProps = {
  searchParams: Promise<{
    callbackUrl?: string;
    error?: string;
    code?: string;
    success?: string;
    mode?: string;
  }>;
};

export default async function InterceptedSignInPage({
  searchParams,
}: SignInModalPageProps) {
  const params = await searchParams;
  const callbackUrl = params.callbackUrl ?? "/";
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
    <AuthModalShell closeHref={callbackUrl}>
      <AuthPanel
        callbackUrl={callbackUrl}
        mode={mode}
        signInErrorMessage={signInErrorMessage}
        registerErrorMessage={registerErrorMessage}
        registerSuccessMessage={registerSuccessMessage}
      />
    </AuthModalShell>
  );
}
