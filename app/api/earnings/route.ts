import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { earningsAdjustments, bookings } from '@/lib/db/schema';
import { eq, and, sql } from 'drizzle-orm';

// GET earnings for a tutor
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const tutorId = searchParams.get('tutorId');

    if (!tutorId) {
      return NextResponse.json({ error: 'Tutor ID required' }, { status: 400 });
    }

    // Get completed bookings earnings
    const completedBookings = await db.query.bookings.findMany({
      where: and(
        eq(bookings.tutorId, parseInt(tutorId)),
        eq(bookings.status, 'completed')
      ),
      with: {
        student: true,
      },
    });

    // Get earnings adjustments
    const adjustments = await db.query.earningsAdjustments.findMany({
      where: eq(earningsAdjustments.tutorId, parseInt(tutorId)),
    });

    const totalFromBookings = completedBookings.reduce(
      (sum, booking) => sum + parseFloat(booking.price),
      0
    );

    const totalAdjustments = adjustments.reduce((sum, adj) => {
      const amount = parseFloat(adj.amount);
      return sum + (adj.type === 'bonus' ? amount : -amount);
    }, 0);

    return NextResponse.json({
      bookings: completedBookings,
      adjustments,
      totalFromBookings,
      totalAdjustments,
      totalEarnings: totalFromBookings + totalAdjustments,
    });
  } catch (error) {
    console.error('Error fetching earnings:', error);
    return NextResponse.json({ error: 'Failed to fetch earnings' }, { status: 500 });
  }
}

// CREATE earnings adjustment
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { tutorId, amount, reason, type, createdBy } = body;

    if (!tutorId || !amount || !reason || !type) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    if (!['bonus', 'deduction'].includes(type)) {
      return NextResponse.json({ error: 'Type must be bonus or deduction' }, { status: 400 });
    }

    const newAdjustment = await db.insert(earningsAdjustments).values({
      tutorId,
      amount,
      reason,
      type,
      createdBy: createdBy || null,
    }).returning();

    return NextResponse.json(newAdjustment[0], { status: 201 });
  } catch (error) {
    console.error('Error creating adjustment:', error);
    return NextResponse.json({ error: 'Failed to create adjustment' }, { status: 500 });
  }
}
