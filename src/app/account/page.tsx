'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';
import { Edit2, Package, Settings, User, LogOut, Loader2 } from 'lucide-react';

export default function AccountPage() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [loggingOut, setLoggingOut] = useState(false);
  
  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await logout();
      // Router navigation happens in the logout function
    } catch (error) {
      console.error('Logout error:', error);
      setLoggingOut(false);
    }
  };
  
  if (!user) {
    // This would normally happen through middleware, but just in case
    router.push('/login?from=/account');
    return null;
  }
  
  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-8">My Account</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-card border rounded-lg p-6 space-y-2 sticky top-20">
            <div className="flex items-center gap-3 p-2 bg-primary/10 rounded-md">
              <User className="h-5 w-5 text-primary" />
              <span className="font-medium">Profile</span>
            </div>
            
            <Link 
              href="/account/orders" 
              className="flex items-center gap-3 p-2 hover:bg-muted rounded-md"
            >
              <Package className="h-5 w-5" />
              <span>Orders</span>
            </Link>
            
            <Link 
              href="/account/settings" 
              className="flex items-center gap-3 p-2 hover:bg-muted rounded-md"
            >
              <Settings className="h-5 w-5" />
              <span>Settings</span>
            </Link>
            
            <button
              onClick={handleLogout}
              disabled={loggingOut}
              className="w-full flex items-center gap-3 p-2 hover:bg-muted rounded-md text-left text-destructive"
            >
              {loggingOut ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <LogOut className="h-5 w-5" />
              )}
              <span>{loggingOut ? 'Logging out...' : 'Logout'}</span>
            </button>
          </div>
        </div>
        
        {/* Main Content */}
        <div className="lg:col-span-3">
          <div className="bg-card border rounded-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Profile Information</h2>
              <Link 
                href="/account/edit-profile" 
                className="text-primary hover:underline flex items-center gap-1"
              >
                <Edit2 className="h-4 w-4" />
                <span>Edit</span>
              </Link>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Name</p>
                  <p className="font-medium">{user.name || 'Not set'}</p>
                </div>
                
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-medium">{user.email}</p>
                </div>
              </div>
              
              <div>
                <p className="text-sm text-muted-foreground">Account Type</p>
                <p className="font-medium capitalize">{user.role.toLowerCase()}</p>
              </div>
              
              <div>
                <p className="text-sm text-muted-foreground">Member Since</p>
                <p className="font-medium">
                  {new Date(user.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-card border rounded-lg p-6 mt-6">
            <h2 className="text-xl font-semibold mb-6">Recent Orders</h2>
            
            <div className="space-y-4">
              {/* Order Items would go here - using placeholder for demo */}
              <div className="text-center py-8 text-muted-foreground">
                <p>You don't have any orders yet.</p>
                <Link 
                  href="/products" 
                  className="text-primary hover:underline mt-2 inline-block"
                >
                  Start shopping
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}