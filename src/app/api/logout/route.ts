import { NextRequest, NextResponse } from 'next/server';
import { removeAuthCookie } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    // Remove the auth cookie
    await removeAuthCookie();
    
    return NextResponse.json(
      { message: 'Logout successful' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json(
      { error: 'Failed to logout' },
      { status: 500 }
    );
  }
}