import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { creditTransactions, users, bookings } from '@/lib/db/schema';
import { eq, sql } from 'drizzle-orm';

// POST /api/credits/[id]/credit - Apply approved credits to student balance
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const transactionId = parseInt(id);

    if (isNaN(transactionId)) {
      return NextResponse.json({ error: 'Invalid transaction ID' }, { status: 400 });
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

    if (transaction.status !== 'approved') {
      return NextResponse.json(
        { error: 'Transaction must be approved before crediting' },
        { status: 400 }
      );
    }

    if (transaction.creditedAt) {
      return NextResponse.json(
        { error: 'Credits have already been applied for this transaction' },
        { status: 409 }
      );
    }

    // Use database transaction for atomicity
    const result = await db.transaction(async (tx) => {
      // Update student credit balance
      const [updatedUser] = await tx
        .update(users)
        .set({
          creditBalance: sql`${users.creditBalance} + ${transaction.creditsEarned}`,
          updatedAt: new Date(),
        })
        .where(eq(users.id, transaction.userId))
        .returning();

      // Update transaction status to credited
      const [creditedTransaction] = await tx
        .update(creditTransactions)
        .set({
          status: 'credited',
          creditedAt: new Date(),
        })
        .where(eq(creditTransactions.id, transactionId))
        .returning();

      // Mark booking as institution approved
      await tx
        .update(bookings)
        .set({
          institutionApproved: true,
          approvedAt: new Date(),
        })
        .where(eq(bookings.id, transaction.bookingId));

      return { updatedUser, creditedTransaction };
    });

    return NextResponse.json({
      message: 'Credits applied successfully',
      transaction: result.creditedTransaction,
      user: {
        id: result.updatedUser.id,
        firstName: result.updatedUser.firstName,
        lastName: result.updatedUser.lastName,
        creditBalance: result.updatedUser.creditBalance,
      },
    });
  } catch (error) {
    console.error('Error applying credits:', error);
    return NextResponse.json(
      {
        error: 'Failed to apply credits',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
