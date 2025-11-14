import 'next-auth';
import 'next-auth/jwt';

declare module 'next-auth' {
  interface User {
    id: string;
    role: string;
    authProvider?: string;
    tutorId?: number;
    institutionId?: number;
    avatar?: string;
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
      institutionId?: number;
      avatar?: string;
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
    institutionId?: number;
    avatar?: string;
  }
}
