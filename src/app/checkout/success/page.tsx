'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { CheckCircle, Home, Package, ShoppingBag } from 'lucide-react';

export default function CheckoutSuccessPage() {
  const router = useRouter();
  
  // Redirect to home if accessed directly without checkout
  useEffect(() => {
    const hasCompletedCheckout = sessionStorage.getItem('checkoutComplete');
    
    if (!hasCompletedCheckout) {
      // This is a simulation - in a real app, you'd verify this on the server
      // For demo purposes, we're just setting this now to prevent redirect
      sessionStorage.setItem('checkoutComplete', 'true');
    }
  }, [router]);
  
  return (
    <div className="container py-12 max-w-3xl mx-auto text-center">
      <CheckCircle className="h-20 w-20 text-green-500 mx-auto mb-6" />
      
      <h1 className="text-3xl font-bold mb-4">Order Placed Successfully!</h1>
      
      <p className="text-lg text-muted-foreground mb-8">
        Thank you for your purchase. Your order has been received and is being processed.
      </p>
      
      <div className="bg-muted p-6 rounded-lg mb-8">
        <h2 className="text-xl font-semibold mb-4">Order Details</h2>
        
        <div className="flex justify-between items-center mb-2">
          <span className="font-medium">Order Number:</span>
          <span>ORD-{Math.random().toString(36).substring(2, 10).toUpperCase()}</span>
        </div>
        
        <div className="flex justify-between items-center mb-2">
          <span className="font-medium">Date:</span>
          <span>{new Date().toLocaleDateString()}</span>
        </div>
        
        <div className="flex justify-between items-center mb-2">
          <span className="font-medium">Payment Status:</span>
          <span className="text-green-600 font-medium">Completed</span>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="font-medium">Shipping Status:</span>
          <span>Processing</span>
        </div>
      </div>
      
      <p className="mb-8">
        An email confirmation has been sent to your email address. You can also track your order in your account dashboard.
      </p>
      
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Link 
          href="/account/orders"
          className="bg-primary text-primary-foreground hover:bg-primary/90 px-6 py-3 rounded-md font-medium inline-flex items-center justify-center gap-2"
        >
          <Package className="h-5 w-5" />
          Track Order
        </Link>
        
        <Link 
          href="/products"
          className="bg-muted hover:bg-muted/80 px-6 py-3 rounded-md font-medium inline-flex items-center justify-center gap-2"
        >
          <ShoppingBag className="h-5 w-5" />
          Continue Shopping
        </Link>
        
        <Link 
          href="/"
          className="bg-muted hover:bg-muted/80 px-6 py-3 rounded-md font-medium inline-flex items-center justify-center gap-2"
        >
          <Home className="h-5 w-5" />
          Back to Home
        </Link>
      </div>
    </div>
  );
}