export function generateStaticParams() { return [{ no: "DEFAULT001" }]; }

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';

/**
 * POST /api/orders/[no]/cancel — 取消订单
 */
export async function POST(
  request: NextRequest,
  { params }: { params: { no: string } }
) {
  try {
    const { user, error } = await requireAuth(request);
    if (error) return error;

    const order = await prisma.order.findUnique({
      where: { orderNo: params.no },
    });

    if (!order) {
      return NextResponse.json({ error: '订单不存在' }, { status: 404 });
    }

    if (order.buyerId !== user!.userId) {
      return NextResponse.json({ error: '无权操作此订单' }, { status: 403 });
    }

    if (order.status !== 'PENDING') {
      return NextResponse.json({ error: `订单状态为 ${order.status}，无法取消` }, { status: 400 });
    }

    const updated = await prisma.order.update({
      where: { orderNo: params.no },
      data: { status: 'CANCELLED' },
    });

    return NextResponse.json({
      ...updated,
      amount: Number(updated.amount),
      platformFee: Number(updated.platformFee),
      creatorRevenue: Number(updated.creatorRevenue),
    });
  } catch (error) {
    console.error('POST /api/orders/[no]/cancel error:', error);
    return NextResponse.json({ error: '服务器错误' }, { status: 500 });
  }
}
