import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { CV } from "@/lib/models";
export const dynamic = "force-dynamic"; // <--- This breaks the production cache

export async function GET() {
  try {
    await connectDB();
    const activeCV = await CV.findOne({ isActive: true });
    return NextResponse.json(activeCV || null);
  } catch (err) {
    return NextResponse.json({ error: "Failed to fetch CV" }, { status: 500 });
  }
}
