import type { Metadata } from "next";
import "./globals.css";
import { RootProvider } from "@/providers";
import NextTopLoader from "nextjs-toploader";
import MobileMenu from "@/components/MiddleSidebar/mobile/MobileMenu";
import Image from "next/image";
import Logo from "../../public/images/logo/logo2.svg";

export const metadata: Metadata = {
  title: "ام‌رسالت - سکوی سایا",
  description: "دستیار هوشمند شناخت",
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
    <html className="scroll-smooth" lang="fa" >
    <head>
      <meta content="#2CDFC9" media="(prefers-color-scheme: light)" name="theme-color" />
      <meta content="#1758BA" media="(prefers-color-scheme: dark)" name="theme-color" />
      <meta content="black-translucent" name="apple-mobile-web-app-status-bar-style" />
      <meta content="true" name="HandheldFriendly" />
      <meta content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" name="viewport" />
    </head>
    <body dir="rtl">
    <NextTopLoader showSpinner={false} />
    <RootProvider>
      <div className="bg-white w-full mx-auto px-4 pb-6 flex justify-center md:hidden">
        <div className="absolute right-8">
          <MobileMenu />
        </div>
        <Image
            src={Logo}
            alt="سایا لوگو"
            width={120}
            height={40}
            priority
            unselectable={"on"}
            draggable={false}
        />
      </div>{children}</RootProvider>
    </body>
    </html>
  );
}
