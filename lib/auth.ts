import { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
import { db } from '@/lib/db';
import { users } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';

export const authOptions: NextAuthOptions = {
  providers: [
    // Google OAuth Provider
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code"
        }
      }
    }),
    
    // Email/Password Provider (existing)
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Email and password required');
        }

        const user = await db.query.users.findFirst({
          where: eq(users.email, credentials.email),
          with: {
            tutor: {
              with: {
                subject: true,
                country: true,
              },
            },
          },
        });

        if (!user) {
          throw new Error('Invalid email or password');
        }

        // Check if user registered with Google
        if (user.authProvider === 'google' && !user.password) {
          throw new Error('Please sign in with Google');
        }

        // Compare password with bcrypt
        const isPasswordValid = await bcrypt.compare(credentials.password, user.password || '');
        if (!isPasswordValid) {
          throw new Error('Invalid email or password');
        }

        if (!user.isActive) {
          throw new Error('Account is inactive');
        }

        return {
          id: user.id.toString(),
          email: user.email,
          name: `${user.firstName} ${user.lastName}`,
          image: user.avatar,
          role: user.role,
          authProvider: user.authProvider || 'local',
          tutorId: user.tutorId || undefined,
          institutionId: user.institutionId || undefined,
          avatar: user.avatar || undefined,
        };
      },
    }),
  ],

  callbacks: {
    async signIn({ user, account, profile }) {
      // Handle Google OAuth sign in
      if (account?.provider === 'google' && profile?.email) {
        try {
          // Check if user exists
          const existingUser = await db.query.users.findFirst({
            where: eq(users.email, profile.email),
          });

          if (existingUser) {
            // Update user with Google info if not already linked
            if (!existingUser.googleId) {
              await db.update(users)
                .set({
                  googleId: account.providerAccountId,
                  authProvider: 'google',
                  emailVerified: true,
                  avatar: profile.picture || existingUser.avatar,
                })
                .where(eq(users.id, existingUser.id));
            }
          } else {
            // Create new user with Google info
            const [firstName, ...lastNameParts] = (profile.name || profile.email.split('@')[0]).split(' ');
            const lastName = lastNameParts.join(' ') || firstName;

            await db.insert(users).values({
              email: profile.email,
              firstName: firstName || 'User',
              lastName: lastName || '',
              googleId: account.providerAccountId,
              authProvider: 'google',
              emailVerified: true,
              avatar: profile.picture,
              role: 'student', // Default role for Google sign-ups
              isActive: true,
            });
          }

          return true;
        } catch (error) {
          console.error('Error in Google sign in:', error);
          return false;
        }
      }

      return true;
    },

    async jwt({ token, user, account }) {
      if (user) {
        token.role = user.role;
        token.authProvider = user.authProvider;
        token.tutorId = user.tutorId;
        token.institutionId = user.institutionId;
        token.avatar = user.avatar;
      }

      // If signing in with Google, fetch user data
      if (account?.provider === 'google' && token.email) {
        const dbUser = await db.query.users.findFirst({
          where: eq(users.email, token.email),
        });

        if (dbUser) {
          token.id = dbUser.id.toString();
          token.role = dbUser.role;
          token.authProvider = dbUser.authProvider || 'google';
          token.tutorId = dbUser.tutorId || undefined;
          token.institutionId = dbUser.institutionId || undefined;
          token.avatar = dbUser.avatar || undefined;
        }
      }

      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
        session.user.authProvider = token.authProvider as string;
        session.user.tutorId = token.tutorId as number | undefined;
        session.user.institutionId = token.institutionId as number | undefined;
        session.user.avatar = token.avatar as string | undefined;
      }
      return session;
    },
  },

  pages: {
    signIn: '/login',
    error: '/login',
  },

  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },

  secret: process.env.NEXTAUTH_SECRET,
};
