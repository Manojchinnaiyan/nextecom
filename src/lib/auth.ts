import { compare, hash } from 'bcryptjs';
import { sign, verify } from 'jsonwebtoken';
import { cookies } from 'next/headers';

// Password hashing
export async function hashPassword(password: string): Promise<string> {
  return hash(password, 10);
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return compare(password, hashedPassword);
}

// JWT handling
export function generateToken(payload: object): string {
  const secret = process.env.JWT_SECRET as string;
  if (!secret) throw new Error('JWT_SECRET is not defined');
  
  return sign(payload, secret, { expiresIn: '7d' });
}

export function verifyToken<T>(token: string): T | null {
  try {
    const secret = process.env.JWT_SECRET as string;
    if (!secret) throw new Error('JWT_SECRET is not defined');
    
    return verify(token, secret) as T;
  } catch (error) {
    return null;
  }
}

// Cookie management
export async function setAuthCookie(token: string): Promise<void> {
  const cookieStore = cookies();
  cookieStore.set('auth_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 24 * 7, // 1 week
    path: '/',
  });
}

export async function getAuthCookie(): Promise<string | undefined> {
  const cookieStore = cookies();
  const cookie = cookieStore.get('auth_token');
  return cookie?.value;
}

export async function removeAuthCookie(): Promise<void> {
  const cookieStore = cookies();
  cookieStore.delete('auth_token');
}

// Auth utility
export async function getCurrentUser() {
  const token = await getAuthCookie();
  if (!token) return null;
  
  const decoded = verifyToken<{ id: string }>(token);
  if (!decoded) return null;
  
  return decoded;
}