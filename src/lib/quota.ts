import { prisma } from '@/lib/prisma';

/**
 * 额度类型枚举
 */
export type QuotaType = 'TEXT_GEN' | 'IMAGE_GEN' | 'CHARACTER_GEN' | 'SCENE_IMAGE' | 'TTS' | 'VIDEO_EXPORT';

/**
 * 检查并消耗用户额度
 * @returns { allowed: boolean, remaining: number }
 */
export async function checkAndConsumeQuota(
  userId: string,
  quotaType: QuotaType,
  amount: number = 1
): Promise<{ allowed: boolean; remaining: number }> {
  const quota = await prisma.userQuota.findUnique({
    where: { userId_quotaType: { userId, quotaType } },
  });

  if (!quota) {
    // 没有该类型的额度记录，默认不允许
    return { allowed: false, remaining: 0 };
  }

  const remaining = quota.totalQuota - quota.usedQuota;

  if (remaining < amount) {
    return { allowed: false, remaining: Math.max(0, remaining) };
  }

  // 消耗额度
  await prisma.userQuota.update({
    where: { id: quota.id },
    data: { usedQuota: quota.usedQuota + amount },
  });

  return { allowed: true, remaining: remaining - amount };
}

/**
 * 获取用户剩余额度
 */
export async function getUserQuotas(userId: string) {
  const quotas = await prisma.userQuota.findMany({
    where: { userId },
  });

  return quotas.map((q) => ({
    type: q.quotaType,
    total: q.totalQuota,
    used: q.usedQuota,
    remaining: q.totalQuota - q.usedQuota,
    resetPeriod: q.resetPeriod,
  }));
}

/**
 * 重置月度额度
 */
export async function resetMonthlyQuotas() {
  const now = new Date();
  await prisma.userQuota.updateMany({
    where: {
      resetPeriod: 'MONTHLY',
      resetAt: { lte: now },
    },
    data: {
      usedQuota: 0,
      resetAt: new Date(now.getFullYear(), now.getMonth() + 1, 1),
    },
  });
}
