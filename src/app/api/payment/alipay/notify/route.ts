import { NextRequest, NextResponse } from 'next/server';
import { paymentService } from '@/lib/payment/payment-service';

/**
 * POST /api/payment/alipay/notify
 * 支付宝支付异步回调 → 更新 Prisma 订单状态
 */
export async function POST(req: NextRequest) {
  try {
    const formData = await req.text();
    const params = Object.fromEntries(new URLSearchParams(formData));

    console.log('[Alipay Notify]', params);

    const orderNo = params.out_trade_no;
    const tradeStatus = params.trade_status;

    if (tradeStatus === 'TRADE_SUCCESS' && orderNo) {
      await paymentService.handleNotify('ALIPAY', {
        out_trade_no: orderNo,
        trade_no: params.trade_no || `MOCK_${Date.now()}`,
        total_amount: params.total_amount || '0',
        trade_status: 'TRADE_SUCCESS',
      });
    }

    return new NextResponse('success', { status: 200 });
  } catch (error) {
    console.error('[Alipay Notify] Error:', error);
    return new NextResponse('fail', { status: 500 });
  }
}
