import { NextRequest, NextResponse } from 'next/server';

/**
 * POST /api/payment/alipay/notify
 * 支付宝支付异步回调
 */
export async function POST(req: NextRequest) {
  try {
    const formData = await req.text();
    const params = Object.fromEntries(new URLSearchParams(formData));

    console.log('[Alipay Notify]', params);

    // 验证签名 (生产环境)
    // 更新订单状态
    const orderNo = params.out_trade_no;
    const tradeStatus = params.trade_status;

    if (tradeStatus === 'TRADE_SUCCESS') {
      console.log(`[Alipay] Payment success: ${orderNo}`);
      // TODO: 更新订单状态为 PAID
    }

    return new NextResponse('success', { status: 200 });
  } catch (error) {
    console.error('[Alipay Notify] Error:', error);
    return new NextResponse('fail', { status: 500 });
  }
}
