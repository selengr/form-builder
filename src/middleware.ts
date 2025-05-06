import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(req: NextRequest) {
  const start = Date.now();
  const pathname = req.nextUrl.pathname;
  const ip = req.ip ?? req.headers.get("x-forwarded-for") ?? "unknown";
  const userAgent = req.headers.get("user-agent") ?? "unknown";

  console.log(`📥 Incoming request:
    ▫️ Path: ${pathname}
    ▫️ IP: ${ip}
    ▫️ User-Agent: ${userAgent}
    ▫️ Time: ${new Date().toISOString()}
  `);

  try {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    const isProtected = ['/builder','/my-assessments','/reports', '/purchase-order','/transactions'].some(path =>
      pathname.startsWith(path)
    );

    if (isProtected && !token) {
      console.warn(`⛔ Unauthorized access attempt to ${pathname}`);
      return NextResponse.redirect(new URL('/', req.url));
    }

    return NextResponse.next();
  } catch (err) {
    console.error(`❌ Middleware error on ${pathname}`, err);
    return NextResponse.next();
  } finally {
    const duration = Date.now() - start;
    console.log(`✅ Done: ${pathname} in ${duration}ms`);
  }
}
