import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { reviews } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

// GET all reviews
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const tutorId = searchParams.get('tutorId');
    const studentId = searchParams.get('studentId');

    let conditions = [];

    if (tutorId) {
      conditions.push(eq(reviews.tutorId, parseInt(tutorId)));
    }

    if (studentId) {
      conditions.push(eq(reviews.studentId, parseInt(studentId)));
    }

    const allReviews = await db.query.reviews.findMany({
      with: {
        student: true,
        tutor: {
          with: {
            subject: true,
          },
        },
        booking: true,
      },
      orderBy: (reviews, { desc }) => [desc(reviews.createdAt)],
    });

    return NextResponse.json(allReviews);
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return NextResponse.json({ error: 'Failed to fetch reviews' }, { status: 500 });
  }
}

// CREATE new review
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { bookingId, studentId, tutorId, rating, comment } = body;

    if (!bookingId || !studentId || !tutorId || !rating) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json({ error: 'Rating must be between 1 and 5' }, { status: 400 });
    }

    const newReview = await db.insert(reviews).values({
      bookingId,
      studentId,
      tutorId,
      rating,
      comment: comment || null,
    }).returning();

    return NextResponse.json(newReview[0], { status: 201 });
  } catch (error: any) {
    console.error('Error creating review:', error);
    if (error.code === '23505') {
      return NextResponse.json({ error: 'Review already exists for this booking' }, { status: 409 });
    }
    return NextResponse.json({ error: 'Failed to create review' }, { status: 500 });
  }
}
