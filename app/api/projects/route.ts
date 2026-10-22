import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Project } from "@/lib/models";

// GET /api/projects — public list of portfolio projects.
export async function GET() {
  try {
    await connectDB();
    // Sort projects so the newest ones show up first
    const projects = await Project.find().sort({ createdAt: -1 });
    return NextResponse.json(projects);
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to load projects" },
      { status: 500 },
    );
  }
}
