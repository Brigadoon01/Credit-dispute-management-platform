FROM node:18-alpine AS base

WORKDIR /app

# Install pnpm
RUN npm install -g pnpm

# Copy package files
COPY package.json ./

# Install dependencies
RUN pnpm install --no-frozen-lockfile

# Copy source code
COPY . .

# Build the application
RUN pnpm build

# Production stage
FROM node:18-alpine AS production

WORKDIR /app

# Install pnpm
RUN npm install -g pnpm

# Copy package files
COPY package.json ./

# Install only production dependencies
RUN pnpm install --prod --no-frozen-lockfile

# Copy built application
COPY --from=base /app/dist ./dist

# Expose port
EXPOSE 3001

# Start the application
CMD ["pnpm", "run", "start:prod"]