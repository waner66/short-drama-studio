/**
 * 支付统一类型定义
 */

export type PaymentChannel = 'ALIPAY' | 'WECHAT';

export type PaymentStatus = 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED' | 'CANCELLED';

export interface PaymentOrder {
  id: string;
  userId: string;
  orderNo: string;
  channel: PaymentChannel;
  amount: number;
  subject: string;
  body?: string;
  status: PaymentStatus;
  transactionId?: string;
  payUrl?: string;
  qrCode?: string;
  notifyData?: Record<string, unknown>;
  createdAt: string;
  paidAt?: string;
}

export interface CreatePaymentParams {
  userId: string;
  channel: PaymentChannel;
  amount: number;
  subject: string;
  body?: string;
  orderNo?: string;
  returnUrl?: string;
}

export interface RefundParams {
  orderNo: string;
  amount?: number;
  reason?: string;
}

export interface PaymentNotifyData {
  orderNo: string;
  transactionId: string;
  amount: number;
  status: 'SUCCESS' | 'FAILED';
  raw: Record<string, unknown>;
}
