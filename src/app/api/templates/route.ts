import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { optionalAuth } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const sort = searchParams.get('sort') || 'hot';
    const search = searchParams.get('search') || '';
    const creatorId = searchParams.get('creatorId');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = Math.min(parseInt(searchParams.get('limit') || '20'), 50);

    const where: any = {
      status: 'PUBLISHED',
    };

    if (category && category !== 'all') {
      where.category = category;
    }

    if (creatorId) {
      where.creatorId = creatorId;
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    // 排序
    let orderBy: any = { createdAt: 'desc' };
    switch (sort) {
      case 'hot':
        orderBy = { salesCount: 'desc' };
        break;
      case 'new':
        orderBy = { publishedAt: 'desc' };
        break;
      case 'top':
        orderBy = { avgRating: 'desc' };
        break;
      case 'price_asc':
        orderBy = { price: 'asc' };
        break;
      case 'price_desc':
        orderBy = { price: 'desc' };
        break;
    }

    const [templates, total] = await Promise.all([
      prisma.template.findMany({
        where,
        orderBy,
        skip: (page - 1) * limit,
        take: limit,
        include: {
          creator: {
            select: {
              id: true,
              username: true,
              avatarUrl: true,
            },
          },
        },
      }),
      prisma.template.count({ where }),
    ]);

    // 序列化 Decimal -> Number
    const serialized = templates.map((t) => ({
      ...t,
      price: Number(t.price),
    }));

    return NextResponse.json({
      data: serialized,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('GET /api/templates error:', error);
    return NextResponse.json({ error: '服务器错误' }, { status: 500 });
  }
}
