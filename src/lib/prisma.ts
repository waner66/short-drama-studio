import { PrismaClient } from '@prisma/client';

// Vercel IPv4 无法直连 Supabase（需要IPv6），
// 用 Supabase Session Pooler（端口5432，IPv4兼容）
if (process.env.POOLER_DB_URL) {
  process.env.DATABASE_URL = process.env.POOLER_DB_URL;
}

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
