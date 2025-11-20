import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { users } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';
import { generateAccessToken, generateRefreshToken } from '@/lib/jwt';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { email, password, firstName, lastName, role, institutionId } = body;

        // Validation
        if (!email || !password || !firstName || !lastName || !role) {
            return NextResponse.json(
                { message: 'All fields are required' },
                { status: 400 }
            );
        }

        if (!['student', 'tutor'].includes(role)) {
            return NextResponse.json(
                { message: 'Invalid role' },
                { status: 400 }
            );
        }

        // Check if user already exists
        const [existingUser] = await db
            .select()
            .from(users)
            .where(eq(users.email, email))
            .limit(1);

        if (existingUser) {
            return NextResponse.json(
                { message: 'User with this email already exists' },
                { status: 409 }
            );
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user
        const [newUser] = await db
            .insert(users)
            .values({
                email,
                password: hashedPassword,
                firstName,
                lastName,
                role,
                institutionId: institutionId || null,
                emailVerified: false,
                authProvider: 'local',
                isActive: true,
            })
            .returning();

        // Generate tokens
        const accessToken = generateAccessToken({
            userId: newUser.id,
            email: newUser.email,
            role: newUser.role,
        });

        const refreshToken = generateRefreshToken({
            userId: newUser.id,
            email: newUser.email,
            role: newUser.role,
        });

        // Remove password from response
        const { password: _, ...userWithoutPassword } = newUser;

        return NextResponse.json(
            {
                user: userWithoutPassword,
                accessToken,
                refreshToken,
            },
            { status: 201 }
        );
    } catch (error) {
        console.error('Registration error:', error);
        return NextResponse.json(
            { message: 'Internal server error' },
            { status: 500 }
        );
    }
}
