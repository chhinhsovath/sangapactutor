import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { subjects } from '@/lib/db/schema';

export async function GET(request: NextRequest) {
    try {
        const allSubjects = await db.select().from(subjects);
        return NextResponse.json(allSubjects);
    } catch (error) {
        console.error('Get subjects error:', error);
        return NextResponse.json(
            { message: 'Internal server error' },
            { status: 500 }
        );
    }
}
