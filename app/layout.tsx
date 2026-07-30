import type { Metadata, Viewport } from 'next';
import './globals.css';
import { AuthProvider } from '@/components/providers/AuthProvider';
import { MotionProvider } from '@/components/providers/MotionProvider';
import { SettingsApplier } from '@/components/providers/SettingsApplier';

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
      <body className="min-h-screen animated-bg grid-pattern antialiased">
        <MotionProvider>
          <AuthProvider>
            <SettingsApplier />
            {children}
          </AuthProvider>
        </MotionProvider>
      </body>
    </html>
  );
}
