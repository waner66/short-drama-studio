import { NextRequest } from 'next/server';

/**
 * 从请求中提取用户ID，始终返回有效ID（开发阶段）
 */
export function getUserId(req: NextRequest): string {
  const userId = extractUserId(req);
  return userId || 'dev-user';
}

/**
 * 提取真实用户ID，可能为 null
 */
export function extractUserId(req: NextRequest): string | null {
  const authHeader = req.headers.get('authorization');
  if (authHeader?.startsWith('Bearer ')) {
    try {
      const token = authHeader.slice(7);
      const payload = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
      return payload.userId || null;
    } catch { return null; }
  }
  const devUser = req.headers.get('x-user-id');
  if (devUser) return devUser;
  return null;
}
