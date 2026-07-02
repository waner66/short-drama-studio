import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { SignJWT } from 'jose';
import {
  findUserByUsername,
  findUser,
  createUser,
  createUserQuotas,
  createUserSubscription,
} from '@/lib/supabase-client';

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'short-drama-studio-dev-secret-key-2026'
);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { username, phone, email, password } = body;

    if (!username || !password) {
      return NextResponse.json({ error: '用户名和密码不能为空' }, { status: 400 });
    }

    // 检查用户名是否已存在
    const existingByUsername = await findUserByUsername(username);
    if (existingByUsername) {
      return NextResponse.json({ error: '用户名已被使用' }, { status: 400 });
    }

    // 检查手机号是否已注册
    if (phone) {
      const phoneUser = await findUser(phone, undefined);
      if (phoneUser) {
        return NextResponse.json({ error: '该手机号已注册' }, { status: 400 });
      }
    }

    // 检查邮箱是否已注册
    if (email) {
      const emailUser = await findUser(undefined, email);
      if (emailUser) {
        return NextResponse.json({ error: '该邮箱已注册' }, { status: 400 });
      }
    }

    // 加密密码
    const passwordHash = await bcrypt.hash(password, 10);

    // 通过 Supabase REST API 创建用户
    const user = await createUser({
      username,
      phone: phone || null,
      email: email || null,
      passwordHash,
      role: 'USER',
    });

    // 创建免费额度（6种配额类型）
    try {
      await createUserQuotas(user.id, [
        { quotaType: 'TEXT_GEN', totalQuota: 3 },
        { quotaType: 'IMAGE_GEN', totalQuota: 5 },
        { quotaType: 'CHARACTER_GEN', totalQuota: 3 },
        { quotaType: 'SCENE_IMAGE', totalQuota: 3 },
        { quotaType: 'TTS', totalQuota: 500 },
        { quotaType: 'VIDEO_EXPORT', totalQuota: 1 },
      ]);

      // 创建免费订阅
      await createUserSubscription({
        userId: user.id,
        plan: 'FREE',
        status: 'ACTIVE',
      });
    } catch (quotaErr: any) {
      // 配额/订阅创建失败不影响注册（用户已创建成功）
      console.error('Create quota/subscription error:', quotaErr.message);
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

    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60,
      path: '/',
    });

    return response;
  } catch (error: any) {
    const message = error?.message || String(error);
    console.error('Register error:', message);
    return NextResponse.json(
      {
        error: '服务器错误',
        detail: process.env.NODE_ENV === 'production' ? undefined : message,
      },
      { status: 500 }
    );
  }
}
