import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { bookings, tutors } from '@/lib/db/schema';
import { eq, and, gte, sql } from 'drizzle-orm';

export async function GET(request: NextRequest) {
    try {
        const userIdStr = request.headers.get('x-user-id') || request.nextUrl.searchParams.get('userId');
        if (!userIdStr) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
        const userId = parseInt(userIdStr);

        // Get tutor record for this user
        const tutorRecord = await db.query.users.findFirst({
            where: eq(users.id, userId),
            with: {
                tutor: true,
            },
        });

        if (!tutorRecord?.tutor) {
            return NextResponse.json({ error: 'Tutor profile not found' }, { status: 404 });
        }

        const tutorId = tutorRecord.tutor.id;

        // Get upcoming sessions count
        const upcomingSessions = await db
            .select({ count: sql<number>`count(*)` })
            .from(bookings)
            .where(
                and(
                    eq(bookings.tutorId, tutorId),
                    eq(bookings.status, 'confirmed'),
                    gte(bookings.scheduledAt, new Date())
                )
            );

        // Get earnings for current month (mock calculation for now as earnings table might be complex)
        // In a real app, we'd sum up completed bookings or check earnings table
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

        const monthlyEarnings = await db
            .select({ total: sql<number>`sum(${bookings.price})` })
            .from(bookings)
            .where(
                and(
                    eq(bookings.tutorId, tutorId),
                    eq(bookings.status, 'completed'),
                    gte(bookings.completedAt, startOfMonth)
                )
            );

        return NextResponse.json({
            data: {
                upcomingSessions: upcomingSessions[0]?.count || 0,
                monthlyEarnings: monthlyEarnings[0]?.total || 0,
            },
        });
    } catch (error) {
        console.error('Error fetching tutor stats:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

// Need to import users schema
import { users } from '@/lib/db/schema';
