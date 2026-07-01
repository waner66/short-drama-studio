import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { SignJWT } from 'jose';
import { prisma } from '@/lib/prisma';

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'short-drama-studio-dev-secret-key-2026'
);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { username, phone, email, password } = body;

    // 检查用户名是否已存在
    const existingUser = await prisma.user.findUnique({
      where: { username },
    });
    if (existingUser) {
      return NextResponse.json({ error: '用户名已被使用' }, { status: 400 });
    }

    // 检查手机号/邮箱是否已注册
    if (phone) {
      const phoneUser = await prisma.user.findUnique({ where: { phone } });
      if (phoneUser) {
        return NextResponse.json({ error: '该手机号已注册' }, { status: 400 });
      }
    }
    if (email) {
      const emailUser = await prisma.user.findUnique({ where: { email } });
      if (emailUser) {
        return NextResponse.json({ error: '该邮箱已注册' }, { status: 400 });
      }
    }

    // 加密密码
    const passwordHash = await bcrypt.hash(password, 10);

    // 创建用户 + 免费额度 + 免费订阅
    const user = await prisma.user.create({
      data: {
        username,
        phone: phone || null,
        email: email || null,
        passwordHash,
        role: 'USER',
        // 创建免费额度
        quotas: {
          create: [
            { quotaType: 'TEXT_GEN', totalQuota: 3, usedQuota: 0, resetPeriod: 'ONETIME' },
            { quotaType: 'IMAGE_GEN', totalQuota: 5, usedQuota: 0, resetPeriod: 'ONETIME' },
            { quotaType: 'CHARACTER_GEN', totalQuota: 3, usedQuota: 0, resetPeriod: 'ONETIME' },
            { quotaType: 'SCENE_IMAGE', totalQuota: 3, usedQuota: 0, resetPeriod: 'ONETIME' },
            { quotaType: 'TTS', totalQuota: 500, usedQuota: 0, resetPeriod: 'ONETIME' },
            { quotaType: 'VIDEO_EXPORT', totalQuota: 1, usedQuota: 0, resetPeriod: 'ONETIME' },
          ],
        },
        // 免费订阅
        subscription: {
          create: {
            plan: 'FREE',
            status: 'ACTIVE',
          },
        },
      },
    });

    // 生成 JWT
    const token = await new SignJWT({
      userId: user.id,
      username: user.username,
      role: user.role,
    })
      .setProtectedHeader({ alg: 'HS256' })
      .setExpirationTime('7d')
      .sign(JWT_SECRET);

    return NextResponse.json({
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        phone: user.phone,
        avatarUrl: user.avatarUrl,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Register error:', error);
    return NextResponse.json({ error: '服务器错误' }, { status: 500 });
  }
}
