import Razorpay from 'razorpay';

export const razorpay = new Razorpay({
  key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || '',
  key_secret: process.env.RAZORPAY_KEY_SECRET || '',
});

export async function createRazorpayOrder(amount: number, options: any = {}) {
  try {
    const order = await razorpay.orders.create({
      amount: amount * 100, // Amount in paise
      currency: 'INR',
      ...options,
    });

    return { success: true, order };
  } catch (error) {
    console.error('Razorpay order creation error:', error);
    return { success: false, error };
  }
}

export function verifyRazorpayPayment(paymentId: string, orderId: string, signature: string) {
  try {
    const generated = require('crypto')
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(orderId + '|' + paymentId)
      .digest('hex');

    return generated === signature;
  } catch (error) {
    console.error('Razorpay verification error:', error);
    return false;
  }
}