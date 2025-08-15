#!/bin/bash

# Credit Dispute Management Platform Setup Script

echo "🚀 Setting up Credit Dispute Management Platform..."

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first."
    exit 1
fi

# Check if Docker Compose is available
if ! docker compose version &> /dev/null; then
    echo "❌ Docker Compose is not available. Please ensure Docker Desktop is running."
    exit 1
fi

# Create necessary directories
echo "📁 Creating necessary directories..."
mkdir -p logs
mkdir -p ssl

# Create environment files if they don't exist
echo "📝 Creating environment files..."

# Backend environment
if [ ! -f backend/.env.development ]; then
    echo "Creating backend/.env.development..."
    cat > backend/.env.development << EOF
# Database Configuration
DATABASE_URL=postgresql://postgres:postgres@postgres:5432/credit_dispute_db

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRES_IN=15m

# OpenAI Configuration (optional)
OPENAI_API_KEY=

# Server Configuration
PORT=3001
FRONTEND_URL=http://localhost:3000
EOF
    echo "✅ backend/.env.development created"
else
    echo "✅ backend/.env.development already exists"
fi

# Frontend environment
if [ ! -f frontend/.env.development ]; then
    echo "Creating frontend/.env.development..."
    cat > frontend/.env.development << EOF
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:3001

# Next.js Configuration
NEXT_PUBLIC_APP_NAME=Credit Dispute Platform
EOF
    echo "✅ frontend/.env.development created"
else
    echo "✅ frontend/.env.development already exists"
fi

# Pull required Docker images
echo "🐳 Pulling Docker images..."
docker compose pull

# Build and start services
echo "🔨 Building and starting services..."
docker compose up -d --build

# Wait for services to be ready
echo "⏳ Waiting for services to be ready..."
sleep 45

# Check service health
echo "🔍 Checking service health..."
docker compose ps

# Display access information
echo ""
echo "🎉 Setup complete!"
echo ""
echo "📱 Application URLs:"
echo "   Frontend: http://localhost:3000"
echo "   Backend API: http://localhost:3001"
echo "   Database: localhost:5432"
echo "   Redis: localhost:6379"
echo ""
echo "👥 Sample Accounts (from seed data):"
echo "   User: user@example.com / password123"
echo "   Admin: admin@example.com / password123"
echo ""
echo "🔧 Useful Commands:"
echo "   View logs: docker compose logs -f"
echo "   View specific service logs: docker compose logs -f frontend"
echo "   Stop services: docker compose down"
echo "   Restart services: docker compose restart"
echo "   Rebuild and restart: docker compose up -d --build"
echo ""
echo "📚 Documentation:"
echo "   README.md - Setup and usage instructions"
echo "   SYSTEM_DESIGN.md - Technical architecture"
echo ""
echo "⚠️  Important Notes:"
echo "   - The first build may take several minutes"
echo "   - Ensure Docker Desktop has enough resources (4GB+ RAM recommended)"
echo "   - Check logs if services fail to start: docker compose logs"
echo ""
