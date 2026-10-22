import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Post } from "@/lib/models";

export async function GET() {
  try {
    await connectDB();
    // Fetch posts, newest first
    const posts = await Post.find().sort({ createdAt: -1 });
    return NextResponse.json(posts);
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to load posts" },
      { status: 500 },
    );
  }
}
