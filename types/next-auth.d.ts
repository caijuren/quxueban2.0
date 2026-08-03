import 'next-auth';

declare module 'next-auth' {
  interface User {
    id: string;
    username: string;
    name?: string | null;
    avatarUrl?: string | null;
    role: 'ADMIN' | 'PARENT';
  }

  interface Session {
    user: User;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    username: string;
    name?: string | null;
    avatarUrl?: string | null;
    role: 'ADMIN' | 'PARENT';
  }
}
