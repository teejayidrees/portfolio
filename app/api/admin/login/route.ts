import { NextResponse } from 'next/server';
import { ADMIN_PASSWORD } from '@/lib/types';

// POST /api/admin/login — verify the hardcoded admin password.
export async function POST(req: Request) {
  try {
    const { password } = await req.json();
    if (password === ADMIN_PASSWORD) {
      return NextResponse.json({ ok: true });
    }
    return NextResponse.json({ error: 'Invalid password' }, { status: 401 });
  } catch (err) {
    return NextResponse.json({ error: 'Bad request' }, { status: 400 });
  }
}
