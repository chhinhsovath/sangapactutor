import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { earningsAdjustments, tutors } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

// GET all earnings adjustments (Admin only)
export async function GET(request: NextRequest) {
  try {
    const adjustments = await db.query.earningsAdjustments.findMany({
      with: {
        tutor: true,
        creator: true,
      },
      orderBy: (earningsAdjustments, { desc }) => [desc(earningsAdjustments.createdAt)],
    });

    return NextResponse.json(adjustments);
  } catch (error) {
    console.error('Error fetching earnings adjustments:', error);
    return NextResponse.json({ error: 'Failed to fetch earnings adjustments' }, { status: 500 });
  }
}

// POST create new earnings adjustment (Admin only)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { tutorId, amount, reason, type, createdBy } = body;

    if (!tutorId || !amount || !reason || !type) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    if (!['bonus', 'deduction'].includes(type)) {
      return NextResponse.json({ error: 'Invalid type. Must be bonus or deduction' }, { status: 400 });
    }

    // Verify tutor exists
    const tutor = await db.query.tutors.findFirst({
      where: eq(tutors.id, tutorId),
    });

    if (!tutor) {
      return NextResponse.json({ error: 'Tutor not found' }, { status: 404 });
    }

    const newAdjustment = await db.insert(earningsAdjustments).values({
      tutorId,
      amount: amount.toString(),
      reason,
      type,
      createdBy,
    }).returning();

    return NextResponse.json(newAdjustment[0], { status: 201 });
  } catch (error) {
    console.error('Error creating earnings adjustment:', error);
    return NextResponse.json({ error: 'Failed to create earnings adjustment' }, { status: 500 });
  }
}
