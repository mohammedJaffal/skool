import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export interface Session {
  user: {
    name?: string;
    email?: string;
    role: string;
  };
}

export async function auth(): Promise<Session | null> {
  const cookieStore = await cookies();
  const raw = cookieStore.get("mock-session")?.value;
  if (!raw) return null;
  try {
    return JSON.parse(raw) as Session;
  } catch {
    return null;
  }
}

export async function signOut(opts?: { redirectTo?: string }) {
  const cookieStore = await cookies();
  cookieStore.delete("mock-session");
  redirect(opts?.redirectTo ?? "/");
}
