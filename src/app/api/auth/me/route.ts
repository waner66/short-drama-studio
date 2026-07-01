import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';

/**
 * GET /api/auth/me
 * 验证当前 token 是否有效，返回用户信息
 * 用于前端判断登录状态
 */
export async function GET(request: NextRequest) {
  const { user, error } = await requireAuth(request);
  if (error) return error;

  return NextResponse.json({
    userId: user!.userId,
    username: user!.username,
    role: user!.role,
  });
}
