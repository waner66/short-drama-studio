import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'short-drama-studio-dev-secret-key-2026'
);

export interface AuthUser {
  userId: string;
  username: string;
  role: string;
}

export interface AuthRequest extends NextRequest {
  user?: AuthUser;
}

/**
 * 从请求中解析 JWT token 获取用户身份
 * 支持 Authorization header (Bearer) 和 cookie (token) 两种方式
 */
export async function getAuthUser(request: NextRequest): Promise<AuthUser | null> {
  try {
    // 优先从 Authorization header 读取
    const authHeader = request.headers.get('Authorization');
    let token: string | undefined;

    if (authHeader?.startsWith('Bearer ')) {
      token = authHeader.slice(7);
    } else {
      // 回退到 cookie
      token = request.cookies.get('token')?.value;
    }

    if (!token) return null;

    const { payload } = await jwtVerify(token, JWT_SECRET);
    return {
      userId: payload.userId as string,
      username: payload.username as string,
      role: payload.role as string,
    };
  } catch {
    return null;
  }
}

/**
 * API 鉴权中间件：未登录返回 401
 */
export async function requireAuth(request: NextRequest): Promise<{
  user: AuthUser | null;
  error?: NextResponse;
}> {
  const user = await getAuthUser(request);
  if (!user) {
    return {
      user: null,
      error: NextResponse.json({ error: '请先登录' }, { status: 401 }),
    };
  }
  return { user };
}

/**
 * 可选鉴权：已登录则返回 user，未登录返回 null（不报错）
 */
export async function optionalAuth(request: NextRequest): Promise<AuthUser | null> {
  return getAuthUser(request);
}

/**
 * 高阶函数：包装 API handler，自动鉴权
 * 用法: export const POST = withAuth(async (request, user) => { ... })
 */
export function withAuth(
  handler: (request: NextRequest, user: AuthUser) => Promise<NextResponse>
) {
  return async (request: NextRequest) => {
    const user = await getAuthUser(request);
    if (!user) {
      return NextResponse.json({ error: '请先登录' }, { status: 401 });
    }
    return handler(request, user);
  };
}
