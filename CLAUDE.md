# NextJS E-Commerce - Quick Start Guide

## How to Run the Application

1. **Development Mode**:
   ```bash
   npm run dev
   ```

2. **Reset Database with Test Data**:
   ```bash
   ./seed-db.sh
   ```

## Test Accounts

- **Admin User**: 
  - Email: admin@example.com
  - Password: admin123

- **Regular User**:
  - Email: user@example.com
  - Password: user123

## Development Commands

- **Generate Prisma Client**:
  ```bash
  npm run prisma:generate
  ```

- **Run Database Migrations**:
  ```bash
  npm run prisma:migrate
  ```

- **Seed Database**:
  ```bash
  npm run seed
  ```

- **Build for Production**:
  ```bash
  npm run build
  ```

- **Start Production Server**:
  ```bash
  npm run start
  ```

## Docker Commands

- **Build and Start with Docker**:
  ```bash
  docker-compose up --build
  ```

- **Stop Docker Containers**:
  ```bash
  docker-compose down
  ```