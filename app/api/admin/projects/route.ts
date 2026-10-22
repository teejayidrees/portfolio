import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Project } from "@/lib/models";
import { ADMIN_PASSWORD } from "@/lib/types";

function authorized(req: Request): boolean {
  return (req.headers.get("x-admin-password") ?? "") === ADMIN_PASSWORD;
}

// POST /api/admin/projects — create a new project.
export async function POST(req: Request) {
  if (!authorized(req))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json();
    await connectDB();

    const project = await Project.create({
      title: body.title ?? "",
      description: body.description ?? "",
      category: body.category ?? "Software Suite",
      techStack: Array.isArray(body.techStack) ? body.techStack : [],
      desktopVideoUrl: body.desktopVideoUrl ?? "",
      mobileVideoUrl: body.mobileVideoUrl ?? "",
      liveUrl: body.liveUrl ?? "",
      githubUrl: body.githubUrl ?? "",
    });

    return NextResponse.json({ id: project._id }, { status: 201 });
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to create project" },
      { status: 500 },
    );
  }
}

// PUT /api/admin/projects — update an existing project.
export async function PUT(req: Request) {
  if (!authorized(req))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json();
    if (!body._id)
      return NextResponse.json(
        { error: "Project ID required" },
        { status: 400 },
      );

    await connectDB();

    await Project.findByIdAndUpdate(body._id, {
      title: body.title ?? "",
      description: body.description ?? "",
      category: body.category ?? "Software Suite",
      techStack: Array.isArray(body.techStack) ? body.techStack : [],
      desktopVideoUrl: body.desktopVideoUrl ?? "",
      mobileVideoUrl: body.mobileVideoUrl ?? "",
      liveUrl: body.liveUrl ?? "",
      githubUrl: body.githubUrl ?? "",
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to update project" },
      { status: 500 },
    );
  }
}

// DELETE /api/admin/projects?id=... — delete a project.
export async function DELETE(req: Request) {
  if (!authorized(req))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id)
      return NextResponse.json(
        { error: "Project ID required" },
        { status: 400 },
      );

    await connectDB();
    await Project.findByIdAndDelete(id);
    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to delete project" },
      { status: 500 },
    );
  }
}
