#!/bin/bash
echo "🔄 Starting database setup..."

# Start database first
echo "📦 Starting PostgreSQL database..."
docker-compose up -d db

# Wait for database to be ready
echo "⏳ Waiting for database to be ready..."
sleep 10

# Run migrations using Docker container
echo "🔄 Running database migrations..."
docker-compose run --rm app npx prisma migrate deploy

# Run seeding using Docker container
echo "🌱 Seeding database..."
docker-compose run --rm app npx prisma db seed

echo "✅ Database setup completed!"
echo "🚀 Starting application..."

# Start the full application
docker-compose up app
