import './globals.css';
import type { Metadata, Viewport } from 'next';
import { RootProvider } from '@/providers';
import NextTopLoader from 'nextjs-toploader';
import LayoutWrapper from '@/templates/header/HeaderWrapper';
import { fetchUserInfoServer } from '@actions/auth';

export const metadata: Metadata = {
  title: 'ام‌رسالت - سکوی سایا',
  description: 'دستیار هوشمند شناخت',
  icons: {
    icon: '/favicon/favicon.svg',
  },
  appleWebApp: {
    statusBarStyle: 'black-translucent',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#2CDFC9' },
    { media: '(prefers-color-scheme: dark)', color: '#1758BA' },
  ],
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const result = await fetchUserInfoServer();

  return (
    <html lang="fa" dir="rtl" className="scroll-smooth" suppressHydrationWarning>
      <body className="antialiased">
        <NextTopLoader showSpinner={false} />

        <RootProvider initialUserInfo={result.userInfo}>
          <LayoutWrapper>
            {children}
          </LayoutWrapper>
        </RootProvider>
      </body>
    </html>
  );
}