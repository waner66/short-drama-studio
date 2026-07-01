import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUserId } from '@/lib/auth-helper';

export async function GET(req: NextRequest) {
  const userId = getUserId(req);
  const purchases = await prisma.characterTemplatePurchase.findMany({
    where: { buyerId: userId, status: 'PAID' },
    include: { template: true }, orderBy: { createdAt: 'desc' },
  });
  return NextResponse.json(purchases);
}

export async function POST(req: NextRequest) {
  const userId = getUserId(req);
  const { templateId } = await req.json();
  const template = await prisma.characterTemplate.findUnique({ where: { id: templateId } });
  if (!template) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  const platformFee = Number((Number(template.price) * 0.15).toFixed(2));
  const purchase = await prisma.characterTemplatePurchase.create({
    data: { buyerId: userId, templateId, orderNo: `CTPL${Date.now()}`, amount: template.price, platformFee, creatorRevenue: Number((Number(template.price) - platformFee).toFixed(2)), status: 'PENDING' },
  });
  return NextResponse.json(purchase, { status: 201 });
}
