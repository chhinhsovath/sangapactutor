import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { earningsAdjustments } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

// DELETE earnings adjustment by ID (Admin only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const deleted = await db.delete(earningsAdjustments)
      .where(eq(earningsAdjustments.id, parseInt(id)))
      .returning();

    if (deleted.length === 0) {
      return NextResponse.json({ error: 'Adjustment not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Adjustment deleted successfully' });
  } catch (error) {
    console.error('Error deleting earnings adjustment:', error);
    return NextResponse.json({ error: 'Failed to delete earnings adjustment' }, { status: 500 });
  }
}
