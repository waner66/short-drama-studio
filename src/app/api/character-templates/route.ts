import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUserId } from '@/lib/auth-helper';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const genre = searchParams.get('genre');
  const search = searchParams.get('search');
  const where: any = { status: 'PUBLISHED' };
  if (genre && genre !== '全部') where.genre = genre;
  if (search) where.OR = [{ name: { contains: search } }, { description: { contains: search } }];
  const templates = await prisma.characterTemplate.findMany({
    where, orderBy: { salesCount: 'desc' },
    include: { creator: { select: { id: true, username: true, avatarUrl: true } } },
  });
  return NextResponse.json(templates);
}

export async function POST(req: NextRequest) {
  const userId = getUserId(req);
  const body = await req.json();
  const t = await prisma.characterTemplate.create({
    data: { name: body.name, description: body.description || '', genre: body.genre || '甜宠恋爱', archetype: body.archetype || '其他', defaultData: body.defaultData || {}, price: body.price || 0, tags: body.tags || [], creatorId: userId, status: 'PUBLISHED', isOfficial: false },
  });
  return NextResponse.json(t, { status: 201 });
}
