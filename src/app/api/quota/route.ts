import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from '@/lib/auth';
import { getUserQuotas } from '@/lib/quota';

/**
 * GET /api/quota - 获取当前用户额度
 */
export const GET = withAuth(async (_request, user) => {
  try {
    const quotas = await getUserQuotas(user.userId);
    return NextResponse.json({ quotas });
  } catch (error) {
    console.error('Get quotas error:', error);
    return NextResponse.json({ error: '服务器错误' }, { status: 500 });
  }
});
