import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { tutors, subjects, countries } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const tutorId = parseInt(id);

        const [tutor] = await db
            .select({
                id: tutors.id,
                firstName: tutors.firstName,
                lastName: tutors.lastName,
                slug: tutors.slug,
                avatar: tutors.avatar,
                subjectId: tutors.subjectId,
                countryId: tutors.countryId,
                specialization: tutors.specialization,
                level: tutors.level,
                hourlyRate: tutors.hourlyRate,
                rating: tutors.rating,
                totalReviews: tutors.totalReviews,
                totalLessons: tutors.totalLessons,
                yearsExperience: tutors.yearsExperience,
                bio: tutors.bio,
                bioKh: tutors.bioKh,
                bioEn: tutors.bioEn,
                teachingStyle: tutors.teachingStyle,
                teachingStyleKh: tutors.teachingStyleKh,
                teachingStyleEn: tutors.teachingStyleEn,
                spokenLanguages: tutors.spokenLanguages,
                videoIntro: tutors.videoIntro,
                availability: tutors.availability,
                isVerified: tutors.isVerified,
                isActive: tutors.isActive,
                subject: {
                    id: subjects.id,
                    name: subjects.name,
                    nameKh: subjects.nameKh,
                    nameEn: subjects.nameEn,
                    slug: subjects.slug,
                    icon: subjects.icon,
                },
                country: {
                    id: countries.id,
                    name: countries.name,
                    nameKh: countries.nameKh,
                    nameEn: countries.nameEn,
                    code: countries.code,
                    flag: countries.flag,
                },
            })
            .from(tutors)
            .leftJoin(subjects, eq(tutors.subjectId, subjects.id))
            .leftJoin(countries, eq(tutors.countryId, countries.id))
            .where(eq(tutors.id, tutorId))
            .limit(1);

        if (!tutor) {
            return NextResponse.json(
                { message: 'Tutor not found' },
                { status: 404 }
            );
        }

        return NextResponse.json(tutor);
    } catch (error) {
        console.error('Get tutor error:', error);
        return NextResponse.json(
            { message: 'Internal server error' },
            { status: 500 }
        );
    }
}
