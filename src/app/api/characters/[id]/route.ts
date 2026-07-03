import { NextRequest, NextResponse } from 'next/server';
import { getUserId } from '@/lib/auth-helper';
import { findOne, updateOne, deleteOne } from '@/lib/supabase-client';

export function generateStaticParams() {
  return [{ id: 'default' }];
}

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const c = await findOne('Character', { id: params.id });
    if (!c) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(c);
  } catch (error: any) {
    console.error('[GET /api/characters/[id]]', error.message);
    return NextResponse.json({ error: '获取角色失败' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const userId = getUserId(req);
    const existing = await findOne('Character', { id: params.id });
    if (!existing || (existing as any).userId !== userId) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }
    const body = await req.json();
    const updated = await updateOne('Character', params.id, body);
    return NextResponse.json(updated);
  } catch (error: any) {
    console.error('[PUT /api/characters/[id]]', error.message);
    return NextResponse.json({ error: '更新角色失败' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const userId = getUserId(req);
    const existing = await findOne('Character', { id: params.id });
    if (!existing || (existing as any).userId !== userId) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }
    await deleteOne('Character', params.id);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('[DELETE /api/characters/[id]]', error.message);
    return NextResponse.json({ error: '删除角色失败' }, { status: 500 });
  }
}
