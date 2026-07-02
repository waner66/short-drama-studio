import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { SignJWT } from 'jose';
import { findUser } from '@/lib/supabase-client';

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'short-drama-studio-dev-secret-key-2026'
);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { phone, email, password } = body;

    // 输入验证
    if (!password) {
      return NextResponse.json({ error: '请输入密码' }, { status: 400 });
    }
    if (!phone && !email) {
      return NextResponse.json({ error: '请输入手机号或邮箱' }, { status: 400 });
    }

    // 通过 Supabase REST API 查找用户
    const user = await findUser(phone || undefined, email || undefined);

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

    const response = NextResponse.json({
      success: true,
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

    // 设置 httpOnly cookie，前端自动携带
    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60, // 7天
      path: '/',
    });

    return response;
  } catch (error: any) {
    const message = error?.message || String(error);
    console.error('Login error:', message);
    return NextResponse.json(
      {
        error: '服务器错误',
        detail: process.env.NODE_ENV === 'production' ? undefined : message,
      },
      { status: 500 }
    );
  }
}
