#!/bin/bash
echo "Resetting database..."
npx prisma migrate reset --force
echo "Database reset completed."

echo "Done! The database has been seeded with test data."
echo ""
echo "Login credentials:"
echo "Admin: admin@example.com / admin123"
echo "User:  user@example.com / user123"