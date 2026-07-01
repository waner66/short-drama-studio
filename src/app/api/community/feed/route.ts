import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

/**
 * GET /api/community/feed — 社区动态流
 * 聚合最近模板上架、购买、评价事件，按时间倒序
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = Math.min(parseInt(searchParams.get('limit') || '20'), 50);

    // 并行获取三类事件
    const [published, reviews, purchases] = await Promise.all([
      // 最近上架的模板
      prisma.template.findMany({
        where: { status: 'PUBLISHED', publishedAt: { not: null } },
        orderBy: { publishedAt: 'desc' },
        take: limit,
        select: {
          id: true,
          title: true,
          price: true,
          category: true,
          tags: true,
          publishedAt: true,
          creator: { select: { id: true, username: true, avatarUrl: true } },
        },
      }),
      // 最近评价
      prisma.review.findMany({
        where: { status: 'PUBLISHED' },
        orderBy: { createdAt: 'desc' },
        take: limit,
        select: {
          id: true,
          rating: true,
          content: true,
          createdAt: true,
          user: { select: { id: true, username: true, avatarUrl: true } },
          template: { select: { id: true, title: true } },
        },
      }),
      // 最近购买（已支付）
      prisma.order.findMany({
        where: { status: 'PAID', paidAt: { not: null } },
        orderBy: { paidAt: 'desc' },
        take: limit,
        select: {
          id: true,
          amount: true,
          paidAt: true,
          buyer: { select: { id: true, username: true, avatarUrl: true } },
          template: {
            select: {
              id: true,
              title: true,
              price: true,
              category: true,
              creator: { select: { id: true, username: true } },
            },
          },
        },
      }),
    ]);

    // 组装统一 feed
    const feedItems: Array<{
      id: string;
      type: string;
      title: string;
      description?: string;
      user: string;
      userId: string;
      time: string;
      tags?: string[];
      price?: number;
      rating?: number;
      content?: string;
      templateId?: string;
      templateTitle?: string;
      creator?: { id: string; username: string };
    }> = [];

    for (const tpl of published) {
      feedItems.push({
        id: `pub-${tpl.id}`,
        type: 'publish',
        title: tpl.title,
        description: `新上架${tpl.category ? ` · ${tpl.category}` : ''}模板`,
        user: tpl.creator.username,
        userId: tpl.creator.id,
        time: tpl.publishedAt!.toISOString(),
        tags: tpl.tags || [],
        price: Number(tpl.price),
        templateId: tpl.id,
        templateTitle: tpl.title,
      });
    }

    for (const rev of reviews) {
      feedItems.push({
        id: `rev-${rev.id}`,
        type: 'review',
        title: `评价了「${rev.template.title}」`,
        description: rev.content || undefined,
        user: rev.user.username,
        userId: rev.user.id,
        time: rev.createdAt.toISOString(),
        rating: rev.rating,
        content: rev.content || undefined,
        templateId: rev.template.id,
        templateTitle: rev.template.title,
      });
    }

    for (const order of purchases) {
      feedItems.push({
        id: `buy-${order.id}`,
        type: 'purchase',
        title: `购买了「${order.template.title}」`,
        description: `来自创作者 ${order.template.creator.username}`,
        user: order.buyer.username,
        userId: order.buyer.id,
        time: order.paidAt!.toISOString(),
        price: Number(order.amount),
        templateId: order.template.id,
        templateTitle: order.template.title,
      });
    }

    // 按时间倒序合并，取前 limit 条
    feedItems.sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime());
    const result = feedItems.slice(0, limit);

    return NextResponse.json({ data: result, total: result.length });
  } catch (error) {
    console.error('GET /api/community/feed error:', error);
    return NextResponse.json({ error: '服务器错误' }, { status: 500 });
  }
}
