import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const { user, error } = await requireAuth(request);
    if (error) return error;

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = Math.min(parseInt(searchParams.get('limit') || '20'), 50);

    const where: any = {
      buyerId: user!.userId,
    };

    if (status && status !== 'all') {
      where.status = status.toUpperCase();
    }

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
        include: {
          template: {
            select: {
              id: true,
              title: true,
              coverUrl: true,
              previewUrl: true,
            },
          },
        },
      }),
      prisma.order.count({ where }),
    ]);

    const serialized = orders.map((o) => ({
      ...o,
      amount: Number(o.amount),
      platformFee: Number(o.platformFee),
      creatorRevenue: Number(o.creatorRevenue),
    }));

    return NextResponse.json({
      data: serialized,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  } catch (error) {
    console.error('GET /api/orders error:', error);
    return NextResponse.json({ error: '服务器错误' }, { status: 500 });
  }
}
