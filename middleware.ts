import { NextResponse, type NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  // TEMPORARY: Bypass all auth logic for UI development
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/',
    '/chat/:id',
    '/api/:path*',
    '/login',
    '/register',
    '/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
  ],
};
