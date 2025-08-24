#!/usr/bin/env pwsh

Write-Host "� Grocademy API Docker Setup Script" -ForegroundColor Green
Write-Host "===================================" -ForegroundColor Green
Write-Host ""

# Check if .env file exists
if (-not (Test-Path ".env")) {
    Write-Host "❌ Error: .env file not found!" -ForegroundColor Red
    Write-Host "Please create a .env file first. See README for details." -ForegroundColor Yellow
    exit 1
}

Write-Host "🔧 Setting up development environment..." -ForegroundColor Cyan

# Step 1: Stop any existing containers
Write-Host "📦 Stopping existing containers..." -ForegroundColor Yellow
docker compose down -v 2>$null
if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Existing containers stopped" -ForegroundColor Green
}

# Step 2: Build and start services
Write-Host "🏗️  Building and starting services..." -ForegroundColor Yellow
docker compose up --build -d
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to start services" -ForegroundColor Red
    exit 1
}

# Step 3: Wait for database to be ready
Write-Host "⏳ Waiting for database to be ready..." -ForegroundColor Yellow
$maxAttempts = 30
$attempt = 0

do {
    $attempt++
    Start-Sleep -Seconds 2
    $dbReady = docker compose exec -T db pg_isready -U grocademy -d grocademy_db
    if ($dbReady -match "accepting connections") {
        Write-Host "✅ Database is ready!" -ForegroundColor Green
        break
    }
    Write-Host "⏳ Attempt $attempt/$maxAttempts - Database not ready yet..." -ForegroundColor Yellow
} while ($attempt -lt $maxAttempts)

if ($attempt -eq $maxAttempts) {
    Write-Host "❌ Database failed to start within expected time" -ForegroundColor Red
    Write-Host "🔍 Checking logs..." -ForegroundColor Yellow
    docker compose logs db
    exit 1
}

# Step 4: Check migration and seeding status
Write-Host "🔄 Checking database setup..." -ForegroundColor Yellow
Start-Sleep -Seconds 3

$migrateStatus = docker compose ps db-migrate --format "{{.State}}"
if ($migrateStatus -eq "exited") {
    Write-Host "✅ Database migration and seeding completed!" -ForegroundColor Green
} else {
    Write-Host "⏳ Migration and seeding in progress..." -ForegroundColor Yellow
    Write-Host "📋 Showing migration logs:" -ForegroundColor Cyan
    docker compose logs -f db-migrate
}

# Step 5: Check if app is running
Write-Host "� Checking application status..." -ForegroundColor Yellow
Start-Sleep -Seconds 5

$appStatus = docker compose ps app --format "{{.State}}"
if ($appStatus -eq "running") {
    Write-Host "🎉 SUCCESS! Application is running!" -ForegroundColor Green
    Write-Host ""
    Write-Host "📋 Environment Summary:" -ForegroundColor Cyan
    Write-Host "======================" -ForegroundColor Cyan
    Write-Host "🌐 API URL:          http://localhost:3000" -ForegroundColor White
    Write-Host "    Alternative:     http://127.0.0.1:3000" -ForegroundColor White
    Write-Host "📚 API Docs:         http://localhost:3000/api" -ForegroundColor White
    Write-Host "🗄️  Database:        PostgreSQL on port 5432" -ForegroundColor White
    Write-Host ""
    Write-Host "🔑 Test Credentials:" -ForegroundColor Cyan
    Write-Host "===================" -ForegroundColor Cyan
    Write-Host "� Admin:   admin@grocademy.com / admin123" -ForegroundColor White
    Write-Host "👤 User:    john.doe@email.com / password123" -ForegroundColor White
    Write-Host ""
    Write-Host "🛠️  Useful Commands:" -ForegroundColor Cyan
    Write-Host "===================" -ForegroundColor Cyan
    Write-Host "📋 View logs:        docker compose logs -f" -ForegroundColor White
    Write-Host "🔄 Restart:          docker compose restart" -ForegroundColor White
    Write-Host "🛑 Stop:             docker compose down" -ForegroundColor White
    Write-Host "🗑️  Clean reset:      docker compose down -v" -ForegroundColor White
    Write-Host ""
} else {
    Write-Host "⚠️  Application might still be starting..." -ForegroundColor Yellow
    Write-Host "📋 Showing application logs:" -ForegroundColor Cyan
    docker compose logs -f app
}

Write-Host "✨ Setup script completed!" -ForegroundColor Green
