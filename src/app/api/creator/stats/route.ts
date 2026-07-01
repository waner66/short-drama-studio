import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';

/**
 * GET /api/creator/stats — 创作者收益统计
 * 返回：总收入、本月收入、模板销售明细、待结算金额
 */
export async function GET(request: NextRequest) {
  try {
    const { user, error } = await requireAuth(request);
    if (error) return error;

    const creatorId = user!.userId;

    // 全部已支付订单收益
    const [totalRevenue, monthlyRevenue, templateStats] = await Promise.all([
      prisma.order.aggregate({
        where: {
          template: { creatorId },
          status: 'PAID',
        },
        _sum: { creatorRevenue: true },
      }),
      prisma.order.aggregate({
        where: {
          template: { creatorId },
          status: 'PAID',
          paidAt: {
            gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
          },
        },
        _sum: { creatorRevenue: true },
      }),
      prisma.template.findMany({
        where: { creatorId },
        select: {
          id: true,
          title: true,
          price: true,
          salesCount: true,
          avgRating: true,
          category: true,
          status: true,
          _count: {
            select: {
              orders: { where: { status: 'PAID' } },
              favorites: true,
              reviews: true,
            },
          },
        },
      }),
    ]);

    // 按模板聚合收益
    const templatesWithRevenue = await Promise.all(
      templateStats.map(async (tpl) => {
        const revenueAgg = await prisma.order.aggregate({
          where: { templateId: tpl.id, status: 'PAID' },
          _sum: { creatorRevenue: true },
        });
        return {
          id: tpl.id,
          title: tpl.title,
          price: Number(tpl.price),
          salesCount: tpl.salesCount,
          avgRating: tpl.avgRating,
          category: tpl.category,
          status: tpl.status,
          orders: tpl._count.orders,
          favorites: tpl._count.favorites,
          reviews: tpl._count.reviews,
          revenue: Number(revenueAgg._sum.creatorRevenue || 0),
        };
      })
    );

    // 待结算（非PAID状态但有金额的）
    const pendingAgg = await prisma.order.aggregate({
      where: {
        template: { creatorId },
        status: 'PENDING',
      },
      _sum: { creatorRevenue: true },
    });

    return NextResponse.json({
      totalRevenue: Number(totalRevenue._sum.creatorRevenue || 0),
      monthlyRevenue: Number(monthlyRevenue._sum.creatorRevenue || 0),
      pendingSettlement: Number(pendingAgg._sum.creatorRevenue || 0),
      templateCount: templateStats.length,
      publishedCount: templateStats.filter((t) => t.status === 'PUBLISHED').length,
      templates: templatesWithRevenue.sort((a, b) => b.revenue - a.revenue),
    });
  } catch (error) {
    console.error('GET /api/creator/stats error:', error);
    return NextResponse.json({ error: '服务器错误' }, { status: 500 });
  }
}
