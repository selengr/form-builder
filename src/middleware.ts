import {NextRequest, NextResponse} from 'next/server';
import {getToken} from 'next-auth/jwt';

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

  let token = null;

  try {
    token = await getToken({
      req, secret: process.env.NEXTAUTH_SECRET, cookieName: "a__Secure-next-auth.session-token",
    });
    console.log("token", token);
    if (!token) {
      token = await getToken({
        req, secret: process.env.NEXTAUTH_SECRET,
      });
    }

    const isProtected = ['/builder', '/my-assessments', '/reports', '/purchase-order', '/transactions',].some(path => pathname.startsWith(path));

    if (isProtected && !token) {
      console.warn(`⛔ Unauthorized access attempt to ${pathname} — No valid session token`);
      return NextResponse.redirect(new URL('/', req.url));
    }

    const res = NextResponse.next();

    if (token?.access_token) {
      // @ts-ignore
      res.headers.set('x-access-token', token.access_token);
      console.log(`🧠 Token injected into response header`);
    }

    if (token) {
      console.log(`🔓 Authenticated access to ${pathname} by user`, token.email || token.name || "unknown");
    }

    return res;
  } catch (err) {
    console.error(`❌ Middleware error on ${pathname}`, err);
    return NextResponse.next();
  } finally {
    const duration = Date.now() - start;
    console.log(`✅ Done: ${pathname} in ${duration}ms`);
  }
}

export const config = {
  matcher: ["/builder/:path*", "/my-assessments/:path*", "/reports/:path*", "/purchase-order/:path*", "/transactions/:path*"],
};
