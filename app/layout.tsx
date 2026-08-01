import type { Metadata, Viewport } from 'next';
import { Syne, Manrope, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/components/providers/AuthProvider';
import { MotionProvider } from '@/components/providers/MotionProvider';
import { QueryProvider } from '@/components/providers/QueryProvider';
import { SettingsApplier } from '@/components/providers/SettingsApplier';

const syne = Syne({
  subsets: ['latin'],
  weight: ['500', '600', '700', '800'],
  variable: '--font-display',
  display: 'swap',
});

const manrope = Manrope({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-body',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: '趣学伴 - 上海升学战略地图',
  description: '为上海家长打造的升学路线规划与进度追踪工具',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body
        className={`min-h-screen animated-bg grid-pattern antialiased ${syne.variable} ${manrope.variable} ${jetbrainsMono.variable}`}
      >
        <MotionProvider>
          <AuthProvider>
            <QueryProvider>
              <SettingsApplier />
              {children}
            </QueryProvider>
          </AuthProvider>
        </MotionProvider>
      </body>
    </html>
  );
}
