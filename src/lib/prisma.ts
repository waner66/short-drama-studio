import { PrismaClient } from '@prisma/client';

// Vercel 上 Supabase 集成自动注入 DATABASE_URL（Pooler不可用），
// 用 DIRECT_DB_URL 直连标准端口5432（绕过Pooler的IPv6/认证问题）
if (process.env.DIRECT_DB_URL) {
  process.env.DATABASE_URL = process.env.DIRECT_DB_URL;
}

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
