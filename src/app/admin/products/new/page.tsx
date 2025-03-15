'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/auth-context';
import { ArrowLeft } from 'lucide-react';
import { z } from 'zod';

interface Category {
  id: string;
  name: string;
}

const productSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  description: z.string().min(5, 'Description must be at least 5 characters'),
  price: z.string().refine(val => !isNaN(parseFloat(val)) && parseFloat(val) > 0, {
    message: 'Price must be a positive number',
  }),
  image: z.string().url('Please enter a valid image URL'),
  categoryId: z.string().min(1, 'Category is required'),
  stock: z.string().refine(val => !isNaN(parseInt(val)) && parseInt(val) >= 0, {
    message: 'Stock must be a non-negative number',
  }),
});

type ProductFormData = z.infer<typeof productSchema>;

export default function NewProductPage() {
  const { user } = useAuth();
  const router = useRouter();
  
  const [formData, setFormData] = useState<ProductFormData>({
    name: '',
    description: '',
    price: '',
    image: '',
    categoryId: '',
    stock: '',
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  
  useEffect(() => {
    // Redirect if not admin
    if (user && user.role !== 'ADMIN') {
      router.push('/');
      return;
    }
    
    async function fetchCategories() {
      setCategoriesLoading(true);
      
      try {
        const response = await fetch('/api/categories');
        if (!response.ok) throw new Error('Failed to fetch categories');
        const data = await response.json();
        setCategories(data);
      } catch (err) {
        console.error('Error fetching categories:', err);
        setSubmitError('Failed to load categories. Please refresh and try again.');
      } finally {
        setCategoriesLoading(false);
      }
    }
    
    if (user && user.role === 'ADMIN') {
      fetchCategories();
    }
  }, [user, router]);
  
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
      productSchema.parse(formData);
      setErrors({});
      return true;
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
    setSubmitError(null);
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      const productData = {
        ...formData,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock),
      };
      
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData),
      });
      
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to create product');
      }
      
      // Success, redirect to products page
      router.push('/admin/products');
    } catch (err) {
      console.error('Error creating product:', err);
      setSubmitError(err instanceof Error ? err.message : 'Failed to create product. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (!user || user.role !== 'ADMIN') {
    return null; // Redirect is handled in useEffect
  }
  
  return (
    <div className="container py-8 max-w-4xl">
      <Link 
        href="/admin/products"
        className="flex items-center gap-1 text-muted-foreground hover:text-foreground mb-8"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Products
      </Link>
      
      <h1 className="text-3xl font-bold mb-8">Add New Product</h1>
      
      <form onSubmit={handleSubmit} className="space-y-6 bg-card p-6 border rounded-lg">
        {submitError && (
          <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-md">
            {submitError}
          </div>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label htmlFor="name" className="block text-sm font-medium">
              Product Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full px-4 py-2 rounded-md border bg-background"
              disabled={isSubmitting}
              required
            />
            {errors.name && (
              <p className="text-sm text-destructive">{errors.name}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <label htmlFor="categoryId" className="block text-sm font-medium">
              Category
            </label>
            <select
              id="categoryId"
              name="categoryId"
              value={formData.categoryId}
              onChange={handleInputChange}
              className="w-full px-4 py-2 rounded-md border bg-background"
              disabled={isSubmitting || categoriesLoading}
              required
            >
              <option value="">Select Category</option>
              {categories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
            {errors.categoryId && (
              <p className="text-sm text-destructive">{errors.categoryId}</p>
            )}
          </div>
        </div>
        
        <div className="space-y-2">
          <label htmlFor="description" className="block text-sm font-medium">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            className="w-full px-4 py-2 rounded-md border bg-background"
            rows={4}
            disabled={isSubmitting}
            required
          />
          {errors.description && (
            <p className="text-sm text-destructive">{errors.description}</p>
          )}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <label htmlFor="price" className="block text-sm font-medium">
              Price ($)
            </label>
            <input
              id="price"
              name="price"
              type="number"
              step="0.01"
              min="0.01"
              value={formData.price}
              onChange={handleInputChange}
              className="w-full px-4 py-2 rounded-md border bg-background"
              disabled={isSubmitting}
              required
            />
            {errors.price && (
              <p className="text-sm text-destructive">{errors.price}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <label htmlFor="stock" className="block text-sm font-medium">
              Stock
            </label>
            <input
              id="stock"
              name="stock"
              type="number"
              step="1"
              min="0"
              value={formData.stock}
              onChange={handleInputChange}
              className="w-full px-4 py-2 rounded-md border bg-background"
              disabled={isSubmitting}
              required
            />
            {errors.stock && (
              <p className="text-sm text-destructive">{errors.stock}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <label htmlFor="image" className="block text-sm font-medium">
              Image URL
            </label>
            <input
              id="image"
              name="image"
              type="url"
              value={formData.image}
              onChange={handleInputChange}
              className="w-full px-4 py-2 rounded-md border bg-background"
              placeholder="https://example.com/image.jpg"
              disabled={isSubmitting}
              required
            />
            {errors.image && (
              <p className="text-sm text-destructive">{errors.image}</p>
            )}
          </div>
        </div>
        
        <div className="flex justify-end space-x-4 pt-4">
          <Link
            href="/admin/products"
            className="px-4 py-2 border rounded-md hover:bg-muted"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 px-4 py-2 rounded-md font-medium"
          >
            {isSubmitting ? 'Creating...' : 'Create Product'}
          </button>
        </div>
      </form>
    </div>
  );
}