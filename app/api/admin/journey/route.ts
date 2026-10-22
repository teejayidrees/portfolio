import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Journey } from "@/lib/models";
import { ADMIN_PASSWORD } from "@/lib/types";

function authorized(req: Request) {
  return (req.headers.get("x-admin-password") ?? "") === ADMIN_PASSWORD;
}

export async function POST(req: Request) {
  if (!authorized(req))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const body = await req.json();
    await connectDB();
    await Journey.create(body);
    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  if (!authorized(req))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const body = await req.json();
    await connectDB();
    await Journey.findByIdAndUpdate(body._id, body);
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
    await Journey.findByIdAndDelete(id);
    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
