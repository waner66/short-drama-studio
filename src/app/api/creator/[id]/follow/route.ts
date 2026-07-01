import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';

/**
 * POST /api/creator/[id]/follow — 关注/取消关注创作者
 * Body: { action: 'follow' | 'unfollow' }
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { user, error } = await requireAuth(request);
    if (error) return error;

    const { id } = await params;

    // 不能关注自己
    if (user!.userId === id) {
      return NextResponse.json({ error: '不能关注自己' }, { status: 400 });
    }

    // 检查目标用户是否存在
    const targetUser = await prisma.user.findUnique({ where: { id }, select: { id: true } });
    if (!targetUser) {
      return NextResponse.json({ error: '用户不存在' }, { status: 404 });
    }

    const body = await request.json();
    const { action } = body;

    if (action === 'follow') {
      await prisma.follow.upsert({
        where: {
          followerId_followingId: {
            followerId: user!.userId,
            followingId: id,
          },
        },
        create: {
          followerId: user!.userId,
          followingId: id,
        },
        update: {},
      });
      return NextResponse.json({ following: true });
    } else if (action === 'unfollow') {
      await prisma.follow.deleteMany({
        where: {
          followerId: user!.userId,
          followingId: id,
        },
      });
      return NextResponse.json({ following: false });
    } else {
      return NextResponse.json({ error: '无效的操作' }, { status: 400 });
    }
  } catch (error) {
    console.error('POST /api/creator/[id]/follow error:', error);
    return NextResponse.json({ error: '服务器错误' }, { status: 500 });
  }
}
