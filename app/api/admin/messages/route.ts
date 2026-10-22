import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Message } from "@/lib/models";
import { ADMIN_PASSWORD } from "@/lib/types";

function authorized(req: Request) {
  return (req.headers.get("x-admin-password") ?? "") === ADMIN_PASSWORD;
}

export async function GET(req: Request) {
  if (!authorized(req))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    await connectDB();
    const messages = await Message.find().sort({ createdAt: -1 });
    return NextResponse.json(messages);
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to load messages" },
      { status: 500 },
    );
  }
}

export async function DELETE(req: Request) {
  if (!authorized(req))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    await connectDB();
    await Message.findByIdAndDelete(id);
    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to delete message" },
      { status: 500 },
    );
  }
}
