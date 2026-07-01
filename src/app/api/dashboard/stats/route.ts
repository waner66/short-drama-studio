import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

/**
 * GET /api/dashboard/stats — 首页统计卡片数据
 * 返回：热门模板数、创作者数、累计交易额
 */
export async function GET(_request: NextRequest) {
  try {
    const [publishedCount, creatorCount, revenueAgg] = await Promise.all([
      prisma.template.count({ where: { status: 'PUBLISHED' } }),
      prisma.user.count({
        where: { templates: { some: { status: 'PUBLISHED' } } },
      }),
      prisma.order.aggregate({
        where: { status: 'PAID' },
        _sum: { amount: true },
      }),
    ]);

    return NextResponse.json({
      templates: publishedCount,
      creators: creatorCount,
      revenue: Math.round(Number(revenueAgg._sum.amount || 0)),
    });
  } catch (error) {
    console.error('GET /api/dashboard/stats error:', error);
    return NextResponse.json({ error: '服务器错误' }, { status: 500 });
  }
}
