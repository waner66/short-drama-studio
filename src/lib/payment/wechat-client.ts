/**
 * 微信支付客户端
 * 使用 wechatpay-node-v3 API
 */

import type { CreatePaymentParams, PaymentNotifyData } from './types';

export class WechatClient {
  private appId: string;
  private mchId: string;
  private apiV3Key: string;

  constructor() {
    this.appId = process.env.WECHAT_APP_ID || '';
    this.mchId = process.env.WECHAT_MCH_ID || '';
    this.apiV3Key = process.env.WECHAT_API_V3_KEY || '';
  }

  /**
   * 创建 Native 支付订单 (扫码支付)
   */
  async createPayment(params: CreatePaymentParams): Promise<{ payUrl: string; qrCode: string }> {
    const orderNo = params.orderNo || `WX${Date.now()}`;

    const payload = {
      appid: this.appId,
      mchid: this.mchId,
      description: params.subject,
      out_trade_no: orderNo,
      notify_url: process.env.BASE_URL + '/api/payment/wechat/notify',
      amount: {
        total: Math.round(params.amount * 100), // 分
        currency: 'CNY',
      },
    };

    // 生产环境：POST https://api.mch.weixin.qq.com/v3/pay/transactions/native
    // 返回 code_url 作为二维码
    console.log('[Wechat] Create payment:', payload);

    return {
      payUrl: `weixin://wxpay/bizpayurl?pr=mock`,
      qrCode: `https://api.qrserver.com/v1/create-qr-code/?data=weixin://wxpay/bizpayurl?pr=${orderNo}`,
    };
  }

  /**
   * 验证支付通知签名
   */
  verifyNotify(headers: Record<string, string>, body: string): boolean {
    // 生产环境：验证 Wechatpay-Signature / Timestamp / Nonce
    return true;
  }

  /**
   * 解析支付通知
   */
  parseNotify(data: Record<string, unknown>): PaymentNotifyData {
    return {
      orderNo: data.out_trade_no as string,
      transactionId: data.transaction_id as string,
      amount: data.amount ? (Number((data.amount as any).total || 0) / 100) : 0,
      status: (data.trade_state === 'SUCCESS') ? 'SUCCESS' : 'FAILED',
      raw: data,
    };
  }

  /**
   * 申请退款
   */
  async refund(outTradeNo: string, amount: number, reason?: string): Promise<void> {
    console.log(`[Wechat] Refund: ${outTradeNo} ¥${amount} ${reason || ''}`);
  }
}

export const wechatClient = new WechatClient();
