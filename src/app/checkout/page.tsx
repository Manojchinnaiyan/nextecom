'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { z } from 'zod';
import { useAuth } from '@/contexts/auth-context';
import { useCart } from '@/contexts/cart-context';
import { ArrowLeft, CreditCard } from 'lucide-react';

// Define the schema for form validation
const checkoutSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters'),
  email: z.string().email('Invalid email address'),
  address: z.string().min(5, 'Address must be at least 5 characters'),
  city: z.string().min(2, 'City is required'),
  state: z.string().min(2, 'State is required'),
  postalCode: z.string().min(5, 'Postal code is required'),
  country: z.string().min(2, 'Country is required'),
  paymentMethod: z.enum(['card', 'cod']),
});

type CheckoutFormData = z.infer<typeof checkoutSchema>;

export default function CheckoutPage() {
  const { user } = useAuth();
  const { items, total, clearCart } = useCart();
  const router = useRouter();
  
  const [formData, setFormData] = useState<Partial<CheckoutFormData>>({
    name: '',
    email: '',
    address: '',
    city: '',
    state: '',
    postalCode: '',
    country: '',
    paymentMethod: 'card',
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [razorpayLoaded, setRazorpayLoaded] = useState(false);
  
  // Redirect if cart is empty
  useEffect(() => {
    if (items.length === 0) {
      router.push('/cart');
    }
  }, [items, router]);
  
  // Pre-fill form with user data if available
  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        name: user.name || prev.name,
        email: user.email || prev.email,
      }));
    }
  }, [user]);
  
  // Load Razorpay script
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => setRazorpayLoaded(true);
    
    document.body.appendChild(script);
    
    return () => {
      document.body.removeChild(script);
    };
  }, []);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };
  
  const validateForm = (): boolean => {
    try {
      // If we have all the required fields, validate the form
      if (Object.keys(formData).length === 8) {
        checkoutSchema.parse(formData);
        setErrors({});
        return true;
      }
      return false;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Record<string, string> = {};
        error.errors.forEach(err => {
          if (err.path[0]) {
            newErrors[err.path[0] as string] = err.message;
          }
        });
        setErrors(newErrors);
      }
      return false;
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      const orderData = {
        items: items.map(item => ({
          productId: item.id,
          quantity: item.quantity,
          price: item.price,
        })),
        total,
        shippingAddress: {
          name: formData.name,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          postalCode: formData.postalCode,
          country: formData.country,
        },
        paymentMethod: formData.paymentMethod,
      };
      
      if (formData.paymentMethod === 'card') {
        // Handle Razorpay payment
        await initiateRazorpayPayment(orderData);
      } else {
        // Handle COD - direct order creation
        await createOrder(orderData);
        
        // Order success - redirect to success page
        clearCart();
        router.push('/checkout/success');
      }
    } catch (error) {
      console.error('Checkout error:', error);
      setErrors({ form: 'An error occurred during checkout. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const initiateRazorpayPayment = async (orderData: any) => {
    if (!razorpayLoaded) {
      setErrors({ form: 'Payment system is not loaded yet. Please try again.' });
      return;
    }
    
    try {
      // First create an order
      const orderId = 'ORD' + Math.random().toString(36).substring(2, 10).toUpperCase();
      
      // Make API call to create Razorpay order
      const response = await fetch('/api/payment/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: total,
          orderId,
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to create payment order');
      }
      
      const { order, key } = await response.json();
      
      // Configure Razorpay options
      const options = {
        key,
        amount: order.amount,
        currency: order.currency,
        name: 'NextShop',
        description: 'Purchase from NextShop',
        order_id: order.id,
        handler: async function(response: any) {
          try {
            // Verify payment
            const verifyResponse = await fetch('/api/payment/verify', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_signature: response.razorpay_signature,
                orderId,
              }),
            });
            
            if (!verifyResponse.ok) {
              throw new Error('Payment verification failed');
            }
            
            // Create the order after successful payment
            await createOrder({
              ...orderData,
              paymentId: response.razorpay_payment_id,
            });
            
            // Clear cart and redirect to success page
            clearCart();
            router.push('/checkout/success');
          } catch (error) {
            console.error('Payment verification error:', error);
            setErrors({ form: 'Payment verification failed. Please contact support.' });
          }
        },
        prefill: {
          name: formData.name,
          email: formData.email,
        },
        theme: {
          color: '#000000',
        },
      };
      
      // Open Razorpay checkout
      const razorpay = new (window as any).Razorpay(options);
      razorpay.open();
    } catch (error) {
      console.error('Razorpay payment error:', error);
      setErrors({ form: 'Payment initialization failed. Please try again later.' });
    }
  };
  
  // Function to create an order
  const createOrder = async (orderData: any) => {
    // This would normally make an API call to your backend
    console.log('Creating order with data:', orderData);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return { success: true, orderId: 'ORD' + Date.now() };
  };
  
  if (items.length === 0) {
    return null; // Handled by the redirect in useEffect
  }
  
  const shipping = 5; // Fixed shipping cost
  const tax = total * 0.05; // 5% tax rate
  const orderTotal = total + shipping + tax;
  
  return (
    <div className="container py-8">
      <Link 
        href="/cart"
        className="flex items-center gap-1 text-muted-foreground hover:text-foreground mb-8"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Cart
      </Link>
      
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Checkout Form */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="space-y-6">
            {errors.form && (
              <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-md">
                {errors.form}
              </div>
            )}
            
            <div>
              <h2 className="text-xl font-semibold mb-4">Contact Information</h2>
              <div className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium mb-1">
                    Full Name
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    value={formData.name || ''}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 rounded-md border bg-background"
                    disabled={isSubmitting}
                    required
                  />
                  {errors.name && (
                    <p className="mt-1 text-sm text-destructive">{errors.name}</p>
                  )}
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium mb-1">
                    Email
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email || ''}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 rounded-md border bg-background"
                    disabled={isSubmitting}
                    required
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-destructive">{errors.email}</p>
                  )}
                </div>
              </div>
            </div>
            
            <div>
              <h2 className="text-xl font-semibold mb-4">Shipping Address</h2>
              <div className="space-y-4">
                <div>
                  <label htmlFor="address" className="block text-sm font-medium mb-1">
                    Address
                  </label>
                  <textarea
                    id="address"
                    name="address"
                    value={formData.address || ''}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 rounded-md border bg-background"
                    rows={3}
                    disabled={isSubmitting}
                    required
                  />
                  {errors.address && (
                    <p className="mt-1 text-sm text-destructive">{errors.address}</p>
                  )}
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="city" className="block text-sm font-medium mb-1">
                      City
                    </label>
                    <input
                      id="city"
                      name="city"
                      type="text"
                      value={formData.city || ''}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 rounded-md border bg-background"
                      disabled={isSubmitting}
                      required
                    />
                    {errors.city && (
                      <p className="mt-1 text-sm text-destructive">{errors.city}</p>
                    )}
                  </div>
                  
                  <div>
                    <label htmlFor="state" className="block text-sm font-medium mb-1">
                      State / Province
                    </label>
                    <input
                      id="state"
                      name="state"
                      type="text"
                      value={formData.state || ''}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 rounded-md border bg-background"
                      disabled={isSubmitting}
                      required
                    />
                    {errors.state && (
                      <p className="mt-1 text-sm text-destructive">{errors.state}</p>
                    )}
                  </div>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="postalCode" className="block text-sm font-medium mb-1">
                      Postal Code
                    </label>
                    <input
                      id="postalCode"
                      name="postalCode"
                      type="text"
                      value={formData.postalCode || ''}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 rounded-md border bg-background"
                      disabled={isSubmitting}
                      required
                    />
                    {errors.postalCode && (
                      <p className="mt-1 text-sm text-destructive">{errors.postalCode}</p>
                    )}
                  </div>
                  
                  <div>
                    <label htmlFor="country" className="block text-sm font-medium mb-1">
                      Country
                    </label>
                    <input
                      id="country"
                      name="country"
                      type="text"
                      value={formData.country || ''}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 rounded-md border bg-background"
                      disabled={isSubmitting}
                      required
                    />
                    {errors.country && (
                      <p className="mt-1 text-sm text-destructive">{errors.country}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <h2 className="text-xl font-semibold mb-4">Payment Method</h2>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <input
                    id="card"
                    name="paymentMethod"
                    type="radio"
                    value="card"
                    checked={formData.paymentMethod === 'card'}
                    onChange={handleInputChange}
                    className="border-primary text-primary focus:ring-primary"
                    disabled={isSubmitting}
                  />
                  <label htmlFor="card" className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5" />
                    Credit / Debit Card (Razorpay)
                  </label>
                </div>
                
                <div className="flex items-center gap-3">
                  <input
                    id="cod"
                    name="paymentMethod"
                    type="radio"
                    value="cod"
                    checked={formData.paymentMethod === 'cod'}
                    onChange={handleInputChange}
                    className="border-primary text-primary focus:ring-primary"
                    disabled={isSubmitting}
                  />
                  <label htmlFor="cod">
                    Cash on Delivery
                  </label>
                </div>
                
                {errors.paymentMethod && (
                  <p className="mt-1 text-sm text-destructive">{errors.paymentMethod}</p>
                )}
              </div>
            </div>
            
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 px-6 py-3 rounded-md font-medium mt-6"
            >
              {isSubmitting ? 'Processing...' : 'Place Order'}
            </button>
          </form>
        </div>
        
        {/* Order Summary */}
        <div>
          <div className="border rounded-lg p-6 space-y-4 sticky top-20">
            <h2 className="text-xl font-bold mb-4">Order Summary</h2>
            
            <div className="max-h-80 overflow-y-auto space-y-4 pr-2">
              {items.map(item => (
                <div key={item.id} className="flex gap-4">
                  <div className="relative h-16 w-16 rounded-md overflow-hidden bg-muted flex-shrink-0">
                    {item.image ? (
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center text-muted-foreground text-xs">
                        No Image
                      </div>
                    )}
                  </div>
                  
                  <div className="flex-1">
                    <p className="font-medium line-clamp-1">{item.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {item.quantity} × ${item.price.toFixed(2)}
                    </p>
                  </div>
                  
                  <div className="text-right">
                    ${(item.price * item.quantity).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="border-t pt-4 space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span>${total.toFixed(2)}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-muted-foreground">Shipping</span>
                <span>${shipping.toFixed(2)}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-muted-foreground">Tax (5%)</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              
              <div className="flex justify-between font-bold text-lg pt-2 border-t">
                <span>Total</span>
                <span>${orderTotal.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}