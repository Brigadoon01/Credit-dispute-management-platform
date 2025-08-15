#!/bin/bash

# Credit Dispute Management Platform Cleanup Script

echo "🧹 Cleaning up Credit Dispute Management Platform..."

# Stop and remove containers
echo "🛑 Stopping and removing containers..."
docker compose down

# Remove volumes (optional - uncomment to remove data)
# echo "🗑️  Removing volumes..."
# docker compose down -v

# Remove images (optional - uncomment to remove images)
# echo "🗑️  Removing images..."
# docker compose down --rmi all

# Clean up Docker system
echo "🧽 Cleaning up Docker system..."
docker system prune -f

# Remove environment files (optional - uncomment to remove)
# echo "🗑️  Removing environment files..."
# rm -f backend/.env.development
# rm -f frontend/.env.development

echo "✅ Cleanup complete!"
echo ""
echo "💡 To completely reset the project:"
echo "   - Uncomment the volume removal line above to delete database data"
echo "   - Uncomment the image removal line above to delete all images"
echo "   - Uncomment the environment file removal to start fresh"
echo ""
echo "🔄 To restart the project:"
echo "   ./scripts/setup.sh"
