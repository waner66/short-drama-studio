import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/orders - 查询订单列表
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const buyerId = searchParams.get('buyerId');

    if (!buyerId) {
      return NextResponse.json({ error: '缺少 buyerId' }, { status: 400 });
    }

    const orders = await prisma.order.findMany({
      where: { buyerId },
      orderBy: { createdAt: 'desc' },
      include: { template: { select: { title: true } } },
    });

    return NextResponse.json({ orders });
  } catch (error) {
    console.error('List orders error:', error);
    return NextResponse.json({ error: '服务器错误' }, { status: 500 });
  }
}

// POST /api/orders - 创建订单
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { buyerId, templateId } = body;

    // 获取模板信息
    const template = await prisma.template.findUnique({
      where: { id: templateId },
    });

    if (!template) {
      return NextResponse.json({ error: '模板不存在' }, { status: 404 });
    }

    const amount = Number(template.price);
    const platformFee = Number((amount * 0.15).toFixed(2));
    const creatorRevenue = Number((amount - platformFee).toFixed(2));

    const order = await prisma.order.create({
      data: {
        buyerId,
        templateId,
        orderNo: `OD${Date.now()}`,
        amount,
        platformFee,
        creatorRevenue,
        status: 'PENDING',
      },
    });

    return NextResponse.json({ order }, { status: 201 });
  } catch (error) {
    console.error('Create order error:', error);
    return NextResponse.json({ error: '服务器错误' }, { status: 500 });
  }
}
