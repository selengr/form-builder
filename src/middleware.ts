import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
  const start = Date.now();
  const { pathname } = req.nextUrl;
  const ip = req.ip ?? req.headers.get("x-forwarded-for") ?? "unknown";
  const userAgent = req.headers.get("user-agent") ?? "unknown";

  console.log(`[📥] Request → ${pathname}
    ↪ IP: ${ip}
    ↪ UA: ${userAgent}
    ↪ Time: ${new Date().toISOString()}
  `);

  try {
    const token = await getToken({
      req,
      secret: process.env.NEXTAUTH_SECRET,
    });

    if (!token) {
      console.warn(`[⛔] Unauthorized access to ${pathname}`);
      return NextResponse.redirect(new URL("/", req.url));
    }

    const res = NextResponse.next();

    if (typeof token.access_token === "string") {
      res.headers.set("x-access-token", token.access_token);
      console.log(`[🧠] Injected token for ${pathname}`);
    }

    console.log(`[🔓] Authenticated: ${token.email || token.name || "unknown"}`);

    return res;
  } catch (err) {
    console.error(`[❌] Middleware error @ ${pathname}:`, err);
    return NextResponse.next();
  } finally {
    const duration = Date.now() - start;
    console.log(`[✅] Completed ${pathname} in ${duration}ms`);
  }
}

export const config = {
  matcher: [
    "/builder/:path*",
    "/my-assessments/:path*",
    "/reports/:path*",
    "/purchase-order/:path*",
    "/transactions/:path*",
    "/groups/:path*",
    "/user-reports/:path*",
  ],
};