import { redirect } from "next/navigation";
import { auth, signIn } from "@/auth";

export const dynamic = "force-dynamic";

type SignInPageProps = {
  searchParams: Promise<{ callbackUrl?: string }>;
};

export default async function SignInPage({ searchParams }: SignInPageProps) {
  const session = await auth();

  if (session?.user) {
    redirect("/dashboard");
  }

  const params = await searchParams;
  const callbackUrl = params.callbackUrl ?? "/dashboard";

  return (
    <section className="mx-auto flex min-h-[80vh] w-full max-w-md items-center px-4 py-10">
      <article className="w-full space-y-4 rounded-2xl border border-[color:var(--line)] bg-white p-6 shadow-sm">
        <p className="text-xs uppercase tracking-[0.2em] text-[color:var(--muted)]">
          P3 Integration
        </p>
        <h1 className="text-2xl font-bold">Sign In</h1>
        <p className="text-sm text-[color:var(--muted)]">
          NextAuth v5 is configured with GitHub provider and Prisma sessions.
        </p>

        <form
          action={async () => {
            "use server";
            await signIn("github", { redirectTo: callbackUrl });
          }}
        >
          <button
            type="submit"
            className="w-full rounded-xl bg-[color:var(--brand)] px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90"
          >
            Continue With GitHub
          </button>
        </form>
      </article>
    </section>
  );
}
