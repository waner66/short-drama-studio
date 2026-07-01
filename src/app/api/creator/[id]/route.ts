import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { optionalAuth } from '@/lib/auth';

/**
 * GET /api/creator/[id] — 创作者主页数据
 * 返回：创作者信息 + 统计数据 + 已发布模板列表
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // 获取创作者
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        username: true,
        avatarUrl: true,
        bio: true,
        role: true,
        createdAt: true,
        _count: { select: { followers: true } },
      },
    });

    if (!user) {
      return NextResponse.json({ error: '创作者不存在' }, { status: 404 });
    }

    // 获取已发布模板
    const templates = await prisma.template.findMany({
      where: { creatorId: id, status: 'PUBLISHED' },
      orderBy: { salesCount: 'desc' },
      select: {
        id: true,
        title: true,
        description: true,
        price: true,
        salesCount: true,
        avgRating: true,
        category: true,
        tags: true,
        coverUrl: true,
        publishedAt: true,
      },
    });

    // 计算统计数据
    const totalSales = templates.reduce((sum, t) => sum + t.salesCount, 0);
    const avgRating =
      templates.length > 0
        ? Math.round(
            (templates.reduce((sum, t) => sum + t.avgRating, 0) / templates.length) * 10
          ) / 10
        : 0;

    // 检查当前用户是否已关注
    const authUser = await optionalAuth(request);
    let isFollowing = false;
    if (authUser) {
      const follow = await prisma.follow.findUnique({
        where: {
          followerId_followingId: {
            followerId: authUser.userId,
            followingId: id,
          },
        },
      });
      isFollowing = !!follow;
    }

    return NextResponse.json({
      id: user.id,
      name: user.username,
      avatar: user.avatarUrl,
      bio: user.bio,
      role: user.role,
      joinedAt: user.createdAt.toISOString().slice(0, 7),
      templatesCount: templates.length,
      followers: user._count.followers,
      totalSales,
      avgRating,
      isFollowing,
      templates: templates.map((t) => ({
        ...t,
        price: Number(t.price),
      })),
    });
  } catch (error) {
    console.error('GET /api/creator/[id] error:', error);
    return NextResponse.json({ error: '服务器错误' }, { status: 500 });
  }
}
