import type { Metadata } from "next";
import { Noto_Sans_KR, JetBrains_Mono } from "next/font/google";
import { BottomNav } from "@/components/layout/BottomNav";
import "./globals.css";

const notoSansKR = Noto_Sans_KR({
  variable: "--font-noto-sans-kr",
  subsets: ["latin"],
  weight: ["400", "500", "700", "900"],
  display: "swap",
});

const jetBrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "코테원격공부 - 모바일에서 배우는 코딩 테스트",
  description: "언제 어디서나 모바일로 쉽게 배우는 알고리즘과 코딩 테스트",
  viewport: "width=device-width, initial-scale=1, maximum-scale=5, user-scalable=yes",
  themeColor: "#FF6B35",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "코테원격공부",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <head>
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
      </head>
      <body
        className={`${notoSansKR.variable} ${jetBrainsMono.variable} antialiased`}
      >
        {children}
        <BottomNav />
      </body>
    </html>
  );
}
