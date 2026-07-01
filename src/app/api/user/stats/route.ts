import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';

/**
 * GET /api/user/stats — 用户统计概览
 * 返回：项目数、角色数、已购模板数、模板收益
 */
export async function GET(request: NextRequest) {
  try {
    const { user, error } = await requireAuth(request);
    if (error) return error;

    const userId = user!.userId;

    const [projectCount, characterCount, purchaseCount, revenueAgg, templateCount] =
      await Promise.all([
        prisma.project.count({ where: { userId } }),
        prisma.character.count({ where: { userId } }),
        prisma.order.count({ where: { buyerId: userId, status: 'PAID' } }),
        prisma.order.aggregate({
          where: { template: { creatorId: userId }, status: 'PAID' },
          _sum: { creatorRevenue: true },
        }),
        prisma.template.count({ where: { creatorId: userId } }),
      ]);

    return NextResponse.json({
      projects: projectCount,
      characters: characterCount,
      purchasedTemplates: purchaseCount,
      templateRevenue: Number(revenueAgg._sum.creatorRevenue || 0),
      myTemplates: templateCount,
    });
  } catch (error) {
    console.error('GET /api/user/stats error:', error);
    return NextResponse.json({ error: '服务器错误' }, { status: 500 });
  }
}
