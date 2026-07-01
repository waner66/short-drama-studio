import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';

/**
 * GET /api/admin/orders — 订单管理列表
 */
export async function GET(request: NextRequest) {
  try {
    const { user, error } = await requireAuth(request);
    if (error) return error;

    if (user!.role !== 'ADMIN') {
      return NextResponse.json({ error: '无权限' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = Math.min(parseInt(searchParams.get('limit') || '20'), 50);

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
        select: {
          id: true,
          orderNo: true,
          amount: true,
          platformFee: true,
          status: true,
          paidAt: true,
          createdAt: true,
          buyer: { select: { id: true, username: true } },
          template: {
            select: {
              id: true,
              title: true,
              creator: { select: { id: true, username: true } },
            },
          },
        },
      }),
      prisma.order.count(),
    ]);

    return NextResponse.json({
      data: orders.map((o) => ({
        id: o.id,
        orderNo: o.orderNo,
        buyer: o.buyer.username,
        buyerId: o.buyer.id,
        seller: o.template.creator.username,
        sellerId: o.template.creator.id,
        template: o.template.title,
        templateId: o.template.id,
        amount: Number(o.amount),
        platformFee: Number(o.platformFee),
        status: o.status,
        paidAt: o.paidAt?.toISOString() || null,
        createdAt: o.createdAt.toISOString(),
      })),
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  } catch (error) {
    console.error('GET /api/admin/orders error:', error);
    return NextResponse.json({ error: '服务器错误' }, { status: 500 });
  }
}
