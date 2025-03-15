import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import { z } from 'zod';

// Schema for product validation
const productSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  description: z.string().min(5, 'Description must be at least 5 characters'),
  price: z.number().positive('Price must be a positive number'),
  image: z.string().url('Please provide a valid image URL'),
  categoryId: z.string().min(1, 'Category is required'),
  stock: z.number().int().nonnegative('Stock must be a non-negative integer'),
});

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Pagination parameters
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const skip = (page - 1) * limit;
    
    // Filter parameters
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    
    // Build where clause for filtering
    const where: any = {};
    
    if (category) {
      where.categoryId = category;
    }
    
    if (search) {
      where.OR = [
        { name: { contains: search } },
        { description: { contains: search } },
      ];
    }
    
    // Get products with pagination
    const products = await prisma.product.findMany({
      where,
      skip,
      take: limit,
      include: {
        category: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    
    // Get total count for pagination
    const totalProducts = await prisma.product.count({ where });
    const totalPages = Math.ceil(totalProducts / limit);
    
    return NextResponse.json({
      products,
      pagination: {
        page,
        limit,
        totalProducts,
        totalPages,
      },
    });
  } catch (error) {
    console.error('Get products error:', error);
    return NextResponse.json(
      { error: 'Failed to get products' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Verify user is admin
    const user = await getCurrentUser();
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const body = await request.json();
    
    // Validate request body
    try {
      productSchema.parse(body);
    } catch (err) {
      if (err instanceof z.ZodError) {
        const errors = err.errors.map(e => `${e.path.join('.')}: ${e.message}`).join(', ');
        return NextResponse.json(
          { error: `Validation failed: ${errors}` },
          { status: 400 }
        );
      }
      throw err;
    }
    
    // Check if category exists
    const category = await prisma.category.findUnique({
      where: { id: body.categoryId },
    });
    
    if (!category) {
      return NextResponse.json(
        { error: 'Category not found' },
        { status: 400 }
      );
    }
    
    // Check if product with same name already exists
    const existingProduct = await prisma.product.findUnique({
      where: { name: body.name },
    });
    
    if (existingProduct) {
      return NextResponse.json(
        { error: 'Product with this name already exists' },
        { status: 400 }
      );
    }
    
    // Create product
    const product = await prisma.product.create({
      data: {
        name: body.name,
        description: body.description,
        price: body.price,
        image: body.image,
        categoryId: body.categoryId,
        stock: body.stock,
      },
      include: {
        category: true,
      },
    });
    
    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error('Create product error:', error);
    return NextResponse.json(
      { error: 'Failed to create product' },
      { status: 500 }
    );
  }
}