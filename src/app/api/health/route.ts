import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const checks: Record<string, { ok: boolean; detail?: string }> = {};

  // 1. 检查 DATABASE_URL 环境变量
  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl) {
    checks.db_env = { ok: false, detail: 'DATABASE_URL 环境变量未设置' };
    return NextResponse.json({ status: 'unhealthy', checks }, { status: 503 });
  }
  checks.db_env = {
    ok: true,
    detail: dbUrl.replace(/\/\/.*@/, '//***:***@'), // 隐藏密码
  };

  // 2. 检查 Prisma 数据库连接
  try {
    await prisma.$queryRaw`SELECT 1 AS health_check`;
    checks.db_connect = { ok: true, detail: '数据库连接正常' };
  } catch (err: any) {
    checks.db_connect = {
      ok: false,
      detail: err?.message || String(err),
    };
  }

  // 3. 检查是否能查询 User 表
  try {
    const count = await prisma.user.count();
    checks.db_tables = { ok: true, detail: `User 表存在，共 ${count} 条记录` };
  } catch (err: any) {
    checks.db_tables = {
      ok: false,
      detail: err?.message || String(err),
    };
  }

  // 4. 检查 JWT_SECRET
  checks.jwt = {
    ok: !!process.env.JWT_SECRET,
    detail: process.env.JWT_SECRET
      ? 'JWT_SECRET 已设置'
      : 'JWT_SECRET 未设置，使用默认 fallback',
  };

  // 5. 环境信息
  checks.env = {
    ok: true,
    detail: `NODE_ENV=${process.env.NODE_ENV || '未设置'}, VERCEL=${process.env.VERCEL || '否'}`,
  };

  const allOk = Object.values(checks).every((c) => c.ok);

  return NextResponse.json(
    { status: allOk ? 'healthy' : 'unhealthy', checks },
    { status: allOk ? 200 : 503 }
  );
}
