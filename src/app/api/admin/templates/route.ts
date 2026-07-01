import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';

/**
 * GET /api/admin/templates — 模板审核列表
 * 支持 status 参数筛选：REVIEWING（默认）/ PUBLISHED / DRAFT / DELISTED / ALL
 */
export async function GET(request: NextRequest) {
  try {
    const { user, error } = await requireAuth(request);
    if (error) return error;

    if (user!.role !== 'ADMIN') {
      return NextResponse.json({ error: '无权限' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') || 'REVIEWING';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = Math.min(parseInt(searchParams.get('limit') || '20'), 50);

    const where: any = {};
    if (status !== 'ALL') {
      where.status = status;
    }

    const [templates, total] = await Promise.all([
      prisma.template.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
        select: {
          id: true,
          title: true,
          description: true,
          price: true,
          status: true,
          salesCount: true,
          createdAt: true,
          publishedAt: true,
          creator: { select: { id: true, username: true } },
          _count: { select: { orders: true } },
        },
      }),
      prisma.template.count({ where }),
    ]);

    return NextResponse.json({
      data: templates.map((t) => ({
        id: t.id,
        title: t.title,
        description: t.description,
        price: Number(t.price),
        status: t.status,
        salesCount: t.salesCount,
        orders: t._count.orders,
        creator: t.creator.username,
        creatorId: t.creator.id,
        submittedAt: t.createdAt.toISOString().slice(0, 10),
        publishedAt: t.publishedAt?.toISOString().slice(0, 10) || null,
      })),
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  } catch (error) {
    console.error('GET /api/admin/templates error:', error);
    return NextResponse.json({ error: '服务器错误' }, { status: 500 });
  }
}

/**
 * PATCH /api/admin/templates — 审核操作
 * Body: { id: string, action: 'approve' | 'reject' }
 */
export async function PATCH(request: NextRequest) {
  try {
    const { user, error } = await requireAuth(request);
    if (error) return error;

    if (user!.role !== 'ADMIN') {
      return NextResponse.json({ error: '无权限' }, { status: 403 });
    }

    const body = await request.json();
    const { id, action } = body;

    if (!id || !action) {
      return NextResponse.json({ error: '缺少参数' }, { status: 400 });
    }

    const template = await prisma.template.findUnique({ where: { id } });
    if (!template) {
      return NextResponse.json({ error: '模板不存在' }, { status: 404 });
    }

    if (action === 'approve') {
      await prisma.template.update({
        where: { id },
        data: {
          status: 'PUBLISHED',
          publishedAt: new Date(),
        },
      });
      return NextResponse.json({ success: true, status: 'PUBLISHED' });
    } else if (action === 'reject') {
      await prisma.template.update({
        where: { id },
        data: { status: 'DELISTED' },
      });
      return NextResponse.json({ success: true, status: 'DELISTED' });
    } else {
      return NextResponse.json({ error: '无效的操作' }, { status: 400 });
    }
  } catch (error) {
    console.error('PATCH /api/admin/templates error:', error);
    return NextResponse.json({ error: '服务器错误' }, { status: 500 });
  }
}
