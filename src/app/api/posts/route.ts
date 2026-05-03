import { NextResponse } from "next/server";
import { POSTS, Post } from "@/lib/mock-data";

// In-memory store so new posts persist across requests in dev
const posts: Post[] = [...POSTS];

export async function GET() {
  return NextResponse.json([...posts].reverse());
}

export async function POST(req: Request) {
  const body = await req.json();
  const { content, authorName } = body as { content: string; authorName: string };

  if (!content?.trim() || !authorName?.trim()) {
    return NextResponse.json({ error: "content and authorName are required" }, { status: 400 });
  }

  const initials = authorName
    .split(" ")
    .map((w: string) => w[0]?.toUpperCase() ?? "")
    .slice(0, 2)
    .join("");

  const newPost: Post = {
    id: String(Date.now()),
    authorName,
    authorInitials: initials,
    content,
    createdAt: new Date().toISOString(),
    likes: 0,
    comments: [],
  };

  posts.unshift(newPost);
  return NextResponse.json(newPost, { status: 201 });
}
