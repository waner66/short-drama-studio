/**
 * 支付宝支付客户端
 * 使用 alipay-sdk (需企业资质配置)
 */

import type { CreatePaymentParams, PaymentNotifyData } from './types';

export class AlipayClient {
  private appId: string;
  private privateKey: string;
  private publicKey: string;
  private gateway: string;

  constructor() {
    this.appId = process.env.ALIPAY_APP_ID || '';
    this.privateKey = process.env.ALIPAY_PRIVATE_KEY || '';
    this.publicKey = process.env.ALIPAY_PUBLIC_KEY || '';
    this.gateway = 'https://openapi.alipay.com/gateway.do';
  }

  /**
   * 创建支付订单 (PC 网页支付)
   */
  async createPayment(params: CreatePaymentParams): Promise<{ payUrl: string }> {
    const bizContent = JSON.stringify({
      out_trade_no: params.orderNo || `ORD${Date.now()}`,
      product_code: 'FAST_INSTANT_TRADE_PAY',
      total_amount: params.amount.toFixed(2),
      subject: params.subject,
      body: params.body || params.subject,
    });

    // 构建签名字符串 (简化版，生产环境使用 alipay-sdk)
    const signParams = {
      app_id: this.appId,
      method: 'alipay.trade.page.pay',
      charset: 'utf-8',
      sign_type: 'RSA2',
      timestamp: new Date().toISOString().replace(/[TZ]/g, ' ').trim(),
      version: '1.0',
      notify_url: process.env.BASE_URL + '/api/payment/alipay/notify',
      return_url: params.returnUrl || process.env.BASE_URL + '/dashboard/orders',
      biz_content: bizContent,
    };

    const queryString = new URLSearchParams(signParams as any).toString();
    const payUrl = `${this.gateway}?${queryString}&sign=mock_signature_dev`;

    return { payUrl };
  }

  /**
   * 验证异步通知签名
   */
  verifyNotify(params: Record<string, unknown>): boolean {
    // 生产环境：使用 alipay-sdk 验证 RSA2 签名
    return true; // 开发阶段跳过验签
  }

  /**
   * 解析支付通知
   */
  parseNotify(params: Record<string, unknown>): PaymentNotifyData {
    return {
      orderNo: params.out_trade_no as string,
      transactionId: params.trade_no as string,
      amount: Number(params.total_amount as string || '0'),
      status: (params.trade_status === 'TRADE_SUCCESS') ? 'SUCCESS' : 'FAILED',
      raw: params,
    };
  }

  /**
   * 申请退款
   */
  async refund(outTradeNo: string, amount: number, reason?: string): Promise<void> {
    // 生产环境调用 alipay.trade.refund
    console.log(`[Alipay] Refund: ${outTradeNo} ¥${amount} ${reason || ''}`);
  }
}

export const alipayClient = new AlipayClient();
