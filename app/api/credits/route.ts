import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { creditTransactions, bookings, users, institutions } from '@/lib/db/schema';
import { eq, and, desc, sql } from 'drizzle-orm';

// GET /api/credits - List credit transactions with filters
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get('userId');
    const institutionId = searchParams.get('institutionId');
    const status = searchParams.get('status');
    const academicYear = searchParams.get('academicYear');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    // Build filter conditions
    const conditions = [];

    if (userId) {
      conditions.push(eq(creditTransactions.userId, parseInt(userId)));
    }

    if (institutionId) {
      conditions.push(eq(creditTransactions.institutionId, parseInt(institutionId)));
    }

    if (status) {
      conditions.push(eq(creditTransactions.status, status as any));
    }

    if (academicYear) {
      conditions.push(eq(creditTransactions.academicYear, academicYear));
    }

    // Build and execute query
    const query = db
      .select({
        id: creditTransactions.id,
        userId: creditTransactions.userId,
        institutionId: creditTransactions.institutionId,
        bookingId: creditTransactions.bookingId,
        creditsEarned: creditTransactions.creditsEarned,
        academicYear: creditTransactions.academicYear,
        status: creditTransactions.status,
        submittedAt: creditTransactions.submittedAt,
        reviewedBy: creditTransactions.reviewedBy,
        reviewedAt: creditTransactions.reviewedAt,
        reviewNotes: creditTransactions.reviewNotes,
        creditedAt: creditTransactions.creditedAt,
        createdAt: creditTransactions.createdAt,
        user: {
          firstName: users.firstName,
          lastName: users.lastName,
          email: users.email,
        },
        institution: {
          name: institutions.name,
        },
      })
      .from(creditTransactions)
      .leftJoin(users, eq(creditTransactions.userId, users.id))
      .leftJoin(institutions, eq(creditTransactions.institutionId, institutions.id))
      .$dynamic();

    const results = await query
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .orderBy(desc(creditTransactions.submittedAt))
      .limit(limit)
      .offset(offset);

    return NextResponse.json(results);
  } catch (error) {
    console.error('Error fetching credit transactions:', error);
    return NextResponse.json(
      {
        error: 'Failed to fetch credit transactions',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

// POST /api/credits - Create credit transaction (student tutor submits for credit)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { bookingId, userId } = body;

    if (!bookingId || !userId) {
      return NextResponse.json(
        { error: 'bookingId and userId are required' },
        { status: 400 }
      );
    }

    // Get booking details
    const [booking] = await db
      .select()
      .from(bookings)
      .where(eq(bookings.id, bookingId))
      .limit(1);

    if (!booking) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
    }

    // Check if booking is completed and credit eligible
    if (booking.status !== 'completed') {
      return NextResponse.json(
        { error: 'Booking must be completed before submitting for credit' },
        { status: 400 }
      );
    }

    if (!booking.isCreditEligible) {
      return NextResponse.json(
        { error: 'This booking is not eligible for credits' },
        { status: 400 }
      );
    }

    // Get user details
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    if (!user || !user.institutionId) {
      return NextResponse.json(
        { error: 'User not found or not enrolled in an institution' },
        { status: 404 }
      );
    }

    // Check if credit already submitted for this booking
    const [existing] = await db
      .select()
      .from(creditTransactions)
      .where(eq(creditTransactions.bookingId, bookingId))
      .limit(1);

    if (existing) {
      return NextResponse.json(
        { error: 'Credit transaction already exists for this booking' },
        { status: 409 }
      );
    }

    // Create credit transaction
    const [transaction] = await db
      .insert(creditTransactions)
      .values({
        userId,
        institutionId: user.institutionId,
        bookingId,
        creditsEarned: booking.creditValue || '0.5',
        academicYear: user.academicYear || new Date().getFullYear().toString(),
        status: 'pending',
      })
      .returning();

    return NextResponse.json(transaction, { status: 201 });
  } catch (error) {
    console.error('Error creating credit transaction:', error);
    return NextResponse.json(
      {
        error: 'Failed to create credit transaction',
        message: error instanceof Error ? error.message : 'Unknown error',
        code: (error as any).code,
        detail: (error as any).detail,
      },
      { status: 500 }
    );
  }
}
