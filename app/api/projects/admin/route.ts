import { NextResponse } from 'next/server';
import { createProject, updateProject, deleteProject } from '@/lib/services/projects';
import { ADMIN_PASSWORD, type ProjectCategory } from '@/lib/types';

// Validate the admin password supplied via header.
function authorized(req: Request): boolean {
  const pw = req.headers.get('x-admin-password') ?? '';
  return pw === ADMIN_PASSWORD;
}

// POST /api/projects — create a new project (admin only).
export async function POST(req: Request) {
  if (!authorized(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  try {
    const body = await req.json();
    const id = await createProject(ADMIN_PASSWORD, {
      title: body.title ?? '',
      description: body.description ?? '',
      category: (body.category ?? 'Software Suite') as ProjectCategory,
      tech_stack: Array.isArray(body.tech_stack) ? body.tech_stack : [],
      desktop_video_url: body.desktop_video_url ?? '',
      mobile_video_url: body.mobile_video_url ?? '',
      live_url: body.live_url ?? '',
      github_url: body.github_url ?? '',
    });
    return NextResponse.json({ id }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to create project' }, { status: 500 });
  }
}

// PUT /api/projects — update a project (admin only).
export async function PUT(req: Request) {
  if (!authorized(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  try {
    const body = await req.json();
    await updateProject(ADMIN_PASSWORD, body.id, {
      title: body.title ?? '',
      description: body.description ?? '',
      category: (body.category ?? 'Software Suite') as ProjectCategory,
      tech_stack: Array.isArray(body.tech_stack) ? body.tech_stack : [],
      desktop_video_url: body.desktop_video_url ?? '',
      mobile_video_url: body.mobile_video_url ?? '',
      live_url: body.live_url ?? '',
      github_url: body.github_url ?? '',
    });
    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to update project' }, { status: 500 });
  }
}

// DELETE /api/projects?id=... — delete a project (admin only).
export async function DELETE(req: Request) {
  if (!authorized(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id') ?? '';
    await deleteProject(ADMIN_PASSWORD, id);
    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to delete project' }, { status: 500 });
  }
}
