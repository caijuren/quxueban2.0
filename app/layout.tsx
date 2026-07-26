import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: '趣学伴 - 上海升学战略地图',
  description: '为上海家长打造的升学路线规划与进度追踪工具',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Syne:wght@500;600;700;800&family=Manrope:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen animated-bg grid-pattern antialiased">
        {children}
      </body>
    </html>
  );
}
