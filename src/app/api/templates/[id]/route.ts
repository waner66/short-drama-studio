import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const template = await prisma.template.findUnique({
      where: { id: params.id },
      include: {
        creator: {
          select: {
            id: true,
            username: true,
            avatarUrl: true,
            bio: true,
            role: true,
            _count: {
              select: {
                templates: { where: { status: 'PUBLISHED' } },
                followers: true,
              },
            },
          },
        },
        reviews: {
          take: 10,
          orderBy: { createdAt: 'desc' },
          include: {
            user: {
              select: {
                id: true,
                username: true,
                avatarUrl: true,
              },
            },
          },
        },
        _count: {
          select: {
            reviews: true,
            orders: true,
            favorites: true,
          },
        },
      },
    });

    if (!template) {
      return NextResponse.json({ error: '模板未找到' }, { status: 404 });
    }

    return NextResponse.json({
      ...template,
      price: Number(template.price),
    });
  } catch (error) {
    console.error('GET /api/templates/[id] error:', error);
    return NextResponse.json({ error: '服务器错误' }, { status: 500 });
  }
}
