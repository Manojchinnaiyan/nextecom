import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getCurrentUser } from '@/lib/auth';
import { createRazorpayOrder } from '@/lib/razorpay';

const orderSchema = z.object({
  amount: z.number().positive(),
  orderId: z.string(),
});

export async function POST(request: NextRequest) {
  try {
    // Verify that the user is authenticated
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    // Parse and validate the request body
    const body = await request.json();
    const validatedFields = orderSchema.safeParse(body);
    
    if (!validatedFields.success) {
      return NextResponse.json(
        { error: 'Invalid request data', details: validatedFields.error.flatten().fieldErrors },
        { status: 400 }
      );
    }
    
    const { amount, orderId } = validatedFields.data;
    
    // Create a Razorpay order
    const result = await createRazorpayOrder(amount, {
      receipt: orderId,
      notes: {
        orderId,
        userId: currentUser.id,
      },
    });
    
    if (!result.success) {
      return NextResponse.json(
        { error: 'Failed to create payment order' },
        { status: 500 }
      );
    }
    
    return NextResponse.json({
      order: result.order,
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
    });
  } catch (error) {
    console.error('Payment order creation error:', error);
    return NextResponse.json(
      { error: 'Failed to create payment order' },
      { status: 500 }
    );
  }
}