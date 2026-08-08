import { Metadata } from 'next';
import AdminShellClient from './admin-shell-client';

export const metadata: Metadata = {
  title: '管理后台 - 趣学伴',
  description: '趣学伴管理员后台',
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <AdminShellClient>{children}</AdminShellClient>;
}
