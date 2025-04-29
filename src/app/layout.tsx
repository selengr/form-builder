import type { Metadata } from "next";
import "./globals.css";
import { RootProvider } from "@/providers";
import NextTopLoader from "nextjs-toploader";

export const metadata: Metadata = {
  title: "ام‌رسالت - سکوی سایا",
  description: "دستیار هوشمند شناخت",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html className="scroll-smooth" lang="fa" >
      <body dir="rtl">
        <NextTopLoader showSpinner={false} />
        <RootProvider>{children}</RootProvider>
      </body>
    </html>
  );
}
