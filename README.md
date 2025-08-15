# Credit Dispute Management Platform

A full-stack web application for managing credit profiles and disputes, built with Next.js, NestJS, PostgreSQL, and Redis. Features include JWT authentication, role-based access control, AI-powered dispute letter generation, and comprehensive admin tools.

## 🚀 Features

- **Authentication & Authorization**
  - JWT-based authentication with refresh tokens
  - Role-based access control (User/Admin)
  - Secure password hashing with bcrypt
  - Token regeneration endpoint

- **Credit Profile Management**
  - Mock credit data integration (simulating Array API)
  - Credit score tracking and visualization
  - Credit report item management
  - Real-time data refresh capabilities

- **Dispute Management**
  - Complete dispute lifecycle (pending → submitted → under_review → resolved/rejected)
  - User-friendly dispute creation with common reasons
  - Admin review and approval system
  - Dispute history and status tracking

- **AI Integration**
  - OpenAI-powered dispute letter generation
  - Professional letter templates
  - Mock fallback for development
  - Customizable dispute reasons

- **Admin Dashboard**
  - User management and oversight
  - Dispute statistics and analytics
  - System performance metrics
  - Role-based administrative controls

## 🛠 Tech Stack

### Backend
- **NestJS** (TypeScript) - REST API framework
- **PostgreSQL** - Primary database
- **Redis** - Session storage and caching
- **JWT** - Authentication tokens
- **OpenAI API** - AI letter generation (optional)

### Frontend
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **shadcn/ui** - UI components
- **Axios** - HTTP client

### Infrastructure
- **Docker** - Containerization
- **Docker Compose** - Multi-service orchestration

## 📋 Prerequisites

- Docker and Docker Compose
- Node.js 18+ (for local development)
- Git

## 🚀 Quick Start

### 1. Clone the Repository

\`\`\`bash
git clone <repository-url>
cd credit-dispute-platform
\`\`\`

### 2. Environment Setup

Copy the environment template and configure your variables:

\`\`\`bash
cp .env.example .env
\`\`\`

Edit `.env` with your configuration:

\`\`\`env
# Database Configuration
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/credit_dispute_db

# Redis Configuration
REDIS_URL=redis://localhost:6379

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_REFRESH_SECRET=your-super-secret-refresh-key-change-in-production
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# OpenAI Configuration (optional - leave empty for mock responses)
OPENAI_API_KEY=your-openai-api-key-here

# Application Configuration
NODE_ENV=development
PORT=3001

# Frontend Configuration
NEXT_PUBLIC_API_URL=http://localhost:3001
\`\`\`

### 3. Start with Docker (Recommended)

\`\`\`bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
\`\`\`

The application will be available at:
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001
- **Database**: localhost:5432
- **Redis**: localhost:6379

### 4. Local Development Setup

If you prefer to run services locally:

#### Backend Setup
\`\`\`bash
cd backend
npm install
npm run start:dev
\`\`\`

#### Frontend Setup
\`\`\`bash
cd frontend
npm install
npm run dev
\`\`\`

#### Database Setup
\`\`\`bash
# Start only database services
docker-compose up postgres redis -d

# Run database migrations (if needed)
# The init.sql and seed.sql files will run automatically
\`\`\`

## 👥 Sample User Credentials

The system comes with pre-seeded test accounts:

### User Account
- **Email**: user@example.com
- **Password**: password123
- **Role**: User
- **Features**: Credit profile, disputes, AI assistant

### Admin Account
- **Email**: admin@example.com
- **Password**: password123
- **Role**: Admin
- **Features**: All user features + admin dashboard, user management, dispute review

### Additional Test User
- **Email**: user2@example.com
- **Password**: password123
- **Role**: User

## 🗄️ Database Schema

The application uses PostgreSQL with the following main tables:

- `users` - User accounts and authentication
- `refresh_tokens` - JWT refresh token management
- `credit_profiles` - User credit score and profile data
- `credit_report_items` - Individual credit report entries
- `disputes` - Dispute records and lifecycle
- `dispute_letters` - AI-generated dispute letters

## 🔧 API Endpoints

### Authentication
- `POST /auth/register` - User registration
- `POST /auth/login` - User login
- `POST /auth/refresh` - Refresh access token
- `POST /auth/regenerate-token` - Manual token regeneration
- `POST /auth/logout` - User logout

### Credit Profile
- `GET /credit-profile/:userId` - Get user credit profile
- `GET /credit-profile/:userId/items` - Get credit report items
- `GET /credit-profile/:userId/refresh` - Refresh credit data

### Disputes
- `POST /disputes/create` - Create new dispute
- `GET /disputes/history` - Get dispute history
- `GET /disputes/:id` - Get specific dispute
- `PUT /disputes/:id/status` - Update dispute status (admin)
- `GET /disputes/stats/overview` - Get dispute statistics (admin)

### AI Integration
- `POST /ai/generate-letter` - Generate dispute letter

### Admin
- `GET /users` - Get all users (admin)

## 🎨 Frontend Pages

### Public Pages
- `/` - Landing page with features overview
- `/login` - User authentication
- `/register` - User registration

### User Pages
- `/dashboard` - User dashboard with overview
- `/profile` - Credit profile and report items
- `/disputes` - Dispute history and management
- `/disputes/create` - Create new dispute
- `/ai` - AI dispute letter generator

### Admin Pages
- `/admin` - Admin dashboard
- `/admin/disputes/:id` - Dispute review and management
- `/admin/reports` - System analytics and reports

## 🤖 AI Integration

The platform supports AI-powered dispute letter generation:

### OpenAI Integration
- Set `OPENAI_API_KEY` in your environment
- Uses GPT-3.5-turbo for professional letter generation
- Automatically falls back to mock generation if API fails

### Mock Generation
- Professional template-based letters
- No API key required for development
- Consistent formatting and legal language

## 🐳 Docker Configuration

The application uses multi-service Docker setup:

### Services
- **postgres** - PostgreSQL database with auto-initialization
- **redis** - Redis for session storage
- **backend** - NestJS API server
- **frontend** - Next.js web application

### Volumes
- `postgres_data` - Persistent database storage
- `redis_data` - Persistent Redis storage

### Health Checks
- Database and Redis include health checks
- Backend waits for healthy database connection
- Frontend waits for backend availability

## 🔒 Security Features

- **Password Hashing**: bcrypt with salt rounds
- **JWT Tokens**: Secure access and refresh token system
- **Role-Based Access**: User and admin role separation
- **Input Validation**: Comprehensive request validation
- **CORS Configuration**: Secure cross-origin requests
- **Environment Variables**: Sensitive data protection

## 🧪 Testing

### Sample Data
The application includes comprehensive seed data:
- 3 test users (2 regular users, 1 admin)
- Mock credit profiles with realistic data
- Sample credit report items
- Pre-created disputes for testing

### Mock Credit Provider
- Simulates real credit bureau API responses
- Generates consistent data based on user ID
- Includes various account types and statuses
- Supports data refresh functionality

## 📊 System Architecture

The application follows a modular, scalable architecture:

### Backend Architecture
- **Modular Design**: Feature-based modules (Auth, Users, Credit Profile, Disputes, AI)
- **Service Layer**: Business logic separation
- **Database Layer**: PostgreSQL with connection pooling
- **Caching Layer**: Redis for session management
- **External APIs**: OpenAI integration with fallback

### Frontend Architecture
- **Component-Based**: Reusable UI components
- **Context Management**: Authentication and state management
- **API Integration**: Centralized HTTP client with interceptors
- **Route Protection**: Role-based route guards
- **Responsive Design**: Mobile-first approach

## 🚀 Deployment

### Production Considerations
1. **Environment Variables**: Update all secrets and API keys
2. **Database**: Use managed PostgreSQL service
3. **Redis**: Use managed Redis service
4. **SSL/TLS**: Enable HTTPS for production
5. **Monitoring**: Add application monitoring and logging
6. **Backup**: Implement database backup strategy

### Docker Production
\`\`\`bash
# Build production images
docker-compose -f docker-compose.prod.yml build

# Deploy with production configuration
docker-compose -f docker-compose.prod.yml up -d
\`\`\`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
1. Check the documentation
2. Review the sample data and API endpoints
3. Examine the Docker logs: `docker-compose logs -f`
4. Verify environment variable configuration

## 🔄 Development Workflow

### Adding New Features
1. Create backend API endpoints in appropriate module
2. Add database migrations if needed
3. Implement frontend components and pages
4. Update documentation
5. Test with sample data

### Database Changes
1. Update `init.sql` for schema changes
2. Update `seed.sql` for sample data
3. Restart Docker services to apply changes

### Environment Updates
1. Update `.env.example` with new variables
2. Update documentation
3. Restart services to apply changes
