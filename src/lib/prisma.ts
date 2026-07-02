import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function getDatabaseUrl(): string {
  // Vercel IPv4 无法直连 Supabase（IPv6），使用 Transaction Pooler（端口6543）
  // 优先用 POOLER_DB_URL 直接传给 PrismaClient，绕过 Supabase 集成对 DATABASE_URL 的覆盖
  if (process.env.POOLER_DB_URL) {
    return process.env.POOLER_DB_URL;
  }
  return process.env.DATABASE_URL!;
}

const dbUrl = getDatabaseUrl();

export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  datasourceUrl: dbUrl,
});

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
