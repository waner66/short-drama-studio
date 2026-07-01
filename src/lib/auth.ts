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

/**
 * 从请求中验证 JWT Token 并返回用户信息
 */
export async function authenticateRequest(request: NextRequest): Promise<AuthUser | null> {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null;
    }

    const token = authHeader.slice(7);
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
 * 需要认证的 API Route 包装器
 */
export function withAuth(
  handler: (request: NextRequest, user: AuthUser) => Promise<NextResponse>
) {
  return async (request: NextRequest) => {
    const user = await authenticateRequest(request);
    if (!user) {
      return NextResponse.json({ error: '未授权，请登录' }, { status: 401 });
    }
    return handler(request, user);
  };
}
