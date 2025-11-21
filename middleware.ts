import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Handle CORS preflight requests for API routes
  if (pathname.startsWith('/api/') && request.method === 'OPTIONS') {
    return new NextResponse(null, {
      status: 200,
      headers: CORS_HEADERS,
    });
  }

  // Redirect /dashboard/faculty_coordinator/* to /dashboard/institution/*
  if (pathname.startsWith('/dashboard/faculty_coordinator')) {
    const newPath = pathname.replace('/dashboard/faculty_coordinator', '/dashboard/institution');
    return NextResponse.redirect(new URL(newPath, request.url));
  }

  const response = NextResponse.next();

  // Add CORS headers to all API responses
  if (pathname.startsWith('/api/')) {
    Object.entries(CORS_HEADERS).forEach(([key, value]) => {
      response.headers.set(key, value);
    });
  }

  return response;
}

export const config = {
  matcher: ['/api/:path*', '/dashboard/faculty_coordinator/:path*'],
};
