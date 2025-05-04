import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

const PROTECTED_PATHS = ['/builder','/my-assessments','/reports', '/purchase-order','/transactions'];

export async function middleware(req: NextRequest) {
  console.log("🔹 Middleware triggered for:", req.nextUrl.pathname);

  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const pathname = req.nextUrl.pathname;

  console.log("🔹 Token:", token ? "Exists" : "Missing");

  const isProtected = PROTECTED_PATHS.some(path => pathname.startsWith(path));

  if (isProtected && !token) {
    console.log("⛔️ Unauthorized access to:", pathname);
    return NextResponse.redirect(new URL('/', req.url));
  }

  console.log("✅ Authorized access to:", pathname);
  return NextResponse.next();
}

export const config = {
  matcher: ['/builder/:path*','/my-assessments/:path*','/reports/:path*', '/purchase-order/:path*','/transactions/:path*'],
};
