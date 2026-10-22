import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Journey } from "@/lib/models";

export async function GET() {
  try {
    await connectDB();
    const entries = await Journey.find().sort({ order: 1 }); // Sort by your defined order
    return NextResponse.json(entries);
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to fetch journey" },
      { status: 500 },
    );
  }
}
