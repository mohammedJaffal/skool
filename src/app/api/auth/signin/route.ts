import { NextRequest, NextResponse } from "next/server";

const USERS = [
  { email: "admin@test.com", password: "pass", name: "Admin User", role: "ADMIN" },
  { email: "member@test.com", password: "pass", name: "Member User", role: "MEMBER" },
];

export async function POST(req: NextRequest) {
  const { email, password } = (await req.json()) as {
    email: string;
    password: string;
  };
  const user = USERS.find((u) => u.email === email && u.password === password);
  if (!user) {
    return NextResponse.json({ error: "Invalid credentials." }, { status: 401 });
  }
  const session = { user: { name: user.name, email: user.email, role: user.role } };
  const res = NextResponse.json({ ok: true });
  res.cookies.set("mock-session", JSON.stringify(session), {
    httpOnly: true,
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
    sameSite: "lax",
  });
  return res;
}
