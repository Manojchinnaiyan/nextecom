import { PrismaClient } from '@prisma/client';
import { hash } from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Create admin user
  const adminPassword = await hash('admin123', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      name: 'Admin User',
      password: adminPassword,
      role: 'ADMIN',
    },
  });
  console.log('Admin user created:', admin.email);

  // Create regular user
  const userPassword = await hash('user123', 10);
  const user = await prisma.user.upsert({
    where: { email: 'user@example.com' },
    update: {},
    create: {
      email: 'user@example.com',
      name: 'Regular User',
      password: userPassword,
      role: 'USER',
    },
  });
  console.log('Regular user created:', user.email);

  // Create categories
  const categories = [
    { name: 'Electronics' },
    { name: 'Clothing' },
    { name: 'Home Decor' },
  ];

  for (const category of categories) {
    await prisma.category.upsert({
      where: { name: category.name },
      update: {},
      create: {
        name: category.name,
      },
    });
  }
  console.log('Categories created');

  // Find created categories
  const createdCategories = await prisma.category.findMany();
  const categoryMap = new Map(
    createdCategories.map((category) => [category.name, category.id])
  );

  // Create products
  const products = [
    {
      name: 'Smartphone X',
      description: 'A high-end smartphone with the latest features.',
      price: 999.99,
      image: 'https://via.placeholder.com/500?text=Smartphone+X',
      categoryName: 'Electronics',
      stock: 50,
    },
    {
      name: 'Laptop Pro',
      description: 'Powerful laptop for professional work and gaming.',
      price: 1499.99,
      image: 'https://via.placeholder.com/500?text=Laptop+Pro',
      categoryName: 'Electronics',
      stock: 30,
    },
    {
      name: 'Wireless Earbuds',
      description: 'Premium sound quality with noise cancellation.',
      price: 199.99,
      image: 'https://via.placeholder.com/500?text=Wireless+Earbuds',
      categoryName: 'Electronics',
      stock: 100,
    },
    {
      name: 'Men\'s T-Shirt',
      description: 'Comfortable cotton t-shirt for everyday wear.',
      price: 29.99,
      image: 'https://via.placeholder.com/500?text=Men+T-Shirt',
      categoryName: 'Clothing',
      stock: 200,
    },
    {
      name: 'Women\'s Blouse',
      description: 'Elegant blouse for formal occasions.',
      price: 49.99,
      image: 'https://via.placeholder.com/500?text=Women+Blouse',
      categoryName: 'Clothing',
      stock: 150,
    },
    {
      name: 'Decorative Vase',
      description: 'Beautiful vase to enhance your home decor.',
      price: 79.99,
      image: 'https://via.placeholder.com/500?text=Decorative+Vase',
      categoryName: 'Home Decor',
      stock: 40,
    },
    {
      name: 'Wall Art',
      description: 'Modern wall art piece for living rooms.',
      price: 129.99,
      image: 'https://via.placeholder.com/500?text=Wall+Art',
      categoryName: 'Home Decor',
      stock: 25,
    },
    {
      name: 'Smart Watch',
      description: 'Track your health and stay connected.',
      price: 299.99,
      image: 'https://via.placeholder.com/500?text=Smart+Watch',
      categoryName: 'Electronics',
      stock: 75,
    },
  ];

  for (const product of products) {
    const categoryId = categoryMap.get(product.categoryName);
    if (!categoryId) continue;

    await prisma.product.upsert({
      where: { name: product.name },
      update: {},
      create: {
        name: product.name,
        description: product.description,
        price: product.price,
        image: product.image,
        stock: product.stock,
        categoryId,
      },
    });
  }
  console.log('Products created');

  console.log('Seeding completed!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });