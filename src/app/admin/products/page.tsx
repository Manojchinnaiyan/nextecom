'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';
import { Edit, Plus, Search, Trash2 } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  stock: number;
  category: {
    id: string;
    name: string;
  };
}

export default function AdminProductsPage() {
  const { user } = useAuth();
  const router = useRouter();
  
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  
  useEffect(() => {
    // Redirect if not admin
    if (user && user.role !== 'ADMIN') {
      router.push('/');
      return;
    }
    
    async function fetchProducts() {
      setLoading(true);
      setError(null);
      
      try {
        const queryParams = new URLSearchParams();
        queryParams.append('page', currentPage.toString());
        queryParams.append('limit', '10');
        
        if (searchTerm) {
          queryParams.append('search', searchTerm);
        }
        
        const response = await fetch(`/api/products?${queryParams.toString()}`);
        
        if (!response.ok) throw new Error('Failed to fetch products');
        
        const data = await response.json();
        setProducts(data.products);
        setTotalPages(data.pagination.totalPages);
      } catch (err) {
        console.error('Error fetching products:', err);
        setError('Failed to load products. Please try again later.');
      } finally {
        setLoading(false);
      }
    }
    
    if (user && user.role === 'ADMIN') {
      fetchProducts();
    }
  }, [user, router, currentPage, searchTerm]);
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1); // Reset to first page when searching
  };
  
  const handleDeleteProduct = async (productId: string) => {
    if (window.confirm('Are you sure you want to delete this product? This action cannot be undone.')) {
      setIsDeleting(productId);
      
      try {
        const response = await fetch(`/api/products/${productId}`, {
          method: 'DELETE',
        });
        
        if (!response.ok) throw new Error('Failed to delete product');
        
        // Remove the product from the list
        setProducts(prevProducts => prevProducts.filter(product => product.id !== productId));
      } catch (err) {
        console.error('Error deleting product:', err);
        alert('Failed to delete product. Please try again.');
      } finally {
        setIsDeleting(null);
      }
    }
  };
  
  if (!user || user.role !== 'ADMIN') {
    return null; // Redirect is handled in useEffect
  }
  
  return (
    <div className="container py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <h1 className="text-3xl font-bold">Products</h1>
        
        <Link 
          href="/admin/products/new" 
          className="bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md font-medium flex items-center gap-2"
        >
          <Plus className="h-5 w-5" />
          Add Product
        </Link>
      </div>
      
      {/* Search Bar */}
      <div className="mb-8">
        <form onSubmit={handleSearch} className="flex w-full max-w-md">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Search products..."
              className="w-full px-4 py-2 pr-10 rounded-l-md border bg-background"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button 
              type="submit" 
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <Search className="h-5 w-5" />
            </button>
          </div>
          <button 
            type="submit"
            className="bg-primary text-primary-foreground hover:bg-primary/90 px-4 rounded-r-md"
          >
            Search
          </button>
        </form>
      </div>
      
      {loading ? (
        <div className="bg-card border rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Product
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Stock
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-background divide-y divide-muted">
                {[1, 2, 3, 4, 5].map((item) => (
                  <tr key={item} className="animate-pulse">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 bg-muted rounded-md"></div>
                        <div className="ml-4">
                          <div className="h-4 bg-muted rounded w-24"></div>
                          <div className="h-3 bg-muted rounded w-32 mt-1"></div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="h-4 bg-muted rounded w-20"></div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="h-4 bg-muted rounded w-16"></div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="h-4 bg-muted rounded w-12"></div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="h-4 bg-muted rounded w-20 ml-auto"></div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : error ? (
        <div className="text-center py-12">
          <p className="text-destructive">{error}</p>
          <button 
            onClick={() => setCurrentPage(1)} 
            className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-md"
          >
            Try Again
          </button>
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-12 bg-card border rounded-lg">
          <p className="text-xl">No products found.</p>
          <p className="text-muted-foreground mt-2">
            {searchTerm ? 'Try a different search term or' : 'Start by'} adding a new product.
          </p>
          <Link 
            href="/admin/products/new" 
            className="mt-4 inline-flex items-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md font-medium"
          >
            <Plus className="h-5 w-5" />
            Add Product
          </Link>
        </div>
      ) : (
        <>
          <div className="bg-card border rounded-lg shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Product
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Price
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Stock
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-background divide-y divide-muted">
                  {products.map((product) => (
                    <tr key={product.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-10 w-10 bg-muted rounded-md relative overflow-hidden">
                            {product.image ? (
                              <Image
                                src={product.image}
                                alt={product.name}
                                fill
                                className="object-cover"
                              />
                            ) : (
                              <div className="absolute inset-0 flex items-center justify-center text-muted-foreground text-xs">
                                No Image
                              </div>
                            )}
                          </div>
                          <div className="ml-4">
                            <div className="font-medium">{product.name}</div>
                            <div className="text-sm text-muted-foreground truncate max-w-xs">
                              {product.description.length > 50
                                ? `${product.description.substring(0, 50)}...`
                                : product.description}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 py-1 text-xs bg-primary/10 text-primary rounded-full">
                          {product.category.name}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap font-medium">
                        ${product.price.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`${
                          product.stock > 10 
                            ? 'text-green-600' 
                            : product.stock > 0 
                            ? 'text-amber-600' 
                            : 'text-destructive'
                        }`}>
                          {product.stock}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                        <div className="flex justify-end">
                          <Link 
                            href={`/admin/products/${product.id}/edit`}
                            className="text-primary hover:text-primary/80 p-1"
                            title="Edit product"
                          >
                            <Edit className="h-5 w-5" />
                          </Link>
                          <button
                            onClick={() => handleDeleteProduct(product.id)}
                            disabled={isDeleting === product.id}
                            className="text-destructive hover:text-destructive/80 p-1 ml-2"
                            title="Delete product"
                          >
                            <Trash2 className="h-5 w-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          
          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-4 mt-8">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 rounded-md border bg-background disabled:opacity-50"
              >
                Previous
              </button>
              <span>
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 rounded-md border bg-background disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}