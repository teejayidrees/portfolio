import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Subscriber } from "@/lib/models";
import { ADMIN_PASSWORD } from "@/lib/types";

function authorized(req: Request) {
  return (req.headers.get("x-admin-password") ?? "") === ADMIN_PASSWORD;
}

export async function GET(req: Request) {
  if (!authorized(req))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    await connectDB();
    const subscribers = await Subscriber.find().sort({ createdAt: -1 });
    return NextResponse.json(subscribers);
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to load subscribers" },
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
    await Subscriber.findByIdAndDelete(id);
    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to delete subscriber" },
      { status: 500 },
    );
  }
}
