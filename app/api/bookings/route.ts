import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { bookings } from '@/lib/db/schema';
import { eq, and, gte, lte } from 'drizzle-orm';

// GET all bookings
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get('status');
    const studentId = searchParams.get('studentId');
    const tutorId = searchParams.get('tutorId');

    let conditions = [];

    if (status && status !== 'all') {
      conditions.push(eq(bookings.status, status as any));
    }

    if (studentId) {
      conditions.push(eq(bookings.studentId, parseInt(studentId)));
    }

    if (tutorId) {
      conditions.push(eq(bookings.tutorId, parseInt(tutorId)));
    }

    const allBookings = await db.query.bookings.findMany({
      where: conditions.length > 0 ? and(...conditions) : undefined,
      with: {
        student: true,
        tutor: {
          with: {
            subject: true,
            country: true,
          },
        },
        review: true,
      },
      orderBy: (bookings, { desc }) => [desc(bookings.scheduledAt)],
    });

    return NextResponse.json(allBookings);
  } catch (error) {
    console.error('Error fetching bookings:', error);
    return NextResponse.json({ error: 'Failed to fetch bookings' }, { status: 500 });
  }
}

// CREATE new booking
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { studentId, tutorId, scheduledAt, duration, price, notes } = body;

    if (!studentId || !tutorId || !scheduledAt || !duration || !price) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const newBooking = await db.insert(bookings).values({
      studentId,
      tutorId,
      scheduledAt: new Date(scheduledAt),
      duration,
      price: price.toString(),
      status: 'pending',
      notes: notes || null,
      meetingLink: null,
    }).returning();

    return NextResponse.json(newBooking[0], { status: 201 });
  } catch (error) {
    console.error('Error creating booking:', error);
    return NextResponse.json({ error: 'Failed to create booking' }, { status: 500 });
  }
}
