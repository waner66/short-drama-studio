import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';

/**
 * GET /api/admin/stats — 后台数据概览
 * 返回：总用户、模板、今日订单、平台收入、新增用户、待审核
 */
export async function GET(request: NextRequest) {
  try {
    const { user, error } = await requireAuth(request);
    if (error) return error;

    // 管理员检查
    if (user!.role !== 'ADMIN') {
      return NextResponse.json({ error: '无权限' }, { status: 403 });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);

    const [
      totalUsers,
      totalTemplates,
      todayOrders,
      platformRevenue,
      todayNewUsers,
      pendingTemplates,
      recentOrders,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.template.count(),
      prisma.order.count({ where: { createdAt: { gte: today } } }),
      prisma.order.aggregate({
        where: { status: 'PAID' },
        _sum: { platformFee: true },
      }),
      prisma.user.count({ where: { createdAt: { gte: today } } }),
      prisma.template.count({ where: { status: 'REVIEWING' } }),
      prisma.order.findMany({
        where: { status: 'PAID' },
        orderBy: { paidAt: 'desc' },
        take: 5,
        select: {
          orderNo: true,
          amount: true,
          status: true,
          paidAt: true,
          buyer: { select: { username: true } },
          template: { select: { title: true } },
        },
      }),
    ]);

    return NextResponse.json({
      totalUsers,
      totalTemplates,
      todayOrders,
      platformRevenue: Math.round(Number(platformRevenue._sum.platformFee || 0)),
      todayNewUsers,
      pendingTemplates,
      recentOrders: recentOrders.map((o) => ({
        orderNo: o.orderNo,
        buyer: o.buyer.username,
        template: o.template.title,
        amount: Number(o.amount),
        status: o.status,
      })),
    });
  } catch (error) {
    console.error('GET /api/admin/stats error:', error);
    return NextResponse.json({ error: '服务器错误' }, { status: 500 });
  }
}
