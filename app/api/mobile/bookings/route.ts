import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { bookings, tutors, users } from '@/lib/db/schema';
import { eq, and } from 'drizzle-orm';
import { verifyAccessToken } from '@/lib/jwt';

export async function GET(request: NextRequest) {
    try {
        // Verify authentication
        const authHeader = request.headers.get('authorization');
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        const token = authHeader.substring(7);
        const payload = verifyAccessToken(token);
        if (!payload) {
            return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const status = searchParams.get('status');

        const conditions = [eq(bookings.studentId, payload.userId)];
        if (status) {
            conditions.push(eq(bookings.status, status as any));
        }

        const results = await db
            .select({
                id: bookings.id,
                studentId: bookings.studentId,
                tutorId: bookings.tutorId,
                scheduledAt: bookings.scheduledAt,
                duration: bookings.duration,
                price: bookings.price,
                status: bookings.status,
                notes: bookings.notes,
                meetingLink: bookings.meetingLink,
                isCreditEligible: bookings.isCreditEligible,
                sessionType: bookings.sessionType,
                creditValue: bookings.creditValue,
                completedAt: bookings.completedAt,
                createdAt: bookings.createdAt,
                updatedAt: bookings.updatedAt,
                tutor: {
                    id: tutors.id,
                    firstName: tutors.firstName,
                    lastName: tutors.lastName,
                    avatar: tutors.avatar,
                    hourlyRate: tutors.hourlyRate,
                    rating: tutors.rating,
                },
            })
            .from(bookings)
            .leftJoin(tutors, eq(bookings.tutorId, tutors.id))
            .where(and(...conditions));
        return NextResponse.json(results);
    } catch (error) {
        console.error('Get bookings error:', error);
        return NextResponse.json(
            { message: 'Internal server error' },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        // Verify authentication
        const authHeader = request.headers.get('authorization');
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        const token = authHeader.substring(7);
        const payload = verifyAccessToken(token);
        if (!payload) {
            return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
        }

        const body = await request.json();
        const { tutorId, scheduledAt, duration, notes } = body;

        if (!tutorId || !scheduledAt || !duration) {
            return NextResponse.json(
                { message: 'Missing required fields' },
                { status: 400 }
            );
        }

        // Get tutor to calculate price
        const [tutor] = await db
            .select()
            .from(tutors)
            .where(eq(tutors.id, tutorId))
            .limit(1);

        if (!tutor) {
            return NextResponse.json(
                { message: 'Tutor not found' },
                { status: 404 }
            );
        }

        // Calculate price
        const hours = duration / 60;
        const price = (parseFloat(tutor.hourlyRate) * hours).toFixed(2);

        // Create booking
        const [newBooking] = await db
            .insert(bookings)
            .values({
                studentId: payload.userId,
                tutorId,
                scheduledAt: new Date(scheduledAt),
                duration,
                price,
                status: 'pending',
                notes: notes || null,
                sessionType: 'tutoring',
            })
            .returning();

        return NextResponse.json(newBooking, { status: 201 });
    } catch (error) {
        console.error('Create booking error:', error);
        return NextResponse.json(
            { message: 'Internal server error' },
            { status: 500 }
        );
    }
}
