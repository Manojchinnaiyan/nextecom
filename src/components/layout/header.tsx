'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';
import { useCart } from '@/contexts/cart-context';
import { ShoppingCart, User, Menu, X } from 'lucide-react';

export default function Header() {
  const { user, logout } = useAuth();
  const { itemCount } = useCart();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const isActive = (path: string) => {
    return pathname === path;
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center">
          <Link href="/" className="text-xl font-bold">
            NextShop
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <Link
            href="/"
            className={`text-sm font-medium transition-colors hover:text-primary ${
              isActive('/') ? 'text-primary' : 'text-foreground/60'
            }`}
          >
            Home
          </Link>
          <Link
            href="/products"
            className={`text-sm font-medium transition-colors hover:text-primary ${
              isActive('/products') ? 'text-primary' : 'text-foreground/60'
            }`}
          >
            Products
          </Link>
          {user?.role === 'ADMIN' && (
            <Link
              href="/admin"
              className={`text-sm font-medium transition-colors hover:text-primary ${
                pathname.startsWith('/admin') ? 'text-primary' : 'text-foreground/60'
              }`}
            >
              Admin
            </Link>
          )}
        </nav>

        {/* Desktop User Actions */}
        <div className="hidden md:flex items-center gap-4">
          <Link
            href="/cart"
            className="flex h-9 w-9 items-center justify-center rounded-full bg-muted relative"
          >
            <ShoppingCart className="h-5 w-5" />
            <span className="sr-only">Cart</span>
            {itemCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs w-5 h-5 flex items-center justify-center rounded-full">
                {itemCount > 99 ? '99+' : itemCount}
              </span>
            )}
          </Link>

          {user ? (
            <div className="flex items-center gap-4">
              <Link
                href="/account"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-muted"
              >
                <User className="h-5 w-5" />
                <span className="sr-only">Account</span>
              </Link>
              <button
                onClick={() => logout()}
                className="text-sm font-medium text-foreground/60 hover:text-primary transition-colors"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <Link
                href="/login"
                className="text-sm font-medium text-foreground/60 hover:text-primary transition-colors"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="text-sm font-medium bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 transition-colors"
              >
                Register
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="flex md:hidden items-center justify-center"
          onClick={toggleMobileMenu}
        >
          {mobileMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t">
          <div className="container py-4 space-y-4">
            <nav className="flex flex-col space-y-4">
              <Link
                href="/"
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  isActive('/') ? 'text-primary' : 'text-foreground/60'
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                href="/products"
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  isActive('/products') ? 'text-primary' : 'text-foreground/60'
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                Products
              </Link>
              {user?.role === 'ADMIN' && (
                <Link
                  href="/admin"
                  className={`text-sm font-medium transition-colors hover:text-primary ${
                    pathname.startsWith('/admin') ? 'text-primary' : 'text-foreground/60'
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Admin
                </Link>
              )}
              <Link
                href="/cart"
                className={`text-sm font-medium transition-colors hover:text-primary flex items-center gap-2 ${
                  isActive('/cart') ? 'text-primary' : 'text-foreground/60'
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                <ShoppingCart className="h-4 w-4" />
                Cart
              </Link>
              {user ? (
                <>
                  <Link
                    href="/account"
                    className={`text-sm font-medium transition-colors hover:text-primary flex items-center gap-2 ${
                      pathname.startsWith('/account') ? 'text-primary' : 'text-foreground/60'
                    }`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <User className="h-4 w-4" />
                    Account
                  </Link>
                  <button
                    onClick={() => {
                      logout();
                      setMobileMenuOpen(false);
                    }}
                    className="text-sm font-medium text-foreground/60 hover:text-primary transition-colors text-left"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="text-sm font-medium text-foreground/60 hover:text-primary transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    href="/register"
                    className="text-sm font-medium bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 transition-colors inline-block"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Register
                  </Link>
                </>
              )}
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}