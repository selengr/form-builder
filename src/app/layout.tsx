import type { Metadata } from "next";
import "./globals.css";
import { RootProvider } from "@/providers";

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
        <RootProvider>{children}</RootProvider>
      </body>
    </html>
  );
}
