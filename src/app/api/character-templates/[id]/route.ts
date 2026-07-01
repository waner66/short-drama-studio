import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUserId } from '@/lib/auth-helper';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const t = await prisma.characterTemplate.findUnique({
    where: { id: params.id },
    include: { creator: { select: { id: true, username: true, avatarUrl: true } } },
  });
  if (!t) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(t);
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const userId = getUserId(req);
  const existing = await prisma.characterTemplate.findUnique({ where: { id: params.id } });
  if (!existing || existing.creatorId !== userId) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  const body = await req.json();
  return NextResponse.json(await prisma.characterTemplate.update({ where: { id: params.id }, data: body }));
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const userId = getUserId(req);
  const existing = await prisma.characterTemplate.findUnique({ where: { id: params.id } });
  if (!existing || existing.creatorId !== userId) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  await prisma.characterTemplate.delete({ where: { id: params.id } });
  return NextResponse.json({ success: true });
}
