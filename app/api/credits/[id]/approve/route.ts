import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { creditTransactions, users } from '@/lib/db/schema';
import { eq, sql } from 'drizzle-orm';

// POST /api/credits/[id]/approve - Approve credit transaction
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const transactionId = parseInt(id);
    const body = await request.json();

    if (isNaN(transactionId)) {
      return NextResponse.json({ error: 'Invalid transaction ID' }, { status: 400 });
    }

    const { reviewedBy, reviewNotes } = body;

    if (!reviewedBy) {
      return NextResponse.json(
        { error: 'reviewedBy (faculty user ID) is required' },
        { status: 400 }
      );
    }

    // Get transaction
    const [transaction] = await db
      .select()
      .from(creditTransactions)
      .where(eq(creditTransactions.id, transactionId))
      .limit(1);

    if (!transaction) {
      return NextResponse.json({ error: 'Transaction not found' }, { status: 404 });
    }

    if (transaction.status !== 'pending') {
      return NextResponse.json(
        { error: `Transaction is already ${transaction.status}` },
        { status: 400 }
      );
    }

    // Verify reviewer is faculty coordinator or admin
    const [reviewer] = await db
      .select()
      .from(users)
      .where(eq(users.id, reviewedBy))
      .limit(1);

    if (
      !reviewer ||
      (reviewer.role !== 'faculty_coordinator' &&
        reviewer.role !== 'institution_admin' &&
        reviewer.role !== 'admin')
    ) {
      return NextResponse.json(
        { error: 'Only faculty coordinators or admins can approve credits' },
        { status: 403 }
      );
    }

    // Update transaction to approved
    const [approved] = await db
      .update(creditTransactions)
      .set({
        status: 'approved',
        reviewedBy,
        reviewedAt: new Date(),
        reviewNotes,
      })
      .where(eq(creditTransactions.id, transactionId))
      .returning();

    return NextResponse.json({
      message: 'Credit transaction approved successfully',
      transaction: approved,
    });
  } catch (error) {
    console.error('Error approving credit transaction:', error);
    return NextResponse.json(
      {
        error: 'Failed to approve credit transaction',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
