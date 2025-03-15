'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { ChevronLeft, Minus, Plus, ShoppingCart } from 'lucide-react';
import { useCart } from '@/contexts/cart-context';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: {
    id: string;
    name: string;
  };
  stock: number;
}

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const productId = params.id as string;
  
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  // No need for selected image with only one image
  const [addingToCart, setAddingToCart] = useState(false);
  
  useEffect(() => {
    async function fetchProduct() {
      setLoading(true);
      setError(null);
      
      try {
        const response = await fetch(`/api/products/${productId}`);
        
        if (response.status === 404) {
          setError('Product not found');
          return;
        }
        
        if (!response.ok) {
          throw new Error('Failed to fetch product');
        }
        
        const productData = await response.json();
        setProduct(productData);
      } catch (err) {
        console.error('Error fetching product details:', err);
        setError('Failed to load product details. Please try again later.');
      } finally {
        setLoading(false);
      }
    }
    
    if (productId) {
      fetchProduct();
    }
  }, [productId]);
  
  const incrementQuantity = () => {
    if (product && quantity < product.stock) {
      setQuantity(quantity + 1);
    }
  };
  
  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };
  
  const { addItem } = useCart();
  
  const handleAddToCart = async () => {
    if (!product) return;
    
    setAddingToCart(true);
    
    try {
      // Add to cart
      addItem({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image || '',
      }, quantity);
      
      // Success message
      console.log(`Added ${quantity} of ${product.name} to cart`);
      
      // Here you would typically show a success toast notification
    } catch (err) {
      console.error('Error adding to cart:', err);
      // Show error message
    } finally {
      setAddingToCart(false);
    }
  };
  
  if (loading) {
    return (
      <div className="container py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-muted rounded w-1/4 mb-8"></div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div className="h-96 bg-muted rounded"></div>
              <div className="flex gap-2">
                {[1, 2, 3].map((_, index) => (
                  <div key={index} className="h-20 w-20 bg-muted rounded"></div>
                ))}
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="h-10 bg-muted rounded w-3/4"></div>
              <div className="h-6 bg-muted rounded w-1/4"></div>
              <div className="h-4 bg-muted rounded w-full my-4"></div>
              <div className="h-4 bg-muted rounded w-full"></div>
              <div className="h-4 bg-muted rounded w-3/4"></div>
              <div className="h-12 bg-muted rounded w-full mt-8"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="container py-12 text-center">
        <h1 className="text-2xl font-bold text-destructive mb-4">{error}</h1>
        <p className="mb-8">The product you're looking for might have been removed or doesn't exist.</p>
        <Link 
          href="/products"
          className="bg-primary text-primary-foreground hover:bg-primary/90 px-6 py-3 rounded-md font-medium"
        >
          Back to Products
        </Link>
      </div>
    );
  }
  
  if (!product) {
    return null;
  }
  
  return (
    <div className="container py-8">
      <button 
        onClick={() => router.back()}
        className="flex items-center gap-1 text-muted-foreground hover:text-foreground mb-8"
      >
        <ChevronLeft className="h-4 w-4" />
        Back to Products
      </button>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Product Images */}
        <div className="space-y-4">
          <div className="relative h-96 bg-muted rounded-lg overflow-hidden">
            {product.image ? (
              <Image
                src={product.image}
                alt={product.name}
                fill
                className="object-contain"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
                No Image Available
              </div>
            )}
          </div>
        </div>
        
        {/* Product Info */}
        <div>
          <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
          
          <div className="flex items-center gap-2 mb-4">
            <Link 
              href={`/products?category=${product.category.id}`}
              className="text-sm bg-muted px-2 py-1 rounded hover:bg-muted/80"
            >
              {product.category.name}
            </Link>
            
            <span className="text-sm text-muted-foreground">
              {product.stock > 0 ? (
                <span className="text-green-600">In Stock ({product.stock} available)</span>
              ) : (
                <span className="text-destructive">Out of Stock</span>
              )}
            </span>
          </div>
          
          <div className="text-2xl font-bold mb-6">${product.price.toFixed(2)}</div>
          
          <div className="prose prose-sm max-w-none mb-8">
            <p>{product.description}</p>
          </div>
          
          {product.stock > 0 && (
            <>
              <div className="flex items-center gap-4 mb-6">
                <label htmlFor="quantity" className="font-medium">
                  Quantity:
                </label>
                <div className="flex items-center">
                  <button 
                    onClick={decrementQuantity}
                    disabled={quantity <= 1}
                    className="p-2 border rounded-l-md bg-muted hover:bg-muted/80 disabled:opacity-50"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <input
                    id="quantity"
                    type="number"
                    min="1"
                    max={product.stock}
                    value={quantity}
                    onChange={(e) => {
                      const val = parseInt(e.target.value);
                      if (!isNaN(val) && val >= 1 && val <= product.stock) {
                        setQuantity(val);
                      }
                    }}
                    className="w-16 text-center border-y h-full bg-background"
                  />
                  <button 
                    onClick={incrementQuantity}
                    disabled={quantity >= product.stock}
                    className="p-2 border rounded-r-md bg-muted hover:bg-muted/80 disabled:opacity-50"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              </div>
              
              <button
                onClick={handleAddToCart}
                disabled={addingToCart || product.stock <= 0}
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 px-6 py-3 rounded-md font-medium flex items-center justify-center gap-2"
              >
                <ShoppingCart className="h-5 w-5" />
                {addingToCart ? 'Adding...' : 'Add to Cart'}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}