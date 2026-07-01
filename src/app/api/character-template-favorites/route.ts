import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUserId } from '@/lib/auth-helper';

export async function GET(req: NextRequest) {
  const userId = getUserId(req);
  const favs = await prisma.characterTemplateFavorite.findMany({
    where: { userId }, include: { template: true }, orderBy: { createdAt: 'desc' },
  });
  return NextResponse.json(favs);
}

export async function POST(req: NextRequest) {
  const userId = getUserId(req);
  const { templateId } = await req.json();
  const fav = await prisma.characterTemplateFavorite.create({ data: { userId, templateId } });
  await prisma.characterTemplate.update({ where: { id: templateId }, data: { favoriteCount: { increment: 1 } } });
  return NextResponse.json(fav, { status: 201 });
}
