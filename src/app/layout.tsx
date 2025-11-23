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

// import type { Metadata } from 'next';
// import './globals.css';
// import { RootProvider } from '@/providers';
// import NextTopLoader from 'nextjs-toploader';
// import MobileMenu from '@/components/MiddleSidebar/mobile/MobileMenu';
// import Image from 'next/image';
// import Logo from '../../public/images/logo/logo2.svg';

// export const metadata: Metadata = {
//   title: 'ام‌رسالت - سکوی سایا',
//   description: 'دستیار هوشمند شناخت',
//   icons: {
//     icon: '/favicon/favicon.svg',
//   },
// };

// export default function RootLayout({
//   children,
// }: Readonly<{
//   children: React.ReactNode;
// }>) {
//   return (
//     <html className='scroll-smooth' lang='fa'>
//       <head>
//         <meta content='#2CDFC9' media='(prefers-color-scheme: light)' name='theme-color' />
//         <meta content='#1758BA' media='(prefers-color-scheme: dark)' name='theme-color' />
//         <meta content='black-translucent' name='apple-mobile-web-app-status-bar-style' />
//         <meta content='true' name='HandheldFriendly' />
//         <meta content='width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no' name='viewport' />
//       </head>
//       <body dir='rtl' className={'antialiased'}>
//         <NextTopLoader showSpinner={false} />
//         <RootProvider>
//           <div className='bg-white w-full mx-auto px-4 py-3 flex justify-between items-center md:hidden fixed top-0 left-0 right-0 z-50'>
//             <MobileMenu />
//             <Image src={Logo} alt='سایا لوگو' width={120} height={40} priority draggable={false} />
//           </div>
//           <div className={'flex grow h-[calc(50vh-60px)] mt-[60px] md:mt-0 md:h-[calc(100vh-0px)]'}>{children}</div>
//         </RootProvider>
//       </body>
//     </html>
//   );
// }
