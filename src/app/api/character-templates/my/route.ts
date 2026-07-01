import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUserId } from '@/lib/auth-helper';

export async function GET(req: NextRequest) {
  const userId = getUserId(req);
  const templates = await prisma.characterTemplate.findMany({
    where: { creatorId: userId }, orderBy: { createdAt: 'desc' },
  });
  return NextResponse.json(templates);
}
