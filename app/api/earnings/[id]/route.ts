import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { earningsAdjustments } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

// DELETE earnings adjustment
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const adjustmentId = parseInt(params.id);

    const deletedAdjustment = await db
      .delete(earningsAdjustments)
      .where(eq(earningsAdjustments.id, adjustmentId))
      .returning();

    if (!deletedAdjustment.length) {
      return NextResponse.json({ error: 'Adjustment not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting adjustment:', error);
    return NextResponse.json({ error: 'Failed to delete adjustment' }, { status: 500 });
  }
}
