'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';
import { Edit, FolderOpen, Plus, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { z } from 'zod';

interface Category {
  id: string;
  name: string;
  _count?: {
    products: number;
  };
}

const categorySchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
});

export default function AdminCategoriesPage() {
  const { user } = useAuth();
  const router = useRouter();
  
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  
  // New category form state
  const [showForm, setShowForm] = useState(false);
  const [categoryName, setCategoryName] = useState('');
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  useEffect(() => {
    // Redirect if not admin
    if (user && user.role !== 'ADMIN') {
      router.push('/');
      return;
    }
    
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
    
    if (user && user.role === 'ADMIN') {
      fetchCategories();
    }
  }, [user, router]);
  
  const handleDeleteCategory = async (categoryId: string) => {
    // Check if this category has products
    const category = categories.find(c => c.id === categoryId);
    if (category && category._count && category._count.products > 0) {
      alert(`This category has ${category._count.products} products. Please reassign or delete these products first.`);
      return;
    }
    
    if (window.confirm('Are you sure you want to delete this category? This action cannot be undone.')) {
      setIsDeleting(categoryId);
      
      try {
        const response = await fetch(`/api/categories/${categoryId}`, {
          method: 'DELETE',
        });
        
        if (!response.ok) throw new Error('Failed to delete category');
        
        // Remove the category from the list
        setCategories(prevCategories => prevCategories.filter(category => category.id !== categoryId));
      } catch (err) {
        console.error('Error deleting category:', err);
        alert('Failed to delete category. Please try again.');
      } finally {
        setIsDeleting(null);
      }
    }
  };
  
  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    
    try {
      // Validate with Zod
      categorySchema.parse({ name: categoryName });
      
      setIsSubmitting(true);
      
      const response = await fetch('/api/categories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: categoryName }),
      });
      
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to create category');
      }
      
      const newCategory = await response.json();
      
      // Add the new category to the list
      setCategories(prevCategories => [...prevCategories, newCategory]);
      
      // Reset form
      setCategoryName('');
      setShowForm(false);
    } catch (err) {
      console.error('Error creating category:', err);
      if (err instanceof z.ZodError) {
        setFormError(err.errors[0].message);
      } else if (err instanceof Error) {
        setFormError(err.message);
      } else {
        setFormError('Failed to create category');
      }
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (!user || user.role !== 'ADMIN') {
    return null; // Redirect is handled in useEffect
  }
  
  return (
    <div className="container py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <h1 className="text-3xl font-bold">Categories</h1>
        
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md font-medium flex items-center gap-2"
        >
          <Plus className="h-5 w-5" />
          Add Category
        </button>
      </div>
      
      {/* Add Category Form */}
      {showForm && (
        <div className="bg-card p-6 mb-8 rounded-lg border">
          <h2 className="text-xl font-semibold mb-4">Add New Category</h2>
          <form onSubmit={handleAddCategory} className="space-y-4">
            {formError && (
              <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-md">
                {formError}
              </div>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <input
                  type="text"
                  value={categoryName}
                  onChange={(e) => setCategoryName(e.target.value)}
                  placeholder="Category Name"
                  className="w-full px-4 py-2 rounded-md border bg-background"
                  disabled={isSubmitting}
                  required
                />
              </div>
              <div className="flex gap-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 px-4 py-2 rounded-md font-medium"
                >
                  {isSubmitting ? 'Creating...' : 'Create Category'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setCategoryName('');
                    setFormError(null);
                  }}
                  className="px-4 py-2 border rounded-md hover:bg-muted"
                >
                  Cancel
                </button>
              </div>
            </div>
          </form>
        </div>
      )}
      
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
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
        <div className="text-center py-12 bg-card border rounded-lg">
          <p className="text-xl">No categories found.</p>
          <p className="text-muted-foreground mt-2">
            Start by adding your first category.
          </p>
          <button
            onClick={() => setShowForm(true)}
            className="mt-4 inline-flex items-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md font-medium"
          >
            <Plus className="h-5 w-5" />
            Add Category
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {categories.map((category) => (
            <div 
              key={category.id}
              className="bg-card border rounded-lg overflow-hidden shadow-sm p-6 flex flex-col items-center relative"
            >
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <FolderOpen className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-center">{category.name}</h3>
              <p className="text-muted-foreground text-sm">
                {category._count?.products || 0} products
              </p>
              
              {/* Actions */}
              <div className="absolute top-4 right-4 flex">
                <Link
                  href={`/admin/categories/${category.id}/edit`}
                  className="text-primary hover:text-primary/80 p-1.5"
                  title="Edit category"
                >
                  <Edit className="h-5 w-5" />
                </Link>
                <button
                  onClick={() => handleDeleteCategory(category.id)}
                  disabled={isDeleting === category.id}
                  className="text-destructive hover:text-destructive/80 p-1.5"
                  title="Delete category"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}