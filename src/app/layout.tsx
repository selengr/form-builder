import type { Metadata } from "next";
import "./globals.css";
import { RootProvider } from "@/providers";
import NextTopLoader from "nextjs-toploader";

export const metadata: Metadata = {
  title: "سایا",
  description: "دستیار روانشناس شخصی",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body dir="rtl">
        <NextTopLoader showSpinner={false} />
        <RootProvider>{children}</RootProvider>
      </body>
    </html>
  );
}
