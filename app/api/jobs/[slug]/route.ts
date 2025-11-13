import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { tutors } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    
    const tutor = await db.query.tutors.findFirst({
      where: eq(tutors.slug, slug),
      with: {
        subject: true,
        country: true,
      },
    });

    if (!tutor) {
      return NextResponse.json({ error: 'Tutor not found' }, { status: 404 });
    }

    return NextResponse.json(tutor);
  } catch (error) {
    console.error('Error fetching tutor:', error);
    return NextResponse.json({ error: 'Failed to fetch tutor' }, { status: 500 });
  }
}
