import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import pino from 'pino';
import { sessionCookieName } from '@/services/auth/authConfig';

/**
 * Next.js 16 always runs `proxy` on the Node.js runtime (Edge is no longer
 * supported for this file), so we can safely use Node-only packages like
 * `pino` here — this was not reliably possible under the old Edge-based
 * `middleware`.
 */
const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  redact: ['ip', 'userAgent', 'email', 'name'],
  base: { scope: 'proxy' },
});

function getClientIp(req: NextRequest): string {
  const forwardedFor = req.headers.get('x-forwarded-for');
  if (forwardedFor) {
    // x-forwarded-for can be a comma-separated list; the first entry is the client.
    return forwardedFor.split(',')[0]!.trim();
  }
  return req.headers.get('x-real-ip') ?? 'unknown';
}

export async function proxy(req: NextRequest) {
  const start = Date.now();
  const { pathname } = req.nextUrl;

  const requestId = crypto.randomUUID();
  const log = logger.child({ requestId, pathname });

  // Verbose, opt-in via LOG_LEVEL=debug — avoids logging IP/UA on every
  // request in production by default.
  log.debug({ ip: getClientIp(req), userAgent: req.headers.get('user-agent') ?? 'unknown' }, 'request received');

  try {
    // IMPORTANT: must match authOptions.cookies.sessionToken.name exactly —
    // getToken() has no way to know about our custom cookie name otherwise,
    // and silently falls back to next-auth's default "next-auth.session-token",
    // which we don't use. Without this, every request is treated as
    // unauthenticated even for a logged-in user.
    const token = await getToken({
      req,
      secret: process.env.NEXTAUTH_SECRET,
      cookieName: sessionCookieName,
    });

    if (!token) {
      log.warn('unauthorized access attempt');
      return NextResponse.redirect(new URL('/', req.url));
    }

    const res = NextResponse.next();

    if (typeof token.access_token === 'string') {
      res.headers.set('x-access-token', token.access_token);
    }

    log.debug({ user: token.email ?? token.name ?? token.sub ?? 'unknown' }, 'authenticated');

    return res;
  } catch (err) {
    log.error({ err }, 'proxy error');
    return NextResponse.next();
  } finally {
    log.debug({ durationMs: Date.now() - start }, 'request completed');
  }
}

export const config = {
  matcher: [
    '/builder/:path*',
    '/my-assessments/:path*',
    '/reports/:path*',
    '/purchase-order/:path*',
    '/transactions/:path*',
    '/groups/:path*',
    '/user-reports/:path*',
  ],
};
