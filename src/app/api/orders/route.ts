import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';

// 平台抽成比例
const PLATFORM_FEE_RATE = 0.15;

/**
 * GET /api/orders — 我的订单列表（需登录）
 */
export async function GET(request: NextRequest) {
  try {
    const { user, error } = await requireAuth(request);
    if (error) return error;

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = Math.min(parseInt(searchParams.get('limit') || '20'), 50);

    const where: any = {
      buyerId: user!.userId,
    };

    if (status && status !== 'all') {
      where.status = status.toUpperCase();
    }

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
        include: {
          template: {
            select: {
              id: true,
              title: true,
              coverUrl: true,
              previewUrl: true,
              category: true,
            },
          },
        },
      }),
      prisma.order.count({ where }),
    ]);

    const serialized = orders.map((o) => ({
      ...o,
      amount: Number(o.amount),
      platformFee: Number(o.platformFee),
      creatorRevenue: Number(o.creatorRevenue),
    }));

    return NextResponse.json({
      data: serialized,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  } catch (error) {
    console.error('GET /api/orders error:', error);
    return NextResponse.json({ error: '服务器错误' }, { status: 500 });
  }
}

/**
 * POST /api/orders — 创建订单（需登录）
 * Body: { templateId, channel?: 'ALIPAY' | 'WECHAT' }
 */
export async function POST(request: NextRequest) {
  try {
    const { user, error } = await requireAuth(request);
    if (error) return error;

    const body = await request.json();
    const { templateId, channel = 'ALIPAY' } = body;

    if (!templateId) {
      return NextResponse.json({ error: '缺少模板ID' }, { status: 400 });
    }

    // 1. 加载模板
    const template = await prisma.template.findUnique({
      where: { id: templateId },
    });

    if (!template) {
      return NextResponse.json({ error: '模板不存在' }, { status: 404 });
    }

    if (template.status !== 'PUBLISHED') {
      return NextResponse.json({ error: '模板未上架' }, { status: 400 });
    }

    // 2. 不能买自己的模板
    if (template.creatorId === user!.userId) {
      return NextResponse.json({ error: '不能购买自己的模板' }, { status: 400 });
    }

    // 3. 检查是否已购买（防重复）
    const existingOrder = await prisma.order.findFirst({
      where: {
        buyerId: user!.userId,
        templateId,
        status: 'PAID',
      },
    });

    if (existingOrder) {
      return NextResponse.json({ error: '你已经购买过该模板', existingOrder }, { status: 409 });
    }

    // 4. 计算费用
    const amount = template.price;
    const platformFee = Number(amount) * PLATFORM_FEE_RATE;
    const creatorRevenue = Number(amount) - platformFee;

    // 5. 生成订单号
    const prefix = channel === 'WECHAT' ? 'WX' : 'ALI';
    const orderNo = `${prefix}${Date.now()}${Math.random().toString(36).slice(2, 8).toUpperCase()}`;

    // 6. 创建订单
    const order = await prisma.order.create({
      data: {
        buyerId: user!.userId,
        templateId,
        orderNo,
        amount,
        platformFee,
        creatorRevenue,
        status: 'PENDING',
      },
      include: {
        template: {
          select: {
            id: true,
            title: true,
            coverUrl: true,
          },
        },
      },
    });

    // 7. 生成模拟支付链接
    const payUrl = channel === 'ALIPAY'
      ? `https://openapi.alipaydev.com/gateway.do?out_trade_no=${orderNo}&total_amount=${Number(amount).toFixed(2)}&subject=${encodeURIComponent(template.title)}`
      : `weixin://wxpay/bizpayurl?pr=${orderNo}`;

    return NextResponse.json({
      ...order,
      amount: Number(order.amount),
      platformFee: Number(order.platformFee),
      creatorRevenue: Number(order.creatorRevenue),
      payUrl,
    }, { status: 201 });
  } catch (error) {
    console.error('POST /api/orders error:', error);
    return NextResponse.json({ error: '服务器错误' }, { status: 500 });
  }
}
