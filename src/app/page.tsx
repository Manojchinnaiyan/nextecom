import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="py-20 px-4 text-center bg-gradient-to-b from-background to-muted">
        <div className="container mx-auto max-w-4xl">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
            Modern E-Commerce for the Digital Age
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Shop the latest products with our easy-to-use platform. Fast shipping, secure payments, and exceptional customer service.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/products" 
              className="bg-primary text-primary-foreground hover:bg-primary/90 px-6 py-3 rounded-md font-medium flex items-center justify-center gap-2"
            >
              Browse Products
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link 
              href="/register" 
              className="bg-background hover:bg-muted border border-input px-6 py-3 rounded-md font-medium"
            >
              Create Account
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Featured Categories</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {['Electronics', 'Clothing', 'Home Decor'].map((category) => (
              <div key={category} className="bg-card border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                <div className="h-48 bg-muted relative">
                  {/* Placeholder for category image */}
                  <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
                    Image Placeholder
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2">{category}</h3>
                  <p className="text-muted-foreground mb-4">Explore our collection of {category.toLowerCase()}.</p>
                  <Link href={`/products?category=${category.toLowerCase()}`} className="text-primary font-medium flex items-center gap-2">
                    View Products
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 px-4 bg-muted">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Featured Products</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((product) => (
              <div key={product} className="bg-card rounded-lg overflow-hidden border shadow-sm hover:shadow-md transition-shadow">
                <div className="h-48 bg-background relative">
                  {/* Placeholder for product image */}
                  <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
                    Product Image
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold mb-2">Product {product}</h3>
                  <p className="text-muted-foreground text-sm mb-2">
                    A short description of the product goes here.
                  </p>
                  <div className="flex items-center justify-between mt-4">
                    <span className="font-bold">$99.99</span>
                    <Link 
                      href={`/products/${product}`}
                      className="text-primary text-sm font-medium"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-10 text-center">
            <Link 
              href="/products" 
              className="bg-primary text-primary-foreground hover:bg-primary/90 px-6 py-3 rounded-md font-medium inline-flex items-center gap-2"
            >
              View All Products
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose Us</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { title: 'Fast Shipping', description: 'Get your products delivered quickly and reliably to your doorstep.' },
              { title: 'Secure Payments', description: 'Shop with confidence with our secure payment processing systems.' },
              { title: 'Quality Products', description: 'We source only the best products from trusted manufacturers.' },
            ].map((feature, index) => (
              <div key={index} className="text-center p-6">
                <div className="w-12 h-12 bg-primary/10 rounded-full mx-auto flex items-center justify-center mb-4">
                  {/* Icon placeholder */}
                  <span className="text-primary font-bold">{index + 1}</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-16 px-4 bg-muted">
        <div className="container mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold mb-4">Subscribe to Our Newsletter</h2>
          <p className="text-muted-foreground mb-6">
            Stay updated with the latest products, exclusive offers, and discounts.
          </p>
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-md border bg-background"
            />
            <button className="bg-primary text-primary-foreground hover:bg-primary/90 px-6 py-3 rounded-md font-medium">
              Subscribe
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
