import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUserId } from '@/lib/auth-helper';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const p = await prisma.project.findUnique({ where: { id: params.id } });
  if (!p) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(p);
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const userId = getUserId(req);
  const existing = await prisma.project.findUnique({ where: { id: params.id } });
  if (!existing || existing.userId !== userId) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  const body = await req.json();
  const updated = await prisma.project.update({ where: { id: params.id }, data: body });
  return NextResponse.json(updated);
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const userId = getUserId(req);
  const existing = await prisma.project.findUnique({ where: { id: params.id } });
  if (!existing || existing.userId !== userId) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  await prisma.project.delete({ where: { id: params.id } });
  return NextResponse.json({ success: true });
}
