import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';

export async function middleware(request: NextRequest) {
  // Get the auth token from the cookies
  const token = request.cookies.get('auth_token')?.value;

  // Define protected admin routes
  const isAdminRoute = request.nextUrl.pathname.startsWith('/admin');
  
  // Define protected user routes
  const isProtectedRoute = 
    request.nextUrl.pathname.startsWith('/account') ||
    request.nextUrl.pathname.startsWith('/checkout') || 
    request.nextUrl.pathname.startsWith('/orders');

  // Verify the token
  const decoded = token ? verifyToken<{ id: string; role: string }>(token) : null;

  // Redirect to login if accessing a protected route without a valid token
  if ((isProtectedRoute || isAdminRoute) && !decoded) {
    const url = new URL('/login', request.url);
    url.searchParams.set('from', request.nextUrl.pathname);
    return NextResponse.redirect(url);
  }

  // Restrict admin routes to ADMIN users only
  if (isAdminRoute && decoded?.role !== 'ADMIN') {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/account/:path*',
    '/checkout/:path*',
    '/orders/:path*',
  ],
};