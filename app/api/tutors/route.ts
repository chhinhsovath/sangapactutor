import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { tutors } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

// GET all tutors with filters
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get('status');
    const verified = searchParams.get('verified');

    const allTutors = await db.query.tutors.findMany({
      with: {
        subject: true,
        country: true,
      },
      orderBy: (tutors, { desc }) => [desc(tutors.createdAt)],
    });

    let filteredTutors = allTutors;

    if (status === 'active') {
      filteredTutors = filteredTutors.filter(t => t.isActive);
    } else if (status === 'inactive') {
      filteredTutors = filteredTutors.filter(t => !t.isActive);
    }

    if (verified === 'true') {
      filteredTutors = filteredTutors.filter(t => t.isVerified);
    } else if (verified === 'false') {
      filteredTutors = filteredTutors.filter(t => !t.isVerified);
    }

    return NextResponse.json(filteredTutors);
  } catch (error) {
    console.error('Error fetching tutors:', error);
    return NextResponse.json({ error: 'Failed to fetch tutors' }, { status: 500 });
  }
}

// CREATE new tutor
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      firstName,
      lastName,
      slug,
      avatar,
      subjectId,
      countryId,
      specialization,
      level,
      hourlyRate,
      bio,
      teachingStyle,
      spokenLanguages,
      yearsExperience,
    } = body;

    if (!firstName || !lastName || !slug || !subjectId || !countryId || !specialization || !level || !hourlyRate || !bio) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const newTutor = await db.insert(tutors).values({
      firstName,
      lastName,
      slug,
      avatar: avatar || null,
      subjectId,
      countryId,
      specialization,
      level,
      hourlyRate,
      bio,
      teachingStyle: teachingStyle || null,
      spokenLanguages: spokenLanguages || null,
      yearsExperience: yearsExperience || 0,
      rating: '0',
      totalReviews: 0,
      totalLessons: 0,
      isVerified: false,
      isActive: true,
    }).returning();

    return NextResponse.json(newTutor[0], { status: 201 });
  } catch (error: any) {
    console.error('Error creating tutor:', error);
    if (error.code === '23505') {
      return NextResponse.json({ error: 'Tutor slug already exists' }, { status: 409 });
    }
    return NextResponse.json({ error: 'Failed to create tutor' }, { status: 500 });
  }
}
