// import type { NextRequest } from "next/server";
// import { isTokenExpired } from '@/lib/checkTokenExpiry';
import { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  // const token = req.cookies.get('accessToken')?.value;

  // const { pathname } = req.nextUrl.clone();

  // const publicRoutes = [
  //   '/login',
  //   '/forgot-password',
  //   '/otp-verification',
  //   '/create-password',
  // ];

  // if (!token && !publicRoutes.includes(pathname)) {
  //   return NextResponse.redirect(new URL('/login', req.url));
  // }

  // if (token && isTokenExpired(token)) {
  //   return NextResponse.redirect(new URL('/login', req.url));
  // }

  // if (token && publicRoutes.includes(pathname)) {
  //   return NextResponse.redirect(new URL('/contracts/all', req.url));
  // }

  // return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|static|favicon.ico|assets|favicon|manifest.json|_next).*)',
  ],
};
