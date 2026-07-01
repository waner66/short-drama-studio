import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

/**
 * GET /api/community/creators — 热门创作者排行
 * 按已发布模板数 + 销量排序
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = Math.min(parseInt(searchParams.get('limit') || '10'), 30);

    // 获取有已发布模板的用户，按销量排
    const creators = await prisma.user.findMany({
      where: {
        templates: { some: { status: 'PUBLISHED' } },
      },
      select: {
        id: true,
        username: true,
        avatarUrl: true,
        bio: true,
        _count: {
          select: {
            templates: { where: { status: 'PUBLISHED' } },
            followers: true,
          },
        },
        templates: {
          where: { status: 'PUBLISHED' },
          select: {
            salesCount: true,
            avgRating: true,
          },
        },
      },
      orderBy: {
        templates: { _count: 'desc' },
      },
      take: 50, // 取足够多再进行二次排序
    });

    // 计算衍生指标并按销量排序
    const ranked = creators
      .map((c) => {
        const totalSales = c.templates.reduce((sum, t) => sum + t.salesCount, 0);
        const avgRating =
          c.templates.length > 0
            ? c.templates.reduce((sum, t) => sum + t.avgRating, 0) / c.templates.length
            : 0;
        return {
          id: c.id,
          name: c.username,
          avatar: c.avatarUrl,
          bio: c.bio,
          works: c._count.templates,
          followers: c._count.followers,
          totalSales,
          rating: Math.round(avgRating * 10) / 10,
        };
      })
      .sort((a, b) => b.totalSales - a.totalSales || b.works - a.works)
      .slice(0, limit);

    return NextResponse.json({ data: ranked });
  } catch (error) {
    console.error('GET /api/community/creators error:', error);
    return NextResponse.json({ error: '服务器错误' }, { status: 500 });
  }
}
