'use client';

import Link from 'next/link';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="w-full border-t bg-background">
      <div className="container py-10 md:py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-3">
            <h3 className="text-base font-semibold">NextShop</h3>
            <p className="text-sm text-muted-foreground">
              A modern e-commerce platform built with Next.js, Tailwind CSS, and Prisma.
            </p>
          </div>
          
          <div className="space-y-3">
            <h3 className="text-base font-semibold">Shop</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/products" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  All Products
                </Link>
              </li>
              <li>
                <Link href="/categories" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Categories
                </Link>
              </li>
              <li>
                <Link href="/cart" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Cart
                </Link>
              </li>
            </ul>
          </div>
          
          <div className="space-y-3">
            <h3 className="text-base font-semibold">Account</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/login" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Login
                </Link>
              </li>
              <li>
                <Link href="/register" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Register
                </Link>
              </li>
              <li>
                <Link href="/account" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  My Account
                </Link>
              </li>
              <li>
                <Link href="/orders" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Orders
                </Link>
              </li>
            </ul>
          </div>
          
          <div className="space-y-3">
            <h3 className="text-base font-semibold">Legal</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/privacy" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/shipping" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Shipping Policy
                </Link>
              </li>
              <li>
                <Link href="/refund" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Refund Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-10 border-t pt-6">
          <p className="text-center text-sm text-muted-foreground">
            © {currentYear} NextShop. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}