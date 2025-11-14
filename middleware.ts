import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Redirect /dashboard/faculty_coordinator/* to /dashboard/institution/*
  if (pathname.startsWith('/dashboard/faculty_coordinator')) {
    const newPath = pathname.replace('/dashboard/faculty_coordinator', '/dashboard/institution');
    return NextResponse.redirect(new URL(newPath, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/dashboard/faculty_coordinator/:path*',
};
