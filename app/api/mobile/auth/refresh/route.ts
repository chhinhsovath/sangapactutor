import { NextRequest, NextResponse } from 'next/server';
import { verifyRefreshToken, generateAccessToken } from '@/lib/jwt';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { refreshToken } = body;

        if (!refreshToken) {
            return NextResponse.json(
                { message: 'Refresh token is required' },
                { status: 400 }
            );
        }

        // Verify refresh token
        const payload = verifyRefreshToken(refreshToken);
        if (!payload) {
            return NextResponse.json(
                { message: 'Invalid or expired refresh token' },
                { status: 401 }
            );
        }

        // Generate new access token
        const accessToken = generateAccessToken({
            userId: payload.userId,
            email: payload.email,
            role: payload.role,
        });

        return NextResponse.json({ accessToken });
    } catch (error) {
        console.error('Token refresh error:', error);
        return NextResponse.json(
            { message: 'Internal server error' },
            { status: 500 }
        );
    }
}
