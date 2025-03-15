# NextJS E-Commerce

A complete, production-ready e-commerce platform built with Next.js, TypeScript, Prisma, Tailwind CSS, and shadcn/ui. Includes Razorpay payment integration.

## Features

- 🛍️ Full-featured e-commerce functionality
- 🔐 User authentication and authorization
- 💳 Secure payment processing with Razorpay
- 📱 Responsive design for all devices
- 🎨 Modern UI with Tailwind CSS and shadcn/ui
- 🔍 Product search and filtering
- 🛒 Shopping cart functionality
- 👥 User account management
- 📊 Admin dashboard
- 🚚 Order management and tracking
- 🗄️ PostgreSQL database with Prisma ORM

## Tech Stack

- **Frontend**: Next.js, React, TypeScript, Tailwind CSS, shadcn/ui
- **Backend**: Next.js API Routes, Prisma ORM
- **Database**: PostgreSQL
- **Authentication**: JWT-based auth with HTTP-only cookies
- **Payment**: Razorpay integration
- **Deployment**: Docker containerization

## Getting Started

### Prerequisites

- Node.js (v18 or later)
- PostgreSQL database
- Razorpay account for payment processing

### Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/nextjsecommerce.git
cd nextjsecommerce
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file in the root directory with the following variables:

```
DATABASE_URL="postgresql://username:password@localhost:5432/ecommerce?schema=public"
JWT_SECRET="your-secret-key-change-in-production"
NEXT_PUBLIC_RAZORPAY_KEY_ID="your-razorpay-key-id"
RAZORPAY_KEY_SECRET="your-razorpay-key-secret"
```

4. Set up the database:

```bash
# Create database tables
npx prisma migrate dev --name init

# Generate Prisma client
npx prisma generate

# Seed the database (optional)
npx prisma db seed
```

5. Start the development server:

```bash
npm run dev
```

Visit `http://localhost:3000` to view the application.

### Docker Deployment

To build and run the application using Docker:

```bash
# Build the Docker image
docker-compose build

# Start the containers
docker-compose up -d
```

The application will be available at `http://localhost:3000`.

## Project Structure

```
nextjsecommerce/
├── prisma/            # Prisma schema and migrations
├── public/            # Static assets
├── src/
│   ├── app/           # Next.js App Router
│   │   ├── api/       # API routes
│   │   ├── admin/     # Admin pages
│   │   ├── products/  # Product pages
│   │   └── ...        # Other pages
│   ├── components/    # React components
│   │   ├── ui/        # UI components from shadcn/ui
│   │   └── ...        # Custom components
│   ├── contexts/      # React contexts
│   ├── lib/           # Utility functions
│   └── ...
├── .env               # Environment variables
├── .gitignore
├── docker-compose.yml # Docker Compose configuration
├── Dockerfile         # Docker configuration
├── next.config.ts     # Next.js configuration
├── package.json
├── tailwind.config.ts # Tailwind CSS configuration
└── tsconfig.json      # TypeScript configuration
```

## API Routes

- `/api/register` - User registration
- `/api/login` - User login
- `/api/logout` - User logout
- `/api/me` - Get current user
- `/api/products` - Product listing and filtering
- `/api/products/[id]` - Get product details
- `/api/categories` - Get product categories
- `/api/payment/create-order` - Create Razorpay payment order
- `/api/payment/verify` - Verify Razorpay payment

## Database Schema

The database schema includes the following models:

- User
- Product
- Category
- Order
- OrderItem

For detailed schema, refer to the `prisma/schema.prisma` file.

## License

This project is licensed under the MIT License.

## Acknowledgments

- [Next.js](https://nextjs.org/)
- [Prisma](https://www.prisma.io/)
- [Tailwind CSS](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/)
- [Razorpay](https://razorpay.com/)
# nextecom
