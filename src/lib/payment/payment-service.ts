/**
 * 统一支付服务 (策略模式 - 开发版)
 * 生产环境接入真实数据库
 */

import type { CreatePaymentParams, PaymentChannel, RefundParams, PaymentNotifyData } from './types';
import { alipayClient } from './alipay-client';
import { wechatClient } from './wechat-client';

// 内存存储 (开发阶段)
const orderStore = new Map<string, Record<string, unknown>>();

export const paymentService = {
  async create(params: CreatePaymentParams) {
    const orderNo = params.orderNo || generateOrderNo(params.channel);

    orderStore.set(orderNo, {
      userId: params.userId,
      orderNo,
      channel: params.channel,
      amount: params.amount,
      subject: params.subject,
      status: 'PENDING',
      createdAt: new Date().toISOString(),
    });

    let payResult;
    if (params.channel === 'ALIPAY') {
      payResult = await alipayClient.createPayment({ ...params, orderNo });
    } else {
      payResult = await wechatClient.createPayment({ ...params, orderNo });
    }

    return { orderNo, payUrl: payResult.payUrl, qrCode: 'qrCode' in payResult ? payResult.qrCode : undefined };
  },

  async handleNotify(channel: PaymentChannel, rawData: Record<string, unknown>): Promise<PaymentNotifyData> {
    let notify: PaymentNotifyData;
    if (channel === 'ALIPAY') {
      notify = alipayClient.parseNotify(rawData);
    } else {
      notify = wechatClient.parseNotify(rawData);
    }

    if (notify.status === 'SUCCESS') {
      const order = orderStore.get(notify.orderNo);
      if (order) {
        orderStore.set(notify.orderNo, { ...order, status: 'PAID', paidAt: new Date().toISOString(), transactionId: notify.transactionId });
      }
    }

    return notify;
  },

  async getStatus(orderNo: string) {
    return orderStore.get(orderNo) || null;
  },

  async refund(params: RefundParams) {
    const order = orderStore.get(params.orderNo);
    if (!order) throw new Error('Order not found');
    orderStore.set(params.orderNo, { ...order, status: 'REFUNDED' });
    return { success: true };
  },
};

function generateOrderNo(channel: PaymentChannel): string {
  const prefix = channel === 'ALIPAY' ? 'ALI' : 'WX';
  return `${prefix}${Date.now()}${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
}
