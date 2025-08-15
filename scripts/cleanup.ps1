# Credit Dispute Management Platform Cleanup Script (PowerShell)

Write-Host "🧹 Cleaning up Credit Dispute Management Platform..." -ForegroundColor Yellow

# Stop and remove containers
Write-Host "🛑 Stopping and removing containers..." -ForegroundColor Yellow
docker compose down

# Remove volumes (optional - uncomment to remove data)
# Write-Host "🗑️  Removing volumes..." -ForegroundColor Red
# docker compose down -v

# Remove images (optional - uncomment to remove images)
# Write-Host "🗑️  Removing images..." -ForegroundColor Red
# docker compose down --rmi all

# Clean up Docker system
Write-Host "🧽 Cleaning up Docker system..." -ForegroundColor Yellow
docker system prune -f

# Remove environment files (optional - uncomment to remove)
# Write-Host "🗑️  Removing environment files..." -ForegroundColor Red
# Remove-Item -Path "backend/.env.development" -Force -ErrorAction SilentlyContinue
# Remove-Item -Path "frontend/.env.development" -Force -ErrorAction SilentlyContinue

Write-Host "✅ Cleanup complete!" -ForegroundColor Green
Write-Host ""
Write-Host "💡 To completely reset the project:" -ForegroundColor Cyan
Write-Host "   - Uncomment the volume removal line above to delete database data" -ForegroundColor White
Write-Host "   - Uncomment the image removal line above to delete all images" -ForegroundColor White
Write-Host "   - Uncomment the environment file removal to start fresh" -ForegroundColor White
Write-Host ""
Write-Host "🔄 To restart the project:" -ForegroundColor Cyan
Write-Host "   .\scripts\setup.ps1" -ForegroundColor White
Write-Host ""

