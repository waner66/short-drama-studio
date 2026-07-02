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
    detail: dbUrl.replace(/(\/\/)([^:]+):([^@]+)@/, '$1$2:***@'), // 隐藏密码但显示用户名
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

  // 6. 检查 Supabase REST API（auth 登录/注册使用此方式）
  try {
    const supabaseUrl = process.env.SUPABASE_URL || 'https://tdeggpmxmgqgcrceymec.supabase.co';
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!serviceKey) {
      checks.supabase_rest = {
        ok: false,
        detail: 'SUPABASE_SERVICE_ROLE_KEY 未设置，登录/注册将无法工作',
      };
    } else {
      const res = await fetch(`${supabaseUrl}/rest/v1/User?select=id&limit=1`, {
        headers: {
          apikey: serviceKey,
          Authorization: `Bearer ${serviceKey}`,
        },
      });
      if (res.ok) {
        const users = await res.json();
        checks.supabase_rest = {
          ok: true,
          detail: `Supabase REST API 正常，User 表存在，返回 ${users.length} 条`,
        };
      } else {
        const errText = await res.text();
        checks.supabase_rest = {
          ok: false,
          detail: `HTTP ${res.status}: ${errText.substring(0, 200)}`,
        };
      }
    }
  } catch (err: any) {
    checks.supabase_rest = {
      ok: false,
      detail: err?.message || String(err),
    };
  }

  // 7. 打印所有 Supabase/DB 相关环境变量（排查用）
  const dbEnvKeys = [
    'DATABASE_URL', 'DIRECT_URL', 'POOLER_DB_URL',
    'POSTGRES_URL', 'POSTGRES_PRISMA_URL', 'POSTGRES_URL_NON_POOLING', 'POSTGRES_URL_NO_SSL',
    'POSTGRES_USER', 'POSTGRES_HOST', 'POSTGRES_PASSWORD', 'POSTGRES_DATABASE',
    'SUPABASE_URL', 'SUPABASE_ANON_KEY', 'SUPABASE_SERVICE_ROLE_KEY',
    'NEXT_PUBLIC_SUPABASE_URL', 'NEXT_PUBLIC_SUPABASE_ANON_KEY',
  ];
  const dbEnvDump: Record<string, string> = {};
  for (const key of dbEnvKeys) {
    const val = process.env[key];
    if (val) {
      // Hide passwords, show username
      dbEnvDump[key] = val.replace(/(\/\/)([^:]+):([^@]+)@/, '$1$2:***@');
    } else {
      dbEnvDump[key] = '(未设置)';
    }
  }
  checks.db_env_dump = { ok: true, detail: JSON.stringify(dbEnvDump) };

  const allOk = Object.values(checks).every((c) => c.ok);

  return NextResponse.json(
    { status: allOk ? 'healthy' : 'unhealthy', checks },
    { status: allOk ? 200 : 503 }
  );
}
