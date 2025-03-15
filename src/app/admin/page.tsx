'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';
import { 
  AreaChart, 
  Package, 
  ShoppingBag, 
  Users, 
  Layers, 
  DollarSign,
  CircleDotDashed
} from 'lucide-react';

interface DashboardSummary {
  totalOrders: number;
  totalProducts: number;
  totalUsers: number;
  totalRevenue: number;
  recentOrders: Array<{
    id: string;
    createdAt: string;
    total: number;
    status: string;
    user: {
      name: string;
      email: string;
    };
  }>;
}

export default function AdminDashboardPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [dashboardData, setDashboardData] = useState<DashboardSummary>({
    totalOrders: 0,
    totalProducts: 0,
    totalUsers: 0,
    totalRevenue: 0,
    recentOrders: []
  });
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // If not admin, redirect to home
    if (user && user.role !== 'ADMIN') {
      router.push('/');
      return;
    }
    
    // Fetch dashboard data
    const fetchDashboardData = async () => {
      setLoading(true);
      
      try {
        // This would normally be an API call to get dashboard data
        // For demo, we're using mock data
        await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
        
        setDashboardData({
          totalOrders: 125,
          totalProducts: 48,
          totalUsers: 312,
          totalRevenue: 10542.79,
          recentOrders: [
            {
              id: 'ORD-123456',
              createdAt: new Date().toISOString(),
              total: 159.99,
              status: 'PROCESSING',
              user: {
                name: 'John Doe',
                email: 'john@example.com'
              }
            },
            {
              id: 'ORD-123455',
              createdAt: new Date(Date.now() - 3600000).toISOString(),
              total: 89.99,
              status: 'SHIPPED',
              user: {
                name: 'Jane Smith',
                email: 'jane@example.com'
              }
            },
            {
              id: 'ORD-123454',
              createdAt: new Date(Date.now() - 86400000).toISOString(),
              total: 249.99,
              status: 'DELIVERED',
              user: {
                name: 'Robert Johnson',
                email: 'robert@example.com'
              }
            }
          ]
        });
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    if (user && user.role === 'ADMIN') {
      fetchDashboardData();
    }
  }, [user, router]);
  
  if (!user || user.role !== 'ADMIN') {
    return null; // Redirection is handled in useEffect
  }
  
  return (
    <div className="container py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        
        <div className="flex gap-4">
          <Link 
            href="/admin/products/new" 
            className="bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md font-medium"
          >
            Add Product
          </Link>
          
          <Link 
            href="/admin/categories/new" 
            className="bg-muted hover:bg-muted/80 px-4 py-2 rounded-md font-medium"
          >
            Add Category
          </Link>
        </div>
      </div>
      
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <CircleDotDashed className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <>
          {/* Stats Overview */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-card border rounded-lg p-6 shadow-sm">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm text-muted-foreground">Total Orders</p>
                  <h3 className="text-2xl font-bold mt-1">{dashboardData.totalOrders}</h3>
                </div>
                <div className="bg-primary/10 p-2 rounded-md">
                  <Package className="h-6 w-6 text-primary" />
                </div>
              </div>
              <div className="mt-4 text-xs text-muted-foreground">
                <span className="text-green-600">↑ 12%</span> from last month
              </div>
            </div>
            
            <div className="bg-card border rounded-lg p-6 shadow-sm">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm text-muted-foreground">Total Products</p>
                  <h3 className="text-2xl font-bold mt-1">{dashboardData.totalProducts}</h3>
                </div>
                <div className="bg-primary/10 p-2 rounded-md">
                  <ShoppingBag className="h-6 w-6 text-primary" />
                </div>
              </div>
              <div className="mt-4 text-xs text-muted-foreground">
                <span className="text-green-600">↑ 8%</span> new products added
              </div>
            </div>
            
            <div className="bg-card border rounded-lg p-6 shadow-sm">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm text-muted-foreground">Total Users</p>
                  <h3 className="text-2xl font-bold mt-1">{dashboardData.totalUsers}</h3>
                </div>
                <div className="bg-primary/10 p-2 rounded-md">
                  <Users className="h-6 w-6 text-primary" />
                </div>
              </div>
              <div className="mt-4 text-xs text-muted-foreground">
                <span className="text-green-600">↑ 15%</span> from last month
              </div>
            </div>
            
            <div className="bg-card border rounded-lg p-6 shadow-sm">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm text-muted-foreground">Total Revenue</p>
                  <h3 className="text-2xl font-bold mt-1">${dashboardData.totalRevenue.toLocaleString()}</h3>
                </div>
                <div className="bg-primary/10 p-2 rounded-md">
                  <DollarSign className="h-6 w-6 text-primary" />
                </div>
              </div>
              <div className="mt-4 text-xs text-muted-foreground">
                <span className="text-green-600">↑ 23%</span> from last month
              </div>
            </div>
          </div>
          
          {/* Recent Orders */}
          <div className="bg-card border rounded-lg shadow-sm overflow-hidden mb-8">
            <div className="p-6 border-b">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">Recent Orders</h2>
                <Link href="/admin/orders" className="text-primary hover:underline text-sm">
                  View All
                </Link>
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Order ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Customer
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-background divide-y divide-muted">
                  {dashboardData.recentOrders.map((order) => (
                    <tr key={order.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium">{order.id}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm">{order.user.name}</div>
                        <div className="text-xs text-muted-foreground">{order.user.email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {new Date(order.createdAt).toLocaleTimeString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium">${order.total.toFixed(2)}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          order.status === 'PROCESSING' 
                            ? 'bg-amber-100 text-amber-800' 
                            : order.status === 'SHIPPED'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-green-100 text-green-800'
                        }`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                        <Link href={`/admin/orders/${order.id}`} className="text-primary hover:underline">
                          View
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          
          {/* Quick Links */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-card border rounded-lg p-6 shadow-sm">
              <h3 className="font-medium mb-4 flex items-center gap-2">
                <Layers className="h-5 w-5" />
                Products Management
              </h3>
              <div className="space-y-2">
                <Link href="/admin/products" className="block text-primary hover:underline">
                  View All Products
                </Link>
                <Link href="/admin/products/new" className="block text-primary hover:underline">
                  Add New Product
                </Link>
                <Link href="/admin/categories" className="block text-primary hover:underline">
                  Manage Categories
                </Link>
              </div>
            </div>
            
            <div className="bg-card border rounded-lg p-6 shadow-sm">
              <h3 className="font-medium mb-4 flex items-center gap-2">
                <Package className="h-5 w-5" />
                Orders Management
              </h3>
              <div className="space-y-2">
                <Link href="/admin/orders" className="block text-primary hover:underline">
                  All Orders
                </Link>
                <Link href="/admin/orders?status=pending" className="block text-primary hover:underline">
                  Pending Orders
                </Link>
                <Link href="/admin/orders?status=shipped" className="block text-primary hover:underline">
                  Shipped Orders
                </Link>
              </div>
            </div>
            
            <div className="bg-card border rounded-lg p-6 shadow-sm">
              <h3 className="font-medium mb-4 flex items-center gap-2">
                <Users className="h-5 w-5" />
                Customer Management
              </h3>
              <div className="space-y-2">
                <Link href="/admin/users" className="block text-primary hover:underline">
                  All Users
                </Link>
                <Link href="/admin/users?role=admin" className="block text-primary hover:underline">
                  Admin Users
                </Link>
                <Link href="/admin/users/new" className="block text-primary hover:underline">
                  Add New User
                </Link>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}