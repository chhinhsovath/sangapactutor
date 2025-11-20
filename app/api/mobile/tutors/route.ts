import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { tutors, subjects, countries } from '@/lib/db/schema';
import { eq, and } from 'drizzle-orm';

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const subjectId = searchParams.get('subjectId');
        const countryId = searchParams.get('countryId');
        const specialization = searchParams.get('specialization');
        const level = searchParams.get('level');
        const minRate = searchParams.get('minRate');
        const maxRate = searchParams.get('maxRate');

        const conditions = [eq(tutors.isActive, true)];
        if (subjectId) {
            conditions.push(eq(tutors.subjectId, parseInt(subjectId)));
        }
        if (countryId) {
            conditions.push(eq(tutors.countryId, parseInt(countryId)));
        }
        if (specialization) {
            conditions.push(eq(tutors.specialization, specialization as any));
        }
        if (level) {
            conditions.push(eq(tutors.level, level as any));
        }

        const results = await db
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
            .where(and(...conditions));

        // Filter by price range in memory (since Drizzle doesn't support decimal comparisons easily)
        let filteredResults = results;
        if (minRate || maxRate) {
            filteredResults = results.filter((tutor) => {
                const rate = parseFloat(tutor.hourlyRate);
                if (minRate && rate < parseFloat(minRate)) return false;
                if (maxRate && rate > parseFloat(maxRate)) return false;
                return true;
            });
        }

        return NextResponse.json(filteredResults);
    } catch (error) {
        console.error('Get tutors error:', error);
        return NextResponse.json(
            { message: 'Internal server error' },
            { status: 500 }
        );
    }
}
