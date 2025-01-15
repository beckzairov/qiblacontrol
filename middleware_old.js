import { NextResponse } from 'next/server';

export function middleware(request) {
  // Get the token from cookies
  const token = request.cookies.get('token')?.value;

  // If no token, redirect to /auth/login
  if (!token && !request.nextUrl.pathname.startsWith('/auth')) {
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }

  // Allow access to auth routes (login and register) without a token
  if (request.nextUrl.pathname.startsWith('/auth')) {
    return NextResponse.next();
  }

  // Allow access to protected routes if the token exists
  return NextResponse.next();
}

// Apply the middleware to all routes except for static assets
export const config = {
  matcher: ['/:path*'], // Protect all routes
};