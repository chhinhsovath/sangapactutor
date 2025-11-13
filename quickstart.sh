#!/bin/bash

echo "🚀 SA Jobs - Quick Start Script"
echo "================================"
echo ""

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "⚠️  Docker is not running. Please start Docker first."
    exit 1
fi

echo "✅ Docker is running"
echo ""

# Start PostgreSQL
echo "📦 Starting PostgreSQL with Docker Compose..."
docker-compose up -d

# Wait for PostgreSQL to be ready
echo "⏳ Waiting for PostgreSQL to be ready..."
sleep 5

# Check if PostgreSQL is ready
until docker exec sajobs-postgres pg_isready -U user > /dev/null 2>&1; do
    echo "   Still waiting for PostgreSQL..."
    sleep 2
done

echo "✅ PostgreSQL is ready"
echo ""

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📥 Installing npm dependencies..."
    npm install
    echo "✅ Dependencies installed"
    echo ""
fi

# Generate and run migrations
echo "🔄 Generating database migrations..."
npm run db:generate

echo ""
echo "🔄 Running database migrations..."
npm run db:migrate

echo ""
echo "🌱 Seeding database with sample data..."
npm run db:seed

echo ""
echo "✨ Setup complete!"
echo ""
echo "🎯 Next steps:"
echo "   1. Run 'npm run dev' to start the development server"
echo "   2. Open http://localhost:3000 in your browser"
echo "   3. Run 'npm run db:studio' to manage database with Drizzle Studio"
echo ""
echo "📚 For more information, see README.md and SETUP.md"
