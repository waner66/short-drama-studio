export function generateStaticParams() { return [{ no: "DEFAULT001" }]; }

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';

/**
 * GET /api/orders/[no]/status — 订单状态轮询
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { no: string } }
) {
  try {
    const { user, error } = await requireAuth(request);
    if (error) return error;

    const order = await prisma.order.findUnique({
      where: { orderNo: params.no },
      select: {
        orderNo: true,
        status: true,
        amount: true,
        paidAt: true,
        template: { select: { id: true, title: true, coverUrl: true } },
      },
    });

    if (!order) {
      return NextResponse.json({ error: '订单不存在' }, { status: 404 });
    }

    // 验证买家身份
    const fullOrder = await prisma.order.findUnique({
      where: { orderNo: params.no },
      select: { buyerId: true },
    });

    if (!fullOrder || fullOrder.buyerId !== user!.userId) {
      return NextResponse.json({ error: '无权查看此订单' }, { status: 403 });
    }

    return NextResponse.json({
      ...order,
      amount: Number(order.amount),
    });
  } catch (error) {
    console.error('GET /api/orders/[no]/status error:', error);
    return NextResponse.json({ error: '服务器错误' }, { status: 500 });
  }
}
