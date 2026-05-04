"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await fetch("/api/auth/signin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    if (res.ok) {
      router.push("/dashboard");
      router.refresh();
    } else {
      const data = (await res.json()) as { error?: string };
      setError(data.error ?? "Invalid credentials.");
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="rounded-2xl border border-[color:var(--line)] bg-white p-7 shadow-sm">
          <p className="text-xs uppercase tracking-[0.2em] text-[color:var(--muted)]">
            Welcome back
          </p>
          <h1 className="mt-1 text-2xl font-bold">Sign in</h1>

          <div className="mt-4 rounded-xl border border-[color:var(--line)] bg-[color:var(--surface-soft)] p-3 text-xs text-[color:var(--muted)]">
            <p className="mb-1 font-semibold">Test credentials</p>
            <p>
              <span className="font-mono">admin@test.com</span> /{" "}
              <span className="font-mono">pass</span> — ADMIN
            </p>
            <p>
              <span className="font-mono">member@test.com</span> /{" "}
              <span className="font-mono">pass</span> — MEMBER
            </p>
          </div>

          <form onSubmit={handleSubmit} className="mt-5 space-y-3">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full rounded-xl border border-[color:var(--line)] bg-[color:var(--surface-soft)] px-3 py-2 text-sm outline-none transition focus:border-[color:var(--brand)]"
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full rounded-xl border border-[color:var(--line)] bg-[color:var(--surface-soft)] px-3 py-2 text-sm outline-none transition focus:border-[color:var(--brand)]"
            />
            {error && <p className="text-xs text-red-500">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-[color:var(--brand)] py-2.5 text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-40"
            >
              {loading ? "Signing in..." : "Continue"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
