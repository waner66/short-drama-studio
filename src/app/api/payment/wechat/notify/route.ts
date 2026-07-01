import { NextRequest, NextResponse } from 'next/server';

/**
 * POST /api/payment/wechat/notify
 * 微信支付异步回调
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.text();
    const data = JSON.parse(body);

    console.log('[Wechat Notify]', data);

    // 验证签名 (生产环境)
    // 更新订单状态
    if (data.trade_state === 'SUCCESS') {
      console.log(`[Wechat] Payment success: ${data.out_trade_no}`);
      // TODO: 更新订单状态为 PAID
    }

    return NextResponse.json({ code: 'SUCCESS', message: 'OK' });
  } catch (error) {
    console.error('[Wechat Notify] Error:', error);
    return NextResponse.json({ code: 'FAIL', message: 'Error' }, { status: 500 });
  }
}
