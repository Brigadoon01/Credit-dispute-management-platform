# Credit Dispute Management Platform - System Design

## Overview

The Credit Dispute Management Platform is a full-stack web application designed to help users manage their credit profiles and dispute inaccurate information on their credit reports. The system provides role-based access for both regular users and administrators, with AI-powered assistance for generating professional dispute letters.

## Architecture Diagram

\`\`\`
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │    Backend      │    │   External      │
│   (Next.js)     │    │   (NestJS)      │    │   Services      │
│                 │    │                 │    │                 │
│ ┌─────────────┐ │    │ ┌─────────────┐ │    │ ┌─────────────┐ │
│ │ Auth Pages  │ │    │ │ Auth Module │ │    │ │ OpenAI API  │ │
│ │ Dashboard   │ │◄──►│ │ JWT Guards  │ │    │ │ (Optional)  │ │
│ │ Profile     │ │    │ │ Role Guards │ │    │ └─────────────┘ │
│ │ Disputes    │ │    │ └─────────────┘ │    │                 │
│ │ AI Assistant│ │    │                 │    │ ┌─────────────┐ │
│ │ Admin Panel │ │    │ ┌─────────────┐ │    │ │ Mock Credit │ │
│ └─────────────┘ │    │ │Credit Module│ │    │ │ Provider    │ │
│                 │    │ │Dispute Mod. │ │    │ │ (Array API) │ │
│ ┌─────────────┐ │    │ │AI Module    │ │    │ └─────────────┘ │
│ │ API Client  │ │    │ │Admin Module │ │    │                 │
│ │ Auth Context│ │    │ └─────────────┘ │    └─────────────────┘
│ │ Route Guards│ │    │                 │
│ └─────────────┘ │    │ ┌─────────────┐ │
└─────────────────┘    │ │ Database    │ │
                       │ │ Service     │ │
                       │ └─────────────┘ │
                       └─────────────────┘
                                │
                       ┌─────────────────┐
                       │   Data Layer    │
                       │                 │
                       │ ┌─────────────┐ │
                       │ │ PostgreSQL  │ │
                       │ │ - Users     │ │
                       │ │ - Profiles  │ │
                       │ │ - Disputes  │ │
                       │ │ - Letters   │ │
                       │ └─────────────┘ │
                       │                 │
                       │ ┌─────────────┐ │
                       │ │ Redis       │ │
                       │ │ - Sessions  │ │
                       │ │ - Cache     │ │
                       │ └─────────────┘ │
                       └─────────────────┘
\`\`\`

## System Components

### 1. Frontend Layer (Next.js)

#### Architecture Pattern
- **Component-Based Architecture**: Modular, reusable UI components
- **App Router**: Next.js 14 App Router for file-based routing
- **Client-Side State Management**: React Context for authentication state
- **Server-Side Rendering**: Optimized performance with SSR capabilities

#### Key Components
- **Authentication System**: Login, registration, and session management
- **Protected Routes**: Role-based route protection with guards
- **Dashboard**: User and admin dashboards with different feature sets
- **Credit Profile**: Credit score visualization and report item management
- **Dispute Management**: Create, track, and manage disputes
- **AI Assistant**: Generate professional dispute letters
- **Admin Panel**: User management and system oversight

#### Technology Stack
- **Framework**: Next.js 14 with TypeScript
- **Styling**: Tailwind CSS with shadcn/ui components
- **HTTP Client**: Axios with request/response interceptors
- **State Management**: React Context API
- **Form Handling**: Native React with validation

### 2. Backend Layer (NestJS)

#### Architecture Pattern
- **Modular Architecture**: Feature-based modules with clear separation
- **Dependency Injection**: NestJS built-in DI container
- **Layered Architecture**: Controllers → Services → Database
- **Middleware Pipeline**: Authentication, validation, and error handling

#### Core Modules

##### Authentication Module
- **JWT Strategy**: Access and refresh token implementation
- **Local Strategy**: Username/password authentication
- **Guards**: Route protection with role-based access
- **Token Management**: Automatic refresh and regeneration

##### Users Module
- **User Management**: CRUD operations for user accounts
- **Role Management**: User and admin role separation
- **Profile Management**: User profile information

##### Credit Profile Module
- **Mock Integration**: Simulated credit bureau API calls
- **Data Refresh**: Real-time credit data updates
- **Report Items**: Individual credit account management
- **Score Tracking**: Credit score history and trends

##### Disputes Module
- **Lifecycle Management**: Complete dispute workflow
- **Status Tracking**: Pending → Submitted → Under Review → Resolved/Rejected
- **Admin Review**: Administrative dispute management
- **History Tracking**: Complete audit trail

##### AI Module
- **OpenAI Integration**: GPT-powered letter generation
- **Mock Fallback**: Template-based letter generation
- **Letter Storage**: Generated letter persistence
- **Customization**: Personalized dispute content

#### Technology Stack
- **Framework**: NestJS with TypeScript
- **Database**: PostgreSQL with native pg driver
- **Caching**: Redis for session storage
- **Authentication**: JWT with Passport.js
- **Validation**: class-validator and class-transformer
- **External APIs**: OpenAI API integration

### 3. Data Layer

#### Database Design (PostgreSQL)

##### Core Tables
\`\`\`sql
users (id, email, password_hash, role, first_name, last_name, created_at, updated_at)
refresh_tokens (id, user_id, token, expires_at, created_at)
credit_profiles (id, user_id, credit_score, report_date, total_accounts, ...)
credit_report_items (id, credit_profile_id, account_name, account_type, ...)
disputes (id, user_id, credit_report_item_id, dispute_reason, status, ...)
dispute_letters (id, dispute_id, letter_content, generated_at)
\`\`\`

##### Relationships
- Users → Credit Profiles (1:1)
- Credit Profiles → Credit Report Items (1:N)
- Users → Disputes (1:N)
- Credit Report Items → Disputes (1:N)
- Disputes → Dispute Letters (1:N)
- Users → Refresh Tokens (1:N)

##### Indexing Strategy
- Primary keys on all tables
- Foreign key indexes for relationships
- Email index for user lookup
- Status index for dispute filtering
- Token index for refresh token validation

#### Caching Layer (Redis)
- **Session Storage**: User session management
- **Token Storage**: Refresh token caching
- **Data Caching**: Frequently accessed data
- **Rate Limiting**: API request throttling

### 4. External Integrations

#### Credit Data Provider (Mock)
- **Simulation**: Array API simulation for credit data
- **Consistency**: Deterministic data generation based on user ID
- **Variety**: Multiple account types and statuses
- **Refresh**: Simulated real-time data updates

#### AI Integration (OpenAI)
- **Model**: GPT-3.5-turbo for letter generation
- **Fallback**: Mock generation when API unavailable
- **Customization**: Context-aware letter personalization
- **Error Handling**: Graceful degradation to templates

## Authentication & Token Handling Flow

### Registration Flow
\`\`\`
1. User submits registration form
2. Backend validates input data
3. Password hashed with bcrypt
4. User record created in database
5. JWT access and refresh tokens generated
6. Tokens returned to frontend
7. Frontend stores tokens and updates auth state
\`\`\`

### Login Flow
\`\`\`
1. User submits credentials
2. Backend validates against database
3. Password verified with bcrypt
4. JWT tokens generated and returned
5. Frontend stores tokens and redirects to dashboard
\`\`\`

### Token Refresh Flow
\`\`\`
1. Access token expires during API request
2. Axios interceptor catches 401 response
3. Refresh token sent to /auth/refresh endpoint
4. Backend validates refresh token
5. New access and refresh tokens generated
6. Original request retried with new token
7. If refresh fails, user redirected to login
\`\`\`

### Token Regeneration Flow
\`\`\`
1. Admin or user requests token regeneration
2. All existing refresh tokens invalidated
3. New token pair generated
4. Updated tokens returned to client
\`\`\`

## Credit Data Mock Strategy

### Data Generation
- **Deterministic**: Same user ID always generates same data
- **Realistic**: Credit scores, account types, and balances
- **Variety**: Different account statuses and payment histories
- **Consistency**: Stable data across sessions

### Mock Provider Service
\`\`\`typescript
class MockCreditProviderService {
  async fetchCreditData(userId: number) {
    // Generate consistent mock data based on user ID
    // Simulate API delay
    // Return structured credit profile data
  }
}
\`\`\`

### Integration Points
- Credit profile creation and updates
- Report item generation
- Score calculation and trends
- Account status simulation

## Dispute Status Handling

### Status Lifecycle
\`\`\`
pending → submitted → under_review → resolved/rejected
\`\`\`

### State Transitions
- **Pending**: Initial state when dispute created
- **Submitted**: User confirms and submits dispute
- **Under Review**: Admin begins investigation
- **Resolved**: Dispute resolved in user's favor
- **Rejected**: Dispute rejected with explanation

### Admin Workflow
1. Review dispute details and supporting information
2. Add internal admin notes
3. Update status based on investigation
4. Add resolution notes for user communication
5. System tracks all changes with timestamps

### User Experience
- Real-time status updates
- Email notifications (future enhancement)
- Detailed history and timeline
- Resolution explanations

## AI Integration Architecture

### OpenAI Integration
\`\`\`typescript
class AiService {
  async generateWithOpenAI(disputeReason, accountName, accountType) {
    // Construct professional prompt
    // Call OpenAI API with context
    // Process and format response
    // Return professional dispute letter
  }
}
\`\`\`

### Mock Generation Fallback
- Template-based letter generation
- Professional formatting and language
- Legal compliance and best practices
- Customizable content based on dispute type

### Letter Storage
- Generated letters stored in database
- Associated with specific disputes
- Version tracking for modifications
- Export capabilities for users

## Security Architecture

### Authentication Security
- **Password Hashing**: bcrypt with salt rounds
- **JWT Security**: Signed tokens with expiration
- **Token Rotation**: Refresh token rotation on use
- **Session Management**: Secure token storage

### Authorization Security
- **Role-Based Access**: User and admin role separation
- **Route Protection**: Guards on sensitive endpoints
- **Data Isolation**: Users can only access own data
- **Admin Oversight**: Admin access to all data with audit trail

### Input Validation
- **DTO Validation**: class-validator for all inputs
- **SQL Injection Prevention**: Parameterized queries
- **XSS Protection**: Input sanitization
- **CORS Configuration**: Restricted cross-origin access

## Scalability Considerations

### Database Scaling
- **Connection Pooling**: Efficient database connections
- **Indexing Strategy**: Optimized query performance
- **Data Partitioning**: Future horizontal scaling
- **Read Replicas**: Separate read/write operations

### Application Scaling
- **Stateless Design**: Horizontal scaling capability
- **Caching Strategy**: Redis for performance
- **Load Balancing**: Multiple backend instances
- **Microservices**: Future service separation

### Performance Optimization
- **Database Queries**: Optimized with proper indexing
- **API Response**: Efficient data serialization
- **Frontend Caching**: Browser and CDN caching
- **Image Optimization**: Next.js image optimization

## Monitoring and Observability

### Logging Strategy
- **Structured Logging**: JSON format for parsing
- **Error Tracking**: Comprehensive error logging
- **Audit Trail**: User action tracking
- **Performance Metrics**: Response time monitoring

### Health Checks
- **Database Health**: Connection and query health
- **Redis Health**: Cache availability
- **External APIs**: OpenAI API status
- **Application Health**: Service availability

## Deployment Architecture

### Containerization
- **Docker**: Multi-stage builds for optimization
- **Docker Compose**: Local development orchestration
- **Health Checks**: Container health monitoring
- **Volume Management**: Persistent data storage

### Production Considerations
- **Environment Variables**: Secure configuration management
- **SSL/TLS**: HTTPS encryption
- **Database Backup**: Automated backup strategy
- **Monitoring**: Application performance monitoring
- **Logging**: Centralized log aggregation

## Future Enhancements

### Technical Improvements
- **WebSocket Integration**: Real-time dispute updates
- **PDF Generation**: Dispute letter PDF export
- **Email Notifications**: Automated status updates
- **Advanced Analytics**: Detailed reporting dashboard

### Feature Additions
- **Document Upload**: Supporting document management
- **Credit Monitoring**: Automated score tracking
- **Dispute Templates**: Pre-built dispute templates
- **Integration APIs**: Third-party credit bureau APIs

### Scalability Enhancements
- **Microservices**: Service decomposition
- **Event-Driven Architecture**: Asynchronous processing
- **API Gateway**: Centralized API management
- **Message Queues**: Background job processing
