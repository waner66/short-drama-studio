import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUserId } from '@/lib/auth-helper';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const templateId = searchParams.get('templateId');
  if (!templateId) return NextResponse.json({ error: 'templateId required' }, { status: 400 });
  const reviews = await prisma.characterTemplateReview.findMany({
    where: { templateId },
    include: { user: { select: { id: true, username: true, avatarUrl: true } } },
    orderBy: { createdAt: 'desc' },
  });
  return NextResponse.json(reviews);
}

export async function POST(req: NextRequest) {
  const userId = getUserId(req);
  const body = await req.json();
  const { templateId, rating, content } = body;
  const review = await prisma.characterTemplateReview.create({
    data: { templateId, userId, rating: Math.min(5, Math.max(1, rating)), content },
  });
  const agg = await prisma.characterTemplateReview.aggregate({
    where: { templateId }, _avg: { rating: true }, _count: { rating: true },
  });
  await prisma.characterTemplate.update({
    where: { id: templateId },
    data: { avgRating: agg._avg.rating || 0, reviewCount: agg._count.rating },
  });
  return NextResponse.json(review, { status: 201 });
}
