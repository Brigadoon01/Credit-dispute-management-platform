# Credit Dispute Management Platform Setup Script (PowerShell)

Write-Host "🚀 Setting up Credit Dispute Management Platform..." -ForegroundColor Green

# Check if Docker is installed
try {
    $dockerVersion = docker --version
    Write-Host "✅ Docker found: $dockerVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Docker is not installed. Please install Docker Desktop first." -ForegroundColor Red
    exit 1
}

# Check if Docker Compose is available
try {
    $composeVersion = docker compose version
    Write-Host "✅ Docker Compose available" -ForegroundColor Green
} catch {
    Write-Host "❌ Docker Compose is not available. Please ensure Docker Desktop is running." -ForegroundColor Red
    exit 1
}

# Create necessary directories
Write-Host "📁 Creating necessary directories..." -ForegroundColor Yellow
New-Item -ItemType Directory -Force -Path "logs" | Out-Null
New-Item -ItemType Directory -Force -Path "ssl" | Out-Null

# Create environment files if they don't exist
Write-Host "📝 Creating environment files..." -ForegroundColor Yellow

# Backend environment
if (-not (Test-Path "backend/.env.development")) {
    Write-Host "Creating backend/.env.development..." -ForegroundColor Yellow
    @"
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
"@ | Out-File -FilePath "backend/.env.development" -Encoding UTF8
    Write-Host "✅ backend/.env.development created" -ForegroundColor Green
} else {
    Write-Host "✅ backend/.env.development already exists" -ForegroundColor Green
}

# Frontend environment
if (-not (Test-Path "frontend/.env.development")) {
    Write-Host "Creating frontend/.env.development..." -ForegroundColor Yellow
    @"
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:3001

# Next.js Configuration
NEXT_PUBLIC_APP_NAME=Credit Dispute Platform
"@ | Out-File -FilePath "frontend/.env.development" -Encoding UTF8
    Write-Host "✅ frontend/.env.development created" -ForegroundColor Green
} else {
    Write-Host "✅ frontend/.env.development already exists" -ForegroundColor Green
}

# Pull required Docker images
Write-Host "🐳 Pulling Docker images..." -ForegroundColor Yellow
docker compose pull

# Build and start services
Write-Host "🔨 Building and starting services..." -ForegroundColor Yellow
docker compose up -d --build

# Wait for services to be ready
Write-Host "⏳ Waiting for services to be ready..." -ForegroundColor Yellow
Start-Sleep -Seconds 45

# Check service health
Write-Host "🔍 Checking service health..." -ForegroundColor Yellow
docker compose ps

# Display access information
Write-Host ""
Write-Host "🎉 Setup complete!" -ForegroundColor Green
Write-Host ""
Write-Host "📱 Application URLs:" -ForegroundColor Cyan
Write-Host "   Frontend: http://localhost:3000" -ForegroundColor White
Write-Host "   Backend API: http://localhost:3001" -ForegroundColor White
Write-Host "   Database: localhost:5432" -ForegroundColor White
Write-Host "   Redis: localhost:6379" -ForegroundColor White
Write-Host ""
Write-Host "👥 Sample Accounts (from seed data):" -ForegroundColor Cyan
Write-Host "   User: user@example.com / password123" -ForegroundColor White
Write-Host "   Admin: admin@example.com / password123" -ForegroundColor White
Write-Host ""
Write-Host "🔧 Useful Commands:" -ForegroundColor Cyan
Write-Host "   View logs: docker compose logs -f" -ForegroundColor White
Write-Host "   View specific service logs: docker compose logs -f frontend" -ForegroundColor White
Write-Host "   Stop services: docker compose down" -ForegroundColor White
Write-Host "   Restart services: docker compose restart" -ForegroundColor White
Write-Host "   Rebuild and restart: docker compose up -d --build" -ForegroundColor White
Write-Host ""
Write-Host "📚 Documentation:" -ForegroundColor Cyan
Write-Host "   README.md - Setup and usage instructions" -ForegroundColor White
Write-Host "   SYSTEM_DESIGN.md - Technical architecture" -ForegroundColor White
Write-Host ""
Write-Host "⚠️  Important Notes:" -ForegroundColor Yellow
Write-Host "   - The first build may take several minutes" -ForegroundColor White
Write-Host "   - Ensure Docker Desktop has enough resources (4GB+ RAM recommended)" -ForegroundColor White
Write-Host "   - Check logs if services fail to start: docker compose logs" -ForegroundColor White
Write-Host ""

