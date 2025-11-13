import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { reviews } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

// UPDATE review
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { rating, comment, tutorResponse } = body;

    if (rating && (rating < 1 || rating > 5)) {
      return NextResponse.json({ error: 'Rating must be between 1 and 5' }, { status: 400 });
    }

    const updateData: any = {};
    if (rating) updateData.rating = rating;
    if (comment !== undefined) updateData.comment = comment;
    if (tutorResponse !== undefined) {
      updateData.tutorResponse = tutorResponse;
      updateData.respondedAt = new Date();
    }

    const updatedReview = await db.update(reviews)
      .set(updateData)
      .where(eq(reviews.id, parseInt(id)))
      .returning();

    if (updatedReview.length === 0) {
      return NextResponse.json({ error: 'Review not found' }, { status: 404 });
    }

    return NextResponse.json(updatedReview[0]);
  } catch (error) {
    console.error('Error updating review:', error);
    return NextResponse.json({ error: 'Failed to update review' }, { status: 500 });
  }
}

// DELETE review
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const deletedReview = await db.delete(reviews)
      .where(eq(reviews.id, parseInt(id)))
      .returning();

    if (deletedReview.length === 0) {
      return NextResponse.json({ error: 'Review not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Review deleted successfully' });
  } catch (error) {
    console.error('Error deleting review:', error);
    return NextResponse.json({ error: 'Failed to delete review' }, { status: 500 });
  }
}
