import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';

/**
 * POST /api/orders/[no]/download — 已购模板内容交付
 * 验证用户已支付 → 返回模板所有内容数据
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
      include: {
        template: {
          include: {
            contents: {
              orderBy: { sortOrder: 'asc' },
            },
            creator: {
              select: { id: true, username: true },
            },
          },
        },
      },
    });

    if (!order) {
      return NextResponse.json({ error: '订单不存在' }, { status: 404 });
    }

    if (order.buyerId !== user!.userId) {
      return NextResponse.json({ error: '无权查看此订单' }, { status: 403 });
    }

    if (order.status !== 'PAID') {
      return NextResponse.json({ error: '订单未支付，无法下载' }, { status: 402 });
    }

    return NextResponse.json({
      orderNo: order.orderNo,
      amount: Number(order.amount),
      paidAt: order.paidAt,
      template: {
        id: order.template.id,
        title: order.template.title,
        description: order.template.description,
        category: order.template.category,
        tags: order.template.tags,
        creator: order.template.creator,
        contents: order.template.contents.map((c) => ({
          contentType: c.contentType,
          data: c.contentData,
        })),
        metadata: order.template.metadata,
      },
    });
  } catch (error) {
    console.error('GET /api/orders/[no]/download error:', error);
    return NextResponse.json({ error: '服务器错误' }, { status: 500 });
  }
}
