import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUserId } from '@/lib/auth-helper';

export function generateStaticParams() {
  return [{ id: 'default' }];
}

// POST /api/community/feed/[id]/like — 点赞/取消点赞
export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const userId = getUserId(req);
    if (!userId) {
      return NextResponse.json({ error: '请先登录' }, { status: 401 });
    }

    const feedId = params.id;

    // 查找已有的点赞
    const existing = await prisma.feedLike.findUnique({
      where: { feedId_userId: { feedId, userId } },
    });

    if (existing) {
      // 取消点赞
      await prisma.feedLike.delete({ where: { feedId_userId: { feedId, userId } } });
      const count = await prisma.feedLike.count({ where: { feedId } });
      return NextResponse.json({ liked: false, count });
    }

    // 点赞
    await prisma.feedLike.create({ data: { feedId, userId } });
    const count = await prisma.feedLike.count({ where: { feedId } });
    return NextResponse.json({ liked: true, count });
  } catch (error) {
    console.error('POST /api/community/feed/[id]/like error:', error);
    return NextResponse.json({ error: '操作失败' }, { status: 500 });
  }
}

// GET /api/community/feed/[id]/like — 获取点赞状态和数量
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const userId = getUserId(req);
    const feedId = params.id;
    const count = await prisma.feedLike.count({ where: { feedId } });

    let liked = false;
    if (userId) {
      const existing = await prisma.feedLike.findUnique({
        where: { feedId_userId: { feedId, userId } },
      });
      liked = !!existing;
    }

    return NextResponse.json({ liked, count });
  } catch (error) {
    console.error('GET /api/community/feed/[id]/like error:', error);
    return NextResponse.json({ liked: false, count: 0 }, { status: 500 });
  }
}
