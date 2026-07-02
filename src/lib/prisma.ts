import { PrismaClient } from '@prisma/client';

// Supabase Vercel 集成自动注入 DATABASE_URL（直连IPv6），
// POSTGRES_PRISMA_URL 是 Pooler 地址（IPv4兼容），优先使用
if (process.env.POSTGRES_PRISMA_URL) {
  process.env.DATABASE_URL = process.env.POSTGRES_PRISMA_URL;
}

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
