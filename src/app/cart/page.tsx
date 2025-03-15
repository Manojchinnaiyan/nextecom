'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCart } from '@/contexts/cart-context';
import { useAuth } from '@/contexts/auth-context';
import { Trash2, Minus, Plus, ShoppingBag, ArrowRight } from 'lucide-react';

export default function CartPage() {
  const { items, removeItem, updateQuantity, total, clearCart } = useCart();
  const { user } = useAuth();
  const router = useRouter();
  const [cartLoading, setCartLoading] = useState(false);
  
  const handleUpdateQuantity = (id: string, newQuantity: number) => {
    updateQuantity(id, newQuantity);
  };
  
  const handleRemoveItem = (id: string) => {
    removeItem(id);
  };
  
  const handleCheckout = () => {
    if (!user) {
      // Redirect to login if not authenticated
      router.push('/login?from=/checkout');
      return;
    }
    
    // Proceed to checkout
    router.push('/checkout');
  };
  
  if (items.length === 0) {
    return (
      <div className="container py-12 text-center">
        <div className="max-w-md mx-auto">
          <ShoppingBag className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
          <h1 className="text-2xl font-bold mb-4">Your cart is empty</h1>
          <p className="text-muted-foreground mb-8">
            Looks like you haven't added any products to your cart yet.
          </p>
          <Link
            href="/products"
            className="bg-primary text-primary-foreground hover:bg-primary/90 px-6 py-3 rounded-md font-medium inline-flex items-center gap-2"
          >
            Browse Products
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <div className="border rounded-lg overflow-hidden">
            <div className="hidden md:grid grid-cols-5 gap-4 p-4 bg-muted text-sm font-medium">
              <div className="col-span-2">Product</div>
              <div className="text-center">Price</div>
              <div className="text-center">Quantity</div>
              <div className="text-right">Total</div>
            </div>
            
            <div className="divide-y">
              {items.map(item => (
                <div key={item.id} className="p-4">
                  <div className="md:grid md:grid-cols-5 md:gap-4 md:items-center">
                    {/* Product Info - Mobile & Desktop */}
                    <div className="col-span-2 flex gap-4 mb-4 md:mb-0">
                      <div className="relative h-16 w-16 rounded-md overflow-hidden bg-muted">
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
                      
                      <div>
                        <Link href={`/products/${item.id}`} className="font-medium hover:text-primary">
                          {item.name}
                        </Link>
                        
                        {/* Mobile Price */}
                        <div className="md:hidden mt-1 text-sm text-muted-foreground">
                          ${item.price.toFixed(2)} each
                        </div>
                      </div>
                    </div>
                    
                    {/* Desktop Price */}
                    <div className="hidden md:block text-center">
                      ${item.price.toFixed(2)}
                    </div>
                    
                    {/* Quantity Controls */}
                    <div className="flex items-center justify-between md:justify-center my-4 md:my-0">
                      <div className="md:hidden font-medium">Quantity:</div>
                      <div className="flex items-center border rounded-md">
                        <button
                          onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                          className="p-1.5 text-muted-foreground hover:text-foreground"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="h-4 w-4" />
                        </button>
                        
                        <span className="w-10 text-center">{item.quantity}</span>
                        
                        <button
                          onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                          className="p-1.5 text-muted-foreground hover:text-foreground"
                          aria-label="Increase quantity"
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                    
                    {/* Item Total */}
                    <div className="flex items-center justify-between md:justify-end md:text-right">
                      <div className="md:hidden font-medium">Total:</div>
                      <div className="font-medium">${(item.price * item.quantity).toFixed(2)}</div>
                    </div>
                    
                    {/* Remove Button */}
                    <div className="flex justify-end mt-4 md:mt-0">
                      <button
                        onClick={() => handleRemoveItem(item.id)}
                        className="text-muted-foreground hover:text-destructive"
                        aria-label="Remove item"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="mt-4 flex justify-between">
            <Link href="/products" className="text-primary hover:underline flex items-center gap-2">
              <ArrowRight className="h-4 w-4 rotate-180" />
              Continue Shopping
            </Link>
            
            <button
              onClick={() => clearCart()}
              className="text-muted-foreground hover:text-destructive"
            >
              Clear Cart
            </button>
          </div>
        </div>
        
        {/* Order Summary */}
        <div>
          <div className="border rounded-lg p-6 space-y-4 sticky top-20">
            <h2 className="text-xl font-bold mb-4">Order Summary</h2>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span>${total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Shipping</span>
                <span>Calculated at checkout</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Tax</span>
                <span>Calculated at checkout</span>
              </div>
            </div>
            
            <div className="border-t pt-4 mt-4">
              <div className="flex justify-between font-bold">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>
            
            <button
              onClick={handleCheckout}
              disabled={cartLoading}
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90 px-6 py-3 rounded-md font-medium mt-4 flex items-center justify-center gap-2"
            >
              {cartLoading ? 'Processing...' : 'Proceed to Checkout'}
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}