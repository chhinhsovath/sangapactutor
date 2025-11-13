import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { tutors, subjects, countries } from '@/lib/db/schema';
import { eq, and, gte, lte } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const slug = searchParams.get('slug');
    const subject = searchParams.get('subject');
    const country = searchParams.get('country');
    const specialization = searchParams.get('specialization');
    const priceMin = searchParams.get('priceMin');
    const priceMax = searchParams.get('priceMax');

    // If slug is provided, return single tutor
    if (slug) {
      const tutor = await db.query.tutors.findFirst({
        where: eq(tutors.slug, slug),
        with: {
          subject: true,
          country: true,
        },
      });
      return NextResponse.json(tutor ? [tutor] : []);
    }

    const conditions = [eq(tutors.isActive, true)];

    if (subject && subject !== 'all') {
      const subj = await db.query.subjects.findFirst({
        where: eq(subjects.slug, subject),
      });
      if (subj) {
        conditions.push(eq(tutors.subjectId, subj.id));
      }
    }

    if (country && country !== 'all') {
      const ctry = await db.query.countries.findFirst({
        where: eq(countries.code, country),
      });
      if (ctry) {
        conditions.push(eq(tutors.countryId, ctry.id));
      }
    }

    if (specialization && specialization !== 'all') {
      conditions.push(eq(tutors.specialization, specialization as 'Conversational' | 'Business' | 'Test Preparation' | 'Academic' | 'Kids & Teens' | 'Job Interview'));
    }

    if (priceMin) {
      conditions.push(gte(tutors.hourlyRate, priceMin));
    }

    if (priceMax) {
      conditions.push(lte(tutors.hourlyRate, priceMax));
    }

    const tutorsList = await db.query.tutors.findMany({
      where: conditions.length > 1 ? and(...conditions) : conditions[0],
      with: {
        subject: true,
        country: true,
      },
      orderBy: (tutors, { desc }) => [desc(tutors.rating), desc(tutors.totalReviews)],
    });

    return NextResponse.json(tutorsList);
  } catch (error) {
    console.error('Error fetching tutors:', error);
    return NextResponse.json({ error: 'Failed to fetch tutors' }, { status: 500 });
  }
}
