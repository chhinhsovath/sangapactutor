import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { users, institutions, tutors } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { verifyAccessToken } from '@/lib/jwt';

export async function GET(request: NextRequest) {
    try {
        // Get token from Authorization header
        const authHeader = request.headers.get('authorization');
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return NextResponse.json(
                { message: 'Unauthorized' },
                { status: 401 }
            );
        }

        const token = authHeader.substring(7);
        const payload = verifyAccessToken(token);

        if (!payload) {
            return NextResponse.json(
                { message: 'Invalid or expired token' },
                { status: 401 }
            );
        }

        // Fetch user with relations
        const [user] = await db
            .select({
                id: users.id,
                email: users.email,
                firstName: users.firstName,
                lastName: users.lastName,
                avatar: users.avatar,
                role: users.role,
                tutorId: users.tutorId,
                institutionId: users.institutionId,
                studentId: users.studentId,
                creditBalance: users.creditBalance,
                academicYear: users.academicYear,
                isActive: users.isActive,
                createdAt: users.createdAt,
                updatedAt: users.updatedAt,
            })
            .from(users)
            .where(eq(users.id, payload.userId))
            .limit(1);

        if (!user) {
            return NextResponse.json(
                { message: 'User not found' },
                { status: 404 }
            );
        }

        return NextResponse.json(user);
    } catch (error) {
        console.error('Get user error:', error);
        return NextResponse.json(
            { message: 'Internal server error' },
            { status: 500 }
        );
    }
}
