import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Message } from "@/lib/models";

// POST /api/messages — public contact form submission.
export async function POST(req: Request) {
  try {
    const { name, email, message, mediaUrl } = await req.json();
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Name, email, and message are required" },
        { status: 400 },
      );
    }

    await connectDB();
    await Message.create({ name, email, message, mediaUrl });

    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to send message" },
      { status: 500 },
    );
  }
}
