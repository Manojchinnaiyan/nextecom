import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import prisma from '@/lib/db';
import { verifyRazorpayPayment } from '@/lib/razorpay';
import { getCurrentUser } from '@/lib/auth';

const verifyPaymentSchema = z.object({
  razorpay_payment_id: z.string(),
  razorpay_order_id: z.string(),
  razorpay_signature: z.string(),
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
    const validatedFields = verifyPaymentSchema.safeParse(body);
    
    if (!validatedFields.success) {
      return NextResponse.json(
        { error: 'Invalid request data', details: validatedFields.error.flatten().fieldErrors },
        { status: 400 }
      );
    }
    
    const {
      razorpay_payment_id,
      razorpay_order_id,
      razorpay_signature,
      orderId,
    } = validatedFields.data;
    
    // Verify the payment signature
    const isValid = verifyRazorpayPayment(
      razorpay_payment_id,
      razorpay_order_id,
      razorpay_signature
    );
    
    if (!isValid) {
      return NextResponse.json(
        { error: 'Invalid payment signature' },
        { status: 400 }
      );
    }
    
    // Update the order with payment information
    const order = await prisma.order.update({
      where: { id: orderId },
      data: {
        paymentId: razorpay_payment_id,
        paymentStatus: 'COMPLETED',
        status: 'PROCESSING',
      },
    });
    
    return NextResponse.json({
      success: true,
      order,
    });
  } catch (error) {
    console.error('Payment verification error:', error);
    return NextResponse.json(
      { error: 'Failed to verify payment' },
      { status: 500 }
    );
  }
}