/**
 * 统一支付服务 (策略模式 — Prisma 持久化版)
 */
import { prisma } from '@/lib/prisma';
import type { CreatePaymentParams, PaymentChannel, RefundParams, PaymentNotifyData } from './types';
import { alipayClient } from './alipay-client';
import { wechatClient } from './wechat-client';

const PLATFORM_FEE_RATE = 0.15;

export const paymentService = {
  /**
   * 创建支付订单 → 写入 Prisma + 返回支付链接
   */
  async create(params: CreatePaymentParams) {
    const orderNo = params.orderNo || generateOrderNo(params.channel);
    const amount = params.amount;
    const platformFee = Number(amount) * PLATFORM_FEE_RATE;
    const creatorRevenue = Number(amount) - platformFee;

    // 写入数据库 (如 orderNo 是外部模板交易系统的号，则单独存)
    // 注意：paymentService.create 是支付侧抽象；订单主体创建应在 /api/orders/POST 中完成
    // 此处保留兼容旧调用方，但不重复创建 Order
    // 查询已有订单
    const existing = await prisma.order.findUnique({ where: { orderNo } });

    if (!existing) {
      // 旧调用路径：仅创建支付记录不回写 Order（向后兼容）
      console.warn(`[PaymentService] Order ${orderNo} not found in DB, payment-only flow`);
    }

    let payResult;
    if (params.channel === 'ALIPAY') {
      payResult = await alipayClient.createPayment({ ...params, orderNo });
    } else {
      payResult = await wechatClient.createPayment({ ...params, orderNo });
    }

    return {
      orderNo,
      payUrl: payResult.payUrl,
      qrCode: 'qrCode' in payResult ? payResult.qrCode : undefined,
    };
  },

  /**
   * 处理支付回调 → 更新 Prisma
   */
  async handleNotify(channel: PaymentChannel, rawData: Record<string, unknown>): Promise<PaymentNotifyData> {
    let notify: PaymentNotifyData;
    if (channel === 'ALIPAY') {
      notify = alipayClient.parseNotify(rawData);
    } else {
      notify = wechatClient.parseNotify(rawData);
    }

    if (notify.status === 'SUCCESS') {
      // 更新订单状态为 PAID
      const order = await prisma.order.findUnique({
        where: { orderNo: notify.orderNo },
      });

      if (order && order.status === 'PENDING') {
        await prisma.$transaction(async (tx) => {
          // 1. 更新订单
          await tx.order.update({
            where: { orderNo: notify.orderNo },
            data: {
              status: 'PAID',
              paidAt: new Date(),
            },
          });

          // 2. 更新模板销量
          await tx.template.update({
            where: { id: order.templateId },
            data: {
              salesCount: { increment: 1 },
              downloadCount: { increment: 1 },
            },
          });
        });

        console.log(`[PaymentService] Order ${notify.orderNo} → PAID, template ${order.templateId} salesCount++`);
      }
    }

    return notify;
  },

  /**
   * 查询订单状态
   */
  async getStatus(orderNo: string) {
    const order = await prisma.order.findUnique({
      where: { orderNo },
      select: {
        orderNo: true,
        status: true,
        amount: true,
        paidAt: true,
        template: { select: { title: true } },
      },
    });

    if (!order) return null;

    return {
      ...order,
      amount: Number(order.amount),
    };
  },

  /**
   * 退款
   */
  async refund(params: RefundParams) {
    const order = await prisma.order.findUnique({
      where: { orderNo: params.orderNo },
    });

    if (!order) throw new Error('订单不存在');
    if (order.status !== 'PAID') throw new Error('订单状态不允许退款');

    await prisma.order.update({
      where: { orderNo: params.orderNo },
      data: { status: 'REFUNDED' },
    });

    // 回调支付渠道退款
    // await alipayClient.refund(params.orderNo, params.amount || Number(order.amount), params.reason);

    return { success: true };
  },
};

function generateOrderNo(channel: PaymentChannel): string {
  const prefix = channel === 'ALIPAY' ? 'ALI' : 'WX';
  return `${prefix}${Date.now()}${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
}
