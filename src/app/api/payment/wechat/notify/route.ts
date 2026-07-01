import { NextRequest, NextResponse } from 'next/server';
import { paymentService } from '@/lib/payment/payment-service';

/**
 * POST /api/payment/wechat/notify
 * 微信支付异步回调 → 更新 Prisma 订单状态
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.text();
    const data = JSON.parse(body);

    console.log('[Wechat Notify]', data);

    if (data.trade_state === 'SUCCESS' && data.out_trade_no) {
      await paymentService.handleNotify('WECHAT', {
        out_trade_no: data.out_trade_no,
        transaction_id: data.transaction_id || `MOCK_${Date.now()}`,
        amount: { total: Math.round((data.amount?.total || 0) * 1) },
        trade_state: 'SUCCESS',
      });
    }

    return NextResponse.json({ code: 'SUCCESS', message: 'OK' });
  } catch (error) {
    console.error('[Wechat Notify] Error:', error);
    return NextResponse.json({ code: 'FAIL', message: 'Error' }, { status: 500 });
  }
}
