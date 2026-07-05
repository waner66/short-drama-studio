import { NextRequest, NextResponse } from 'next/server';

const ADMIN_PATHS = ['/admin'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isAdminPath = ADMIN_PATHS.some(p => pathname === p || pathname.startsWith(p + '/'));

  if (!isAdminPath) return NextResponse.next();

  // 从 cookie 或 header 读取 token
  const token =
    request.cookies.get('token')?.value ||
    request.headers.get('authorization')?.replace('Bearer ', '') ||
    '';

  if (!token) {
    return NextResponse.redirect(new URL('/auth/login?redirect=' + encodeURIComponent(pathname), request.url));
  }

  try {
    // 简单解码 JWT payload
    const payload = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
    if (payload.role !== 'ADMIN') {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
  } catch {
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/admin/:path*',
};
