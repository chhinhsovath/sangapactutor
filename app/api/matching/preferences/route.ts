import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { matchingPreferences } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

// GET /api/matching/preferences - Get user's matching preferences
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'userId is required' }, { status: 400 });
    }

    const [preferences] = await db
      .select()
      .from(matchingPreferences)
      .where(eq(matchingPreferences.userId, parseInt(userId)))
      .limit(1);

    if (!preferences) {
      return NextResponse.json({ preferences: null });
    }

    // Parse JSON fields
    return NextResponse.json({
      ...preferences,
      preferredSubjects: preferences.preferredSubjects
        ? JSON.parse(preferences.preferredSubjects)
        : [],
      preferredInstitutions: preferences.preferredInstitutions
        ? JSON.parse(preferences.preferredInstitutions)
        : [],
      preferredSessionTypes: preferences.preferredSessionTypes
        ? JSON.parse(preferences.preferredSessionTypes)
        : [],
      availableDays: preferences.availableDays
        ? JSON.parse(preferences.availableDays)
        : [],
      availableTimeSlots: preferences.availableTimeSlots
        ? JSON.parse(preferences.availableTimeSlots)
        : {},
    });
  } catch (error) {
    console.error('Error fetching matching preferences:', error);
    return NextResponse.json(
      {
        error: 'Failed to fetch matching preferences',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

// POST /api/matching/preferences - Create or update matching preferences
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, ...preferences } = body;

    if (!userId) {
      return NextResponse.json({ error: 'userId is required' }, { status: 400 });
    }

    // Check if preferences exist
    const [existing] = await db
      .select()
      .from(matchingPreferences)
      .where(eq(matchingPreferences.userId, userId))
      .limit(1);

    // Stringify JSON fields
    const data = {
      userId,
      preferredSubjects: preferences.preferredSubjects
        ? JSON.stringify(preferences.preferredSubjects)
        : null,
      preferredInstitutions: preferences.preferredInstitutions
        ? JSON.stringify(preferences.preferredInstitutions)
        : null,
      preferredSessionTypes: preferences.preferredSessionTypes
        ? JSON.stringify(preferences.preferredSessionTypes)
        : null,
      maxSessionsPerWeek: preferences.maxSessionsPerWeek,
      availableDays: preferences.availableDays
        ? JSON.stringify(preferences.availableDays)
        : null,
      availableTimeSlots: preferences.availableTimeSlots
        ? JSON.stringify(preferences.availableTimeSlots)
        : null,
      willingToTravelDistance: preferences.willingToTravelDistance,
      onlineOnly: preferences.onlineOnly !== false,
      preferRemoteStudents: preferences.preferRemoteStudents !== false,
      isActive: preferences.isActive !== false,
    };

    let result;
    if (existing) {
      // Update
      [result] = await db
        .update(matchingPreferences)
        .set({
          ...data,
          updatedAt: new Date(),
        })
        .where(eq(matchingPreferences.userId, userId))
        .returning();
    } else {
      // Create
      [result] = await db.insert(matchingPreferences).values(data).returning();
    }

    return NextResponse.json({
      message: existing ? 'Preferences updated' : 'Preferences created',
      preferences: result,
    });
  } catch (error) {
    console.error('Error saving matching preferences:', error);
    return NextResponse.json(
      {
        error: 'Failed to save matching preferences',
        message: error instanceof Error ? error.message : 'Unknown error',
        code: (error as any).code,
        detail: (error as any).detail,
      },
      { status: 500 }
    );
  }
}
