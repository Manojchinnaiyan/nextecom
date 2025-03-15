'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FolderOpen, ShoppingBag } from 'lucide-react';

interface Category {
  id: string;
  name: string;
  _count?: {
    products: number;
  };
}

export default function CategoriesPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    async function fetchCategories() {
      setLoading(true);
      setError(null);
      
      try {
        const response = await fetch('/api/categories');
        
        if (!response.ok) throw new Error('Failed to fetch categories');
        
        const data = await response.json();
        setCategories(data);
      } catch (err) {
        console.error('Error fetching categories:', err);
        setError('Failed to load categories. Please try again later.');
      } finally {
        setLoading(false);
      }
    }
    
    fetchCategories();
  }, []);
  
  const handleCategoryClick = (categoryId: string) => {
    router.push(`/products?category=${categoryId}`);
  };
  
  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-8">Product Categories</h1>
      
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4, 5, 6].map((item) => (
            <div key={item} className="bg-card animate-pulse rounded-lg overflow-hidden border h-40">
              <div className="h-full flex flex-col items-center justify-center p-6">
                <div className="w-12 h-12 bg-muted rounded-full mb-4"></div>
                <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-muted rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="text-center py-12">
          <p className="text-destructive">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-md"
          >
            Try Again
          </button>
        </div>
      ) : categories.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-xl">No categories found.</p>
          <p className="text-muted-foreground mt-2">
            Categories will appear here once they are added by an administrator.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {categories.map((category) => (
            <div 
              key={category.id} 
              onClick={() => handleCategoryClick(category.id)}
              className="bg-card border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer p-6 flex flex-col items-center"
            >
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <FolderOpen className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-center">{category.name}</h3>
              <p className="text-muted-foreground text-sm flex items-center gap-1">
                <ShoppingBag className="h-4 w-4" />
                {category._count?.products || 0} products
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}