import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';

/**
 * GET /api/user/purchases — 已购模板列表
 */
export async function GET(request: NextRequest) {
  try {
    const { user, error } = await requireAuth(request);
    if (error) return error;

    const orders = await prisma.order.findMany({
      where: { buyerId: user!.userId, status: 'PAID' },
      orderBy: { paidAt: 'desc' },
      include: {
        template: {
          select: {
            id: true,
            title: true,
            creator: { select: { id: true, username: true } },
          },
        },
      },
    });

    const purchases = orders.map((o) => ({
      orderId: o.id,
      orderNo: o.orderNo,
      templateId: o.template.id,
      templateTitle: o.template.title,
      creator: o.template.creator.username,
      creatorId: o.template.creator.id,
      amount: Number(o.amount),
      paidAt: o.paidAt?.toISOString() || null,
    }));

    return NextResponse.json({ data: purchases, total: purchases.length });
  } catch (error) {
    console.error('GET /api/user/purchases error:', error);
    return NextResponse.json({ error: '服务器错误' }, { status: 500 });
  }
}
