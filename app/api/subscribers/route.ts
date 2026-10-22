import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Subscriber } from "@/lib/models";

// POST /api/subscribers — public newsletter signup.
export async function POST(req: Request) {
  try {
    const { email } = await req.json();
    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      return NextResponse.json(
        { error: "A valid email is required" },
        { status: 400 },
      );
    }

    await connectDB();
    await Subscriber.create({ email });

    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (err: any) {
    // If the email already exists, MongoDB throws an 11000 duplicate key error
    if (err.code === 11000) {
      return NextResponse.json(
        { ok: true, message: "Already subscribed!" },
        { status: 200 },
      );
    }
    return NextResponse.json({ error: "Failed to subscribe" }, { status: 500 });
  }
}
