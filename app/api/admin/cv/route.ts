import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { CV } from "@/lib/models";
import { ADMIN_PASSWORD } from "@/lib/types";

function authorized(req: Request) {
  return (req.headers.get("x-admin-password") ?? "") === ADMIN_PASSWORD;
}

export async function GET(req: Request) {
  if (!authorized(req))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    await connectDB();
    const cvs = await CV.find().sort({ createdAt: -1 });
    return NextResponse.json(cvs);
  } catch (err) {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  if (!authorized(req))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const { versionName, url } = await req.json();
    await connectDB();

    // If it's the first CV being uploaded, make it active by default
    const count = await CV.countDocuments();
    const isActive = count === 0;

    await CV.create({ versionName, url, isActive });
    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  if (!authorized(req))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const { id } = await req.json();
    await connectDB();

    // Set all CVs to inactive first
    await CV.updateMany({}, { isActive: false });
    // Set the selected one to active
    await CV.findByIdAndUpdate(id, { isActive: true });

    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  if (!authorized(req))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    await connectDB();
    await CV.findByIdAndDelete(id);
    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
