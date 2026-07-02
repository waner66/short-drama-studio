import { PrismaClient } from '@prisma/client';

// Vercel 上 Supabase 集成自动注入 DATABASE_URL（直连IPv6，不可用），
// 用独立注入的 POOLER_DATABASE_URL 覆盖（Pooler地址，IPv4兼容）
if (process.env.POOLER_DATABASE_URL) {
  process.env.DATABASE_URL = process.env.POOLER_DATABASE_URL;
}

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
