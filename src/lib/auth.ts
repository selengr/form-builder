import type { OAuthConfig } from 'next-auth/providers/oauth';
import type { NextAuthOptions } from 'next-auth';

// ------------------ OAuth Provider ------------------
const Auth0Provider: OAuthConfig<any> = {
  id: 'authorize',
  name: 'authorize',
  type: 'oauth',
  idToken: true,
  authorization: {
    url: process.env.NEXT_PUBLIC_BASE_URL + '/sso/oauth2/authorize',
    params: {
      scope: 'openid',
      response_type: 'code',
      response_mode: 'form_post',
    },
  },
  token: process.env.BASE_URL + '/sso/oauth2/token',
  issuer: process.env.ISSUER_URL,
  jwks_endpoint: process.env.BASE_URL + '/sso/oauth2/jwks',
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
  httpOptions: {
    timeout: 30000,
  },
  profile: (user) => {
    return user;
  },
};

// ------------------ Cookie Config ------------------
const rawNextAuthUrl = process.env.NEXTAUTH_URL || '';
const sanitizedUrl = rawNextAuthUrl.replace(/\/$/, ''); // حذف `/` آخر URL

const getDomainName = (hostName: string) => {
  const parts = hostName.split('.');
  return parts.length >= 2 ? parts.slice(-2).join('.') : hostName;
};

let cookieDomain: string | undefined = undefined;
try {
  const url = new URL(sanitizedUrl);
  cookieDomain = '.' + getDomainName(url.hostname); // مثل: .qhami.ir
} catch (e) {
  console.warn('Invalid NEXTAUTH_URL:', rawNextAuthUrl);
}

// نام کوکی سشن جداگانه export می‌شود تا proxy.ts (که مستقیم از next-auth/jwt
// تابع getToken را صدا می‌زند) دقیقاً همین نام را بخواند. getToken به‌صورت
// پیش‌فرض دنبال «next-auth.session-token» می‌گردد، نه نام سفارشی‌شده‌ی زیر؛
// بدون این export، هر کاربر لاگین‌شده هم unauthorized تشخیص داده می‌شود.
export const sessionCookieName = `${sanitizedUrl.startsWith('https://') ? '__Secure-' : ''}psya-next-auth.session-token`;

// ------------------ NextAuth Options ------------------
export const authOptions: NextAuthOptions = {
  providers: [Auth0Provider],
  secret: process.env.NEXTAUTH_SECRET,
  cookies: {
    sessionToken: {
      name: sessionCookieName,
      options: {
        domain: cookieDomain, // پشتیبانی از همه ساب‌دامین‌ها
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: sanitizedUrl.startsWith('https://'),
      },
    },
  },
  callbacks: {
    async jwt({ account, token }) {
      if (account) {
        token.access_token = account.access_token;
        token.refresh_token = account.refresh_token;
      }
      return token;
    },
    async session({ session, token }) {
      return { ...session, access_token: token.access_token };
    },
  },
};