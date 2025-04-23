import { OAuthConfig } from "next-auth/providers/oauth";
import { NextAuthOptions } from "next-auth";

const Auth0Provider: OAuthConfig<any> = {
  id: "authorize",
  name: "authorize",
  type: "oauth",
  idToken: true,
  authorization: {
    url: process.env.NEXT_PUBLIC_BASE_URL + "/sso/oauth2/authorize",
    params: {
      scope: "openid",
      response_type: "code",
      response_mode: "form_post",
    },
  },
  token: process.env.BASE_URL + "/sso/oauth2/token",
  issuer: process.env.ISSUER_URL,
  jwks_endpoint: process.env.BASE_URL + "/sso/oauth2/jwks",
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
  profile: (user) => {
    return user;
  },
};

export const authOptions: NextAuthOptions = {
  providers: [Auth0Provider],
  secret: process.env.NEXTAUTH_SECRET,
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
