import type { Metadata } from 'next';
import './globals.css';
import { RootProvider } from '@/providers';
import NextTopLoader from 'nextjs-toploader';
import LayoutWrapper from '@/templates/header/HeaderWrapper';

export const metadata: Metadata = {
  title: 'ام‌رسالت - سکوی سایا', 
  description: 'دستیار هوشمند شناخت',
  icons: {
    icon: '/favicon/favicon.svg',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html className='scroll-smooth' lang='fa'>
      <head>
        <meta content='#2CDFC9' media='(prefers-color-scheme: light)' name='theme-color' />
        <meta content='#1758BA' media='(prefers-color-scheme: dark)' name='theme-color' />
        <meta content='black-translucent' name='apple-mobile-web-app-status-bar-style' />
        <meta content='true' name='HandheldFriendly' />
        <meta content='width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no' name='viewport' />
      </head>
      <body dir='rtl' className={'antialiased'}>
        <NextTopLoader showSpinner={false} />
        <RootProvider>
           <LayoutWrapper>
              {children}
          </LayoutWrapper>
        </RootProvider>
      </body>
    </html>
  );
}
