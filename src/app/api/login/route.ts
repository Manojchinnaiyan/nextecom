import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import prisma from '@/lib/db';
import { generateToken, setAuthCookie, verifyPassword } from '@/lib/auth';

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const validatedFields = loginSchema.safeParse(body);
    if (!validatedFields.success) {
      return NextResponse.json(
        { error: 'Invalid form data', details: validatedFields.error.flatten().fieldErrors },
        { status: 400 }
      );
    }
    
    const { email, password } = validatedFields.data;
    
    // Find the user
    const user = await prisma.user.findUnique({
      where: { email },
    });
    
    if (!user) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }
    
    // Verify the password
    const isPasswordValid = await verifyPassword(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }
    
    // Generate a JWT token
    const token = generateToken({ id: user.id, email: user.email, role: user.role });
    
    // Set the auth cookie
    await setAuthCookie(token);
    
    // Remove password from response
    const { password: _, ...userWithoutPassword } = user;
    
    return NextResponse.json(
      { message: 'Login successful', user: userWithoutPassword },
      { status: 200 }
    );
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Failed to login' },
      { status: 500 }
    );
  }
}