import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { bookings, tutors } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { verifyAccessToken } from '@/lib/jwt';

export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
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

        const bookingId = parseInt(params.id);

        const [booking] = await db
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
                    bio: tutors.bio,
                },
            })
            .from(bookings)
            .leftJoin(tutors, eq(bookings.tutorId, tutors.id))
            .where(eq(bookings.id, bookingId))
            .limit(1);

        if (!booking) {
            return NextResponse.json(
                { message: 'Booking not found' },
                { status: 404 }
            );
        }

        // Check if user owns this booking
        if (booking.studentId !== payload.userId) {
            return NextResponse.json(
                { message: 'Forbidden' },
                { status: 403 }
            );
        }

        return NextResponse.json(booking);
    } catch (error) {
        console.error('Get booking error:', error);
        return NextResponse.json(
            { message: 'Internal server error' },
            { status: 500 }
        );
    }
}

export async function PATCH(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
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

        const bookingId = parseInt(params.id);
        const body = await request.json();
        const { status } = body;

        // Verify booking exists and user owns it
        const [existingBooking] = await db
            .select()
            .from(bookings)
            .where(eq(bookings.id, bookingId))
            .limit(1);

        if (!existingBooking) {
            return NextResponse.json(
                { message: 'Booking not found' },
                { status: 404 }
            );
        }

        if (existingBooking.studentId !== payload.userId) {
            return NextResponse.json(
                { message: 'Forbidden' },
                { status: 403 }
            );
        }

        // Update booking
        const [updatedBooking] = await db
            .update(bookings)
            .set({
                status: status || existingBooking.status,
                updatedAt: new Date(),
            })
            .where(eq(bookings.id, bookingId))
            .returning();

        return NextResponse.json(updatedBooking);
    } catch (error) {
        console.error('Update booking error:', error);
        return NextResponse.json(
            { message: 'Internal server error' },
            { status: 500 }
        );
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
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

        const bookingId = parseInt(params.id);

        // Verify booking exists and user owns it
        const [existingBooking] = await db
            .select()
            .from(bookings)
            .where(eq(bookings.id, bookingId))
            .limit(1);

        if (!existingBooking) {
            return NextResponse.json(
                { message: 'Booking not found' },
                { status: 404 }
            );
        }

        if (existingBooking.studentId !== payload.userId) {
            return NextResponse.json(
                { message: 'Forbidden' },
                { status: 403 }
            );
        }

        // Update status to cancelled instead of deleting
        await db
            .update(bookings)
            .set({
                status: 'cancelled',
                updatedAt: new Date(),
            })
            .where(eq(bookings.id, bookingId));

        return NextResponse.json({ message: 'Booking cancelled successfully' });
    } catch (error) {
        console.error('Cancel booking error:', error);
        return NextResponse.json(
            { message: 'Internal server error' },
            { status: 500 }
        );
    }
}
