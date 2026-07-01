import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthUser } from '@/lib/auth';

const PLATFORM_FEE_RATE = 0.15;

/**
 * POST /api/payment/create
 * 创建支付订单（需 templateId）→ 写入 Prisma + 返回支付链接
 * 注意：推荐使用 POST /api/orders 代替，此端点保留向后兼容
 */
export async function POST(req: NextRequest) {
  try {
    const user = await getAuthUser(req);
    const body = await req.json();
    const { templateId, channel = 'ALIPAY', subject } = body;

    if (!templateId) {
      return NextResponse.json({ error: '缺少 templateId' }, { status: 400 });
    }

    // 加载模板
    const template = await prisma.template.findUnique({
      where: { id: templateId },
    });

    if (!template) {
      return NextResponse.json({ error: '模板不存在' }, { status: 404 });
    }

    if (template.status !== 'PUBLISHED') {
      return NextResponse.json({ error: '模板未上架' }, { status: 400 });
    }

    const userId = user?.userId || 'dev-user';
    if (template.creatorId === userId) {
      return NextResponse.json({ error: '不能购买自己的模板' }, { status: 400 });
    }

    // 防重复
    const existing = await prisma.order.findFirst({
      where: { buyerId: userId, templateId, status: 'PAID' },
    });
    if (existing) {
      return NextResponse.json({ error: '已购买过该模板', existingOrder: existing }, { status: 409 });
    }

    // 计算费用
    const amount = Number(template.price);
    const platformFee = amount * PLATFORM_FEE_RATE;
    const creatorRevenue = amount - platformFee;

    // 生成订单号
    const prefix = channel === 'WECHAT' ? 'WX' : 'ALI';
    const orderNo = `${prefix}${Date.now()}${Math.random().toString(36).slice(2, 8).toUpperCase()}`;

    // 写入 Prisma
    await prisma.order.create({
      data: {
        buyerId: userId,
        templateId,
        orderNo,
        amount,
        platformFee,
        creatorRevenue,
        status: 'PENDING',
      },
    });

    const paySubject = subject || template.title;

    if (channel === 'ALIPAY') {
      return NextResponse.json({
        orderNo,
        payUrl: `https://openapi.alipaydev.com/gateway.do?out_trade_no=${orderNo}&total_amount=${amount.toFixed(2)}&subject=${encodeURIComponent(paySubject)}`,
        qrCode: null,
      });
    }

    return NextResponse.json({
      orderNo,
      payUrl: `weixin://wxpay/bizpayurl?pr=${orderNo}`,
      qrCode: `https://api.qrserver.com/v1/create-qr-code/?data=weixin://wxpay/bizpayurl?pr=${orderNo}`,
    });
  } catch (error) {
    console.error('POST /api/payment/create error:', error);
    return NextResponse.json({ error: '服务器错误' }, { status: 500 });
  }
}
