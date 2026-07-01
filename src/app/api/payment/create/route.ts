import { NextRequest, NextResponse } from 'next/server';
import { getUserId } from '@/lib/auth-helper';

/**
 * POST /api/payment/create
 * 创建支付订单，返回支付链接
 */
export async function POST(req: NextRequest) {
  const userId = getUserId(req);
  const body = await req.json();
  const { channel, amount, subject, body: payBody, orderNo } = body;

  if (!channel || !amount || !subject) {
    return NextResponse.json({ error: 'Missing required fields: channel, amount, subject' }, { status: 400 });
  }

  const generatedOrderNo = orderNo || `${channel === 'ALIPAY' ? 'ALI' : 'WX'}${Date.now()}`;

  // 开发模式：返回模拟支付链接
  if (channel === 'ALIPAY') {
    return NextResponse.json({
      orderNo: generatedOrderNo,
      payUrl: `https://openapi.alipaydev.com/gateway.do?out_trade_no=${generatedOrderNo}&total_amount=${amount}&subject=${encodeURIComponent(subject)}`,
      qrCode: null,
    });
  }

  return NextResponse.json({
    orderNo: generatedOrderNo,
    payUrl: `weixin://wxpay/bizpayurl?pr=${generatedOrderNo}`,
    qrCode: `https://api.qrserver.com/v1/create-qr-code/?data=weixin://wxpay/bizpayurl?pr=${generatedOrderNo}`,
  });
}
