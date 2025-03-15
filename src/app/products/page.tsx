"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Search, Filter, ShoppingCart } from "lucide-react";

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

interface Category {
  id: string;
  name: string;
}

export default function ProductsPage() {
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get("category");
  const searchQuery = searchParams.get("search");

  const [products, setProducts] = useState<Product[]>([]);
  console.log(products);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedCategory, setSelectedCategory] = useState<string>(
    categoryParam || ""
  );
  const [searchTerm, setSearchTerm] = useState<string>(searchQuery || "");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    async function fetchCategories() {
      try {
        const response = await fetch("/api/categories");
        if (!response.ok) throw new Error("Failed to fetch categories");
        const data = await response.json();
        setCategories(data);
      } catch (err) {
        console.error("Error fetching categories:", err);
        setError("Failed to load categories. Please try again later.");
      }
    }

    fetchCategories();
  }, []);

  useEffect(() => {
    async function fetchProducts() {
      setLoading(true);
      setError(null);

      try {
        const queryParams = new URLSearchParams();
        queryParams.append("page", currentPage.toString());
        queryParams.append("limit", "8");

        if (selectedCategory) {
          queryParams.append("category", selectedCategory);
        }

        if (searchTerm) {
          queryParams.append("search", searchTerm);
        }

        const response = await fetch(`/api/products?${queryParams.toString()}`);

        if (!response.ok) throw new Error("Failed to fetch products");

        const data = await response.json();
        setProducts(data.products);
        setTotalPages(data.pagination.totalPages);
      } catch (err) {
        console.error("Error fetching products:", err);
        setError("Failed to load products. Please try again later.");
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, [currentPage, selectedCategory, searchTerm]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1); // Reset to first page when searching
  };

  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setCurrentPage(1); // Reset to first page when changing category
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-8">Products</h1>

      {/* Search and Filter Bar */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <form onSubmit={handleSearch} className="flex-1">
          <div className="relative">
            <input
              type="text"
              placeholder="Search products..."
              className="w-full px-4 py-2 rounded-md border bg-background"
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
        </form>

        <button
          className="md:hidden flex items-center gap-2 px-4 py-2 rounded-md border bg-background"
          onClick={() => setShowFilters(!showFilters)}
        >
          <Filter className="h-4 w-4" />
          <span>Filters</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Filters - Desktop */}
        <div className="hidden md:block space-y-6">
          <div>
            <h3 className="font-medium mb-4">Categories</h3>
            <div className="space-y-2">
              <div className="flex items-center">
                <input
                  type="radio"
                  id="all-categories"
                  name="category"
                  className="mr-2"
                  checked={selectedCategory === ""}
                  onChange={() => handleCategoryChange("")}
                />
                <label htmlFor="all-categories">All Categories</label>
              </div>

              {categories.map((category) => (
                <div key={category.id} className="flex items-center">
                  <input
                    type="radio"
                    id={category.id}
                    name="category"
                    className="mr-2"
                    checked={selectedCategory === category.id}
                    onChange={() => handleCategoryChange(category.id)}
                  />
                  <label htmlFor={category.id}>{category.name}</label>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Filters - Mobile */}
        {showFilters && (
          <div className="md:hidden space-y-6 bg-card p-4 rounded-md border mb-6">
            <div>
              <h3 className="font-medium mb-4">Categories</h3>
              <div className="space-y-2">
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="all-categories-mobile"
                    name="category-mobile"
                    className="mr-2"
                    checked={selectedCategory === ""}
                    onChange={() => handleCategoryChange("")}
                  />
                  <label htmlFor="all-categories-mobile">All Categories</label>
                </div>

                {categories.map((category) => (
                  <div key={category.id} className="flex items-center">
                    <input
                      type="radio"
                      id={`${category.id}-mobile`}
                      name="category-mobile"
                      className="mr-2"
                      checked={selectedCategory === category.id}
                      onChange={() => handleCategoryChange(category.id)}
                    />
                    <label htmlFor={`${category.id}-mobile`}>
                      {category.name}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Product Grid */}
        <div className="md:col-span-3">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((item) => (
                <div
                  key={item}
                  className="bg-card animate-pulse rounded-lg overflow-hidden border h-80"
                >
                  <div className="h-48 bg-muted"></div>
                  <div className="p-4">
                    <div className="h-4 bg-muted rounded mb-2 w-3/4"></div>
                    <div className="h-3 bg-muted rounded mb-2 w-1/2"></div>
                    <div className="h-4 bg-muted rounded mt-4 w-1/4"></div>
                  </div>
                </div>
              ))}
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
            <div className="text-center py-12">
              <p className="text-xl">No products found.</p>
              <p className="text-muted-foreground mt-2">
                Try changing your search or filter criteria.
              </p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
                  <div
                    key={product.id}
                    className="bg-card rounded-lg overflow-hidden border shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div className="h-48 bg-muted relative">
                      {product.image ? (
                        <Image
                          src={product.image}
                          alt={product.name}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
                          No Image
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold mb-2">{product.name}</h3>
                      <p className="text-muted-foreground text-sm mb-2 line-clamp-2">
                        {product.description}
                      </p>
                      <div className="flex items-center justify-between mt-4">
                        <span className="font-bold">
                          ${product.price.toFixed(2)}
                        </span>
                        <div className="flex gap-2">
                          <button
                            className="bg-primary/10 hover:bg-primary/20 text-primary p-1.5 rounded"
                            title="Add to cart"
                          >
                            <ShoppingCart className="h-4 w-4" />
                          </button>
                          <Link
                            href={`/products/${product.id}`}
                            className="text-primary text-sm font-medium hover:underline"
                          >
                            View Details
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-4 mt-8">
                  <button
                    onClick={handlePreviousPage}
                    disabled={currentPage === 1}
                    className="px-4 py-2 rounded-md border bg-background disabled:opacity-50"
                  >
                    Previous
                  </button>
                  <span>
                    Page {currentPage} of {totalPages}
                  </span>
                  <button
                    onClick={handleNextPage}
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
      </div>
    </div>
  );
}
