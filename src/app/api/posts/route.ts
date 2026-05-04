import { NextRequest, NextResponse } from "next/server";
import type { Post } from "@/lib/mock-data";

const posts: Post[] = [];

export async function GET() {
  return NextResponse.json(posts);
}

export async function POST(req: NextRequest) {
  const { content, authorName } = (await req.json()) as {
    content: string;
    authorName: string;
  };
  const initials = authorName
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0] ?? "")
    .join("")
    .toUpperCase();
  const newPost: Post = {
    id: `p-${Date.now()}`,
    authorName,
    authorInitials: initials,
    content,
    createdAt: new Date().toISOString(),
    likes: 0,
    comments: [],
  };
  posts.unshift(newPost);
  return NextResponse.json(newPost);
}
