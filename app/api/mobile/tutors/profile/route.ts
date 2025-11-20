import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { tutors, users } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export async function PUT(request: NextRequest) {
    try {
        const userIdStr = request.headers.get('x-user-id') || request.nextUrl.searchParams.get('userId');
        if (!userIdStr) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
        const userId = parseInt(userIdStr);
        const body = await request.json();

        // Get tutor record
        const userRecord = await db.query.users.findFirst({
            where: eq(users.id, userId),
            with: {
                tutor: true,
            },
        });

        if (!userRecord?.tutor) {
            return NextResponse.json({ error: 'Tutor profile not found' }, { status: 404 });
        }

        // Update tutor profile
        const updatedTutor = await db
            .update(tutors)
            .set({
                bio: body.bio,
                hourlyRate: body.hourlyRate,
                teachingStyle: body.teachingStyle,
                // Add other fields as needed
                updatedAt: new Date(),
            })
            .where(eq(tutors.id, userRecord.tutor.id))
            .returning();

        return NextResponse.json({ data: updatedTutor[0] });
    } catch (error) {
        console.error('Error updating tutor profile:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
