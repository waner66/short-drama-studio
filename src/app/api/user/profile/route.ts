import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';

/**
 * GET /api/user/profile — 获取当前用户资料
 */
export async function GET(request: NextRequest) {
  try {
    const { user, error } = await requireAuth(request);
    if (error) return error;

    const profile = await prisma.user.findUnique({
      where: { id: user!.userId },
      select: {
        id: true,
        username: true,
        email: true,
        phone: true,
        avatarUrl: true,
        bio: true,
        role: true,
        createdAt: true,
        subscription: {
          select: { plan: true, status: true, expiresAt: true },
        },
      },
    });

    if (!profile) {
      return NextResponse.json({ error: '用户不存在' }, { status: 404 });
    }

    return NextResponse.json({
      id: profile.id,
      username: profile.username,
      email: profile.email,
      phone: profile.phone,
      avatar: profile.avatarUrl,
      bio: profile.bio,
      role: profile.role,
      memberLevel:
        profile.subscription?.status === 'ACTIVE'
          ? profile.subscription.plan === 'PRO'
            ? '专业版'
            : '创作者版'
          : '免费版',
      createdAt: profile.createdAt.toISOString(),
    });
  } catch (error) {
    console.error('GET /api/user/profile error:', error);
    return NextResponse.json({ error: '服务器错误' }, { status: 500 });
  }
}

/**
 * PUT /api/user/profile — 更新当前用户资料
 */
export async function PUT(request: NextRequest) {
  try {
    const { user, error } = await requireAuth(request);
    if (error) return error;

    const body = await request.json();
    const { username, bio, avatarUrl } = body;

    const updateData: any = {};
    if (bio !== undefined) updateData.bio = bio;
    if (avatarUrl !== undefined) updateData.avatarUrl = avatarUrl;
    if (username !== undefined && username.trim()) {
      // 检查用户名是否已存在
      const existing = await prisma.user.findUnique({ where: { username } });
      if (existing && existing.id !== user!.userId) {
        return NextResponse.json({ error: '用户名已被占用' }, { status: 409 });
      }
      updateData.username = username.trim();
    }

    const updated = await prisma.user.update({
      where: { id: user!.userId },
      data: updateData,
      select: {
        id: true,
        username: true,
        email: true,
        avatarUrl: true,
        bio: true,
        role: true,
      },
    });

    return NextResponse.json({
      id: updated.id,
      username: updated.username,
      email: updated.email,
      avatar: updated.avatarUrl,
      bio: updated.bio,
      role: updated.role,
    });
  } catch (error) {
    console.error('PUT /api/user/profile error:', error);
    return NextResponse.json({ error: '服务器错误' }, { status: 500 });
  }
}
