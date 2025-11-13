import 'next-auth';
import 'next-auth/jwt';

declare module 'next-auth' {
  interface User {
    id: string;
    role: string;
    authProvider?: string;
    tutorId?: number;
  }

  interface Session {
    user: {
      id: string;
      email: string;
      name: string;
      image?: string;
      role: string;
      authProvider?: string;
      tutorId?: number;
    };
  }

  interface Profile {
    picture?: string;
    email_verified?: boolean;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id?: string;
    role?: string;
    authProvider?: string;
    tutorId?: number;
  }
}
