import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';

/**
 * POST /api/templates/[id]/review — 提交评价
 */
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { user, error } = await requireAuth(request);
    if (error) return error;

    const body = await request.json();
    const { rating, content } = body;

    if (!rating || rating < 1 || rating > 5) {
      return NextResponse.json({ error: '评分需在1-5之间' }, { status: 400 });
    }

    const templateId = params.id;

    // 验证模板存在
    const template = await prisma.template.findUnique({
      where: { id: templateId },
    });
    if (!template) {
      return NextResponse.json({ error: '模板不存在' }, { status: 404 });
    }

    // 不能评价自己的模板
    if (template.creatorId === user!.userId) {
      return NextResponse.json({ error: '不能评价自己的模板' }, { status: 400 });
    }

    // Upsert 评价 (每人每个模板只能有一条评价)
    const review = await prisma.review.upsert({
      where: {
        userId_templateId: {
          userId: user!.userId,
          templateId,
        },
      },
      update: {
        rating,
        content: content || null,
      },
      create: {
        userId: user!.userId,
        templateId,
        rating,
        content: content || null,
      },
      include: {
        user: {
          select: { id: true, username: true, avatarUrl: true },
        },
      },
    });

    // 更新模板平均评分
    const avgResult = await prisma.review.aggregate({
      where: { templateId, status: 'PUBLISHED' },
      _avg: { rating: true },
    });

    await prisma.template.update({
      where: { id: templateId },
      data: { avgRating: avgResult._avg.rating || rating },
    });

    return NextResponse.json(review, { status: 201 });
  } catch (error) {
    console.error('POST /api/templates/[id]/review error:', error);
    return NextResponse.json({ error: '服务器错误' }, { status: 500 });
  }
}
