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
    const { phone, email, password } = body;

    // 查找用户
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { phone: phone || undefined },
          { email: email || undefined },
        ].filter((condition) => condition.phone || condition.email),
      },
    });

    if (!user || !user.passwordHash) {
      return NextResponse.json({ error: '账号或密码错误' }, { status: 401 });
    }

    // 验证密码
    const isValid = await bcrypt.compare(password, user.passwordHash);
    if (!isValid) {
      return NextResponse.json({ error: '账号或密码错误' }, { status: 401 });
    }

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
    console.error('Login error:', error);
    return NextResponse.json({ error: '服务器错误' }, { status: 500 });
  }
}
