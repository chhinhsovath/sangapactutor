import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { bookings, institutions, users } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

// POST /api/bookings/[id]/complete - Mark session as completed
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const bookingId = parseInt(id);
    const body = await request.json();

    if (isNaN(bookingId)) {
      return NextResponse.json({ error: 'Invalid booking ID' }, { status: 400 });
    }

    const { completionNotes, isCreditEligible } = body;

    // Get booking
    const [booking] = await db
      .select()
      .from(bookings)
      .where(eq(bookings.id, bookingId))
      .limit(1);

    if (!booking) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
    }

    if (booking.status === 'completed') {
      return NextResponse.json(
        { error: 'Booking is already completed' },
        { status: 409 }
      );
    }

    if (booking.status === 'cancelled') {
      return NextResponse.json(
        { error: 'Cannot complete a cancelled booking' },
        { status: 400 }
      );
    }

    // Calculate credit value if eligible
    let creditValue = '0';
    if (isCreditEligible) {
      // Get student's institution to fetch credit settings
      const [student] = await db
        .select()
        .from(users)
        .where(eq(users.id, booking.studentId))
        .limit(1);

      if (student?.institutionId) {
        const [institution] = await db
          .select()
          .from(institutions)
          .where(eq(institutions.id, student.institutionId))
          .limit(1);

        if (institution) {
          creditValue = institution.creditValuePerSession || '0.5';
        }
      }
    }

    // Update booking to completed
    const [completed] = await db
      .update(bookings)
      .set({
        status: 'completed',
        completedAt: new Date(),
        completionNotes,
        isCreditEligible: isCreditEligible || false,
        creditValue,
        updatedAt: new Date(),
      })
      .where(eq(bookings.id, bookingId))
      .returning();

    return NextResponse.json({
      message: 'Session completed successfully',
      booking: completed,
    });
  } catch (error) {
    console.error('Error completing session:', error);
    return NextResponse.json(
      {
        error: 'Failed to complete session',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
