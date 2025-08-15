FROM node:20-alpine AS base

WORKDIR /app

# Copy package files (only package.json since this is a monorepo)
COPY package.json ./

# Install dependencies directly (npm will resolve from parent workspace)
RUN npm install

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Production stage
FROM node:20-alpine AS production

WORKDIR /app

# Copy package.json
COPY package.json ./

# Install only production dependencies
RUN npm install --only=production

# Copy built application
COPY --from=base /app/.next ./.next
COPY --from=base /app/public ./public

# Expose port
EXPOSE 3000

# Start the application
CMD ["npm", "start"]