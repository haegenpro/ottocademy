# 🍌 Grocademy - Learn with the Minions!

A comprehensive course platform built with NestJS backend and vanilla frontend integration, featuring user authentication, course management, module tracking, Google OAuth, and a Docker-ready setup.

<div align="center">
  <img src="https://img.shields.io/badge/Node.js-18+-green.svg" alt="Node.js" />
  <img src="https://img.shields.io/badge/NestJS-10+-red.svg" alt="NestJS" />
  <img src="https://img.shields.io/badge/PostgreSQL-15+-blue.svg" alt="PostgreSQL" />
  <img src="https://img.shields.io/badge/Docker-Ready-blue.svg" alt="Docker" />
  <img src="https://img.shields.io/badge/OAuth-Google-blue.svg" alt="Google OAuth" />
</div>

## 📋 Table of Contents

- [Project Overview](#-project-overview)
- [Features](#-features)
- [Quick Start](#-quick-start)
- [Google OAuth Configuration](#-google-oauth-configuration)
- [Architecture & SOLID Principles](#-architecture--solid-principles)
- [API Documentation](#-api-documentation)
- [Development](#-development)
- [CI/CD & Production Deployment](#-cicd--production-deployment)
- [Troubleshooting](#-troubleshooting)

## 🎯 Project Overview

Grocademy is a monolithic web application that combines a NestJS backend with a vanilla HTML/CSS/JavaScript frontend. The platform enables users to browse courses, make purchases, track learning progress, and earn certificates upon completion.

### Key Requirements Met
- **Monolith Architecture**: Single codebase with integrated frontend and backend
- **REST API**: Full API support for external admin interface
- **User Management**: Registration, authentication, and profile management
- **Course Management**: Browse, purchase, and track course progress
- **Module System**: Sequential learning with progress tracking
- **Certificate Generation**: Automatic certificate creation upon course completion
- **Google OAuth**: Alternative authentication method for enhanced user experience

## ✨ Features

### Authentication & Security
- ✅ **Traditional Auth**: Email/username and password login
- ✅ **Google OAuth**: Sign in with Google account integration
- ✅ **JWT Authentication**: Secure token-based authentication with Passport
- ✅ **Role-based Access**: Admin and user role differentiation
- ✅ **Password Security**: Bcrypt hashing for password protection

### Frontend Features (F01 - Monolith FE)
- ✅ **User Registration**: Email, username, full name, and password
- ✅ **Course Browsing**: Search, filter, and paginated course listing with real-time statistics
- ✅ **Course Details**: Complete course information with purchase/access controls
- ✅ **My Courses**: Personal dashboard for purchased courses
- ✅ **Module Viewer**: Sequential module access with progress tracking
- ✅ **Progress Tracking**: Visual progress bars and completion status
- ✅ **Certificate Download**: PDF certificates for completed courses

### Backend Features (F02 - Monolith BE & F03 - REST API)
- ✅ **User Management**: CRUD operations with role-based access and admin protections
- ✅ **Course Management**: Full course lifecycle management
- ✅ **Module Management**: Content organization and sequencing
- ✅ **Purchase System**: Course buying with balance validation
- ✅ **Progress Tracking**: Module completion and course progress
- ✅ **File Upload**: Support for course materials and user avatars
- ✅ **Statistics API**: Dynamic course and category counts for homepage

### Bonus Features Implemented
- ✅ **B10 - OAuth**: Google authentication as alternative login method
- ✅ **B08 - SOLID**: Comprehensive SOLID principles implementation
- ✅ **B06 - Responsive**: Mobile-first responsive design

## 🏗️ Architecture & SOLID Principles

### Project Structure

```
grocademy-api/
├── src/
│   ├── backend/               # NestJS Backend
│   │   ├── auth/              # Authentication module (JWT, OAuth)
│   │   ├── users/             # User management service
│   │   ├── courses/           # Course business logic
│   │   ├── modules/           # Module content management
│   │   ├── statistics/        # Statistics aggregation service
│   │   ├── prisma/            # Database abstraction layer
│   │   └── main.ts            # Application entry point
│   └── frontend/              # Vanilla Frontend
│       ├── index.html         # Landing page with statistics
│       ├── auth.html          # Login/Register with OAuth
│       ├── courses.html       # Course browsing
│       ├── course-detail.html # Individual course details
│       ├── my-courses.html    # User's purchased courses
│       ├── module.html        # Module content viewer
│       ├── css/styles.css     # Responsive design system
│       └── js/api.js          # API abstraction layer
├── prisma/
│   ├── schema.prisma          # Database schema with OAuth support
│   └── migrations/            # Database migrations
├── docker-compose.yml         # Container orchestration
└── Dockerfile                 # Multi-stage production build
```

### SOLID Principles Implementation

This project comprehensively implements all five SOLID principles to ensure maintainable, extensible, and testable code:

#### 1. **Single Responsibility Principle (SRP)**

Each class and module has a single, well-defined responsibility:

**Examples:**
- **`AuthService`**: Handles only user authentication logic (register, login, JWT validation)
- **`UsersService`**: Manages only user-related operations (CRUD, balance management)
- **`CoursesService`**: Focuses solely on course business logic
- **`PrismaService`**: Acts as the single database abstraction layer
- **`GoogleStrategy`**: Handles only Google OAuth authentication flow

**Implementation Details:**
```typescript
// AuthService - Single responsibility: Authentication
@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async register(registerUserDto: RegisterUserDto) { /* Only registration logic */ }
  async login(loginUserDto: LoginUserDto) { /* Only login logic */ }
  async validateGoogleUser(googleUser: any) { /* Only Google validation */ }
}

// StatisticsService - Single responsibility: Data aggregation
@Injectable()
export class StatisticsService {
  constructor(private prisma: PrismaService) {}

  async getOverviewStats() { /* Only statistics computation */ }
}
```

#### 2. **Open/Closed Principle (OCP)**

The system is open for extension but closed for modification:

**Examples:**
- **Authentication Strategy Pattern**: Easy to add new OAuth providers (Facebook, Twitter) without modifying existing auth code
- **Module Type Extensions**: Can add new module types (quiz, interactive) by extending the base ModuleType enum
- **Service Layer Architecture**: New business features can be added through new services without changing existing ones

**Implementation Details:**
```typescript
// Easy to extend with new OAuth strategies
@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  // Google-specific implementation
}

// Future: FacebookStrategy, TwitterStrategy can be added without changing existing code

// Module system designed for extension
enum ModuleType {
  TEXT = 'TEXT',
  PDF = 'PDF',
  VIDEO = 'VIDEO',
  // Future: QUIZ, INTERACTIVE, SIMULATION can be added
}
```

#### 3. **Liskov Substitution Principle (LSP)**

Derived classes can be substituted for their base classes without breaking functionality:

**Examples:**
- **Passport Strategies**: All authentication strategies (JWT, Google) implement the same interface and can be used interchangeably
- **Database Services**: PrismaService implements a consistent interface that could be replaced with other ORM implementations
- **DTO Validation**: All DTOs follow consistent validation patterns using class-validator

**Implementation Details:**
```typescript
// All strategies can be substituted without breaking the authentication flow
export class JwtStrategy extends PassportStrategy(Strategy) { /* ... */ }
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') { /* ... */ }

// Both follow same interface contract for Passport
```

#### 4. **Interface Segregation Principle (ISP)**

Clients are not forced to depend on interfaces they don't use:

**Examples:**
- **Service Injection**: Controllers only inject services they actually need
- **DTO Segregation**: Separate DTOs for different operations (RegisterUserDto, LoginUserDto, UpdateUserDto)
- **Response Interfaces**: Different response types for different API endpoints

**Implementation Details:**
```typescript
// Controllers only depend on services they need
@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,  // Only auth-related dependencies
  ) {}
}

@Controller('users')
export class UsersController {
  constructor(
    private usersService: UsersService,  // Only user-related dependencies
  ) {}
}

// Segregated DTOs for different purposes
export class RegisterUserDto { /* Registration-specific fields */ }
export class LoginUserDto { /* Login-specific fields */ }
export class UpdateUserDto { /* Update-specific fields */ }
```

#### 5. **Dependency Inversion Principle (DIP)**

High-level modules don't depend on low-level modules; both depend on abstractions:

**Examples:**
- **Service Dependencies**: All services depend on PrismaService abstraction, not direct database calls
- **JWT Abstraction**: AuthService depends on JwtService interface, not specific JWT implementation
- **Validation Abstraction**: Controllers depend on validation decorators, not specific validation logic

**Implementation Details:**
```typescript
// High-level AuthService depends on abstractions
@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,      // Database abstraction
    private jwtService: JwtService,     // JWT abstraction
  ) {}
}

// PrismaService abstracts database operations
@Injectable()
export class PrismaService extends PrismaClient {
  // Database operations abstracted through Prisma
}

// Dependency injection through NestJS modules
@Module({
  providers: [
    AuthService,
    UsersService,
    PrismaService,    // Dependencies injected through DI container
    JwtService,
  ],
})
export class AuthModule {}
```

### Design Patterns Implemented

Beyond SOLID principles, the project implements several design patterns:

#### 1. **Strategy Pattern**
- **Authentication Strategies**: JWT and Google OAuth strategies
- **File Upload Strategies**: Different upload handlers for courses, modules

#### 2. **Repository Pattern**
- **PrismaService**: Acts as repository layer abstracting database operations
- **Service Layer**: Encapsulates business logic separate from data access

#### 3. **Dependency Injection Pattern**
- **NestJS DI Container**: Manages service lifecycles and dependencies
- **Module System**: Organizes related services and controllers

#### 4. **MVC Pattern**
- **Controllers**: Handle HTTP requests and responses
- **Services**: Contain business logic
- **Models**: Prisma schema defines data models

### Benefits of This Architecture

1. **Maintainability**: Each component has clear responsibilities and minimal coupling
2. **Testability**: Dependencies can be easily mocked for unit testing
3. **Extensibility**: New features can be added without modifying existing code
4. **Scalability**: Modular architecture allows for easy service separation if needed
5. **Code Reusability**: Services can be reused across different controllers
6. **Error Handling**: Centralized exception handling through NestJS filters

## 🚀 Quick Start

### Prerequisites
- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **PostgreSQL** (for local development) OR **Docker** (recommended)
- **Google Developer Account** (for OAuth functionality)

### 🐳 Option A: Docker Development (Recommended)

**One-command setup:**
```bash
# Windows PowerShell
.\docker-seed.ps1

# Unix/Linux/macOS
chmod +x docker-seed.sh && ./docker-seed.sh
```

**What this script does:**
- ✅ Sets up PostgreSQL database in Docker
- ✅ Runs database migrations (includes Google OAuth schema)
- ✅ Seeds initial data (courses, users, modules)
- ✅ Builds and starts the application
- ✅ Smart seeding (only seeds if database is empty)

**Daily development (after initial setup):**
```bash
docker-compose up --build
```

**Your application will be running at:**
- **Frontend**: http://127.0.0.1:3000
- **API Endpoints**: http://127.0.0.1:3000/api

### 💻 Option B: Local Development

#### 1. Environment Setup
Copy the example file and fill in real values (never commit the result):
```bash
cp .env.example .env
```
`.env.example` documents every environment variable the app actually reads
(database, JWT, Google OAuth, Google Cloud Storage, port). See
[CI/CD & Production Deployment](#-cicd--production-deployment) for what each
one does in production.

#### 2. Installation & Setup
```bash
# Install dependencies
npm install

# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma migrate dev --name init

# Seed the database
npm run seed

# Build CSS for frontend
npm run build:css:prod

# Build and start application
npm run build
npm run start:prod
```

## 🔐 Google OAuth Configuration

### Current Status
🔧 **Google OAuth is not configured** - Using placeholder credentials

### Step 1: Google Cloud Console Setup

1. **Create a Google Cloud Project**:
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select existing one
   - Enable the **Google+ API** and **People API**

2. **Configure OAuth Consent Screen**:
   - Navigate to **APIs & Services** > **OAuth consent screen**
   - Choose **External** user type
   - Fill in required fields:
     - App name: `Grocademy`
     - User support email: Your email
     - Developer contact: Your email
   - Add scopes: `email`, `profile`

3. **Create OAuth 2.0 Credentials**:
   - Go to **APIs & Services** > **Credentials**
   - Click **Create Credentials** > **OAuth 2.0 Client ID**
   - Choose **Web application**
   - Set **Authorized redirect URIs**:
     - Development: `http://127.0.0.1:3000/auth/google/callback`
     - Alternative: `http://localhost:3000/auth/google/callback`
     - Production: `https://yourdomain.com/auth/google/callback`

### Step 2: Environment Variables Setup

Replace the placeholder values in your `.env` file:
```env
# Google OAuth Configuration
GOOGLE_CLIENT_ID=your-actual-google-client-id-here
GOOGLE_CLIENT_SECRET=your-actual-google-client-secret-here
GOOGLE_CALLBACK_URL=http://localhost:3000/auth/google/callback
```

### Step 3: Restart Application
```bash
docker-compose down
docker-compose up --build -d
```

### Step 4: Current Behavior & Security Features

**Authentication Status:**
- ✅ **Email/Password login**: Works normally
- ⚠️ **Google OAuth**: Shows user-friendly error message until configured
- 🔧 **Configuration**: Prevents application crashes with invalid credentials

**Security Features:**
- ✅ Validates OAuth configuration before attempting authentication
- ✅ Provides fallback dummy credentials to prevent startup crashes
- ✅ Shows informative error messages to users
- ✅ Graceful degradation when OAuth is not configured

### Step 5: Testing OAuth Integration

1. **Start the application**:
   ```bash
   docker-compose up --build
   # OR for local development
   npm run start:dev
   ```

2. **Test OAuth flow**:
   - Visit `http://127.0.0.1:3000/auth.html`
   - Click "Sign in with Google" button
   - Complete Google authentication
   - You should be redirected back with successful login

### Step 6: OAuth Features

**Backend Features:**
- Automatic user creation if Google account doesn't exist
- Links Google account to existing user if email matches
- Stores Google profile picture URL
- Maintains Google ID for future logins

**Frontend Features:**
- Google OAuth buttons with Material Design icons
- Seamless integration with existing authentication flow
- Error handling for OAuth failures
- Automatic redirect after successful authentication

### Step 7: Troubleshooting OAuth

**Common Issues:**

1. **"redirect_uri_mismatch" error**:
   - Verify callback URL in Google Console matches your `.env` file
   - Ensure no trailing slashes or different protocols

2. **"invalid_client" error**:
   - Check `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` are correct
   - Verify OAuth consent screen is properly configured

3. **OAuth not working in production**:
   - Update redirect URI in Google Console for production domain
   - Ensure HTTPS is used in production callback URL

4. **Database connection issues**:
   - Verify Prisma migrations include Google OAuth schema
   - Check `googleId` and `picture` fields exist in User model

---

*Once you add real Google OAuth credentials, the "Continue with Google" button will work properly!*

## � API Documentation

### Authentication Endpoints

#### Traditional Authentication
```http
POST /auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "username": "username",
  "firstName": "John",
  "lastName": "Doe",
  "password": "password123"
}
```

```http
POST /auth/login
Content-Type: application/json

{
  "identifier": "username_or_email",
  "password": "password123"
}
```

#### Google OAuth Authentication
```http
GET /auth/google
# Redirects to Google OAuth consent screen

GET /auth/google/callback?code=...
# Google callback endpoint (handled automatically)
```

#### User Profile
```http
GET /auth/self
Authorization: Bearer {jwt_token}
```

### Core Endpoints

#### Statistics (Homepage)
```http
GET /api/statistics/overview
# Returns course counts by category and total statistics
```

#### Courses
```http
GET /api/courses?search=keyword&page=1&limit=12&category=PROGRAMMING
GET /api/courses/{courseId}
POST /api/courses/{courseId}/buy
Authorization: Bearer {jwt_token}
```

#### My Courses
```http
GET /api/courses/my-courses?page=1&limit=10
Authorization: Bearer {jwt_token}
```

#### Modules
```http
GET /api/courses/{courseId}/modules
Authorization: Bearer {jwt_token}

PATCH /api/modules/{moduleId}/complete
Authorization: Bearer {jwt_token}
```

### Admin-Only Endpoints

#### User Management
```http
GET /api/users?q=search&page=1&limit=15
POST /api/users/{userId}/balance
PUT /api/users/{userId}
DELETE /api/users/{userId}
Authorization: Bearer {admin_jwt_token}
```

#### Course Management
```http
POST /api/courses
PUT /api/courses/{id}
DELETE /api/courses/{id}
Authorization: Bearer {admin_jwt_token}
```

#### Module Management
```http
POST /api/courses/{courseId}/modules
PUT /api/modules/{id}
DELETE /api/modules/{id}
PATCH /api/courses/{courseId}/modules/reorder
Authorization: Bearer {admin_jwt_token}
```

### Response Format

All API responses follow a consistent format:
```json
{
  "status": "success" | "error",
  "data": { /* response data */ },
  "message": "Optional message",
  "pagination": { /* for paginated responses */ }
}
```

## 🛠️ Development

### Available Scripts

| Command | Description |
|---------|-------------|
| `npm run build` | Build TypeScript and CSS |
| `npm run build:css:prod` | Build minified CSS |
| `npm run start:prod` | Start production server |
| `npm run start:dev` | Development mode with file watching |
| `npm run seed` | Seed database with initial data |
| `npm run lint` | Run ESLint |
| `npm run format` | Format with Prettier |

### Database Management

```bash
# Generate Prisma client
npx prisma generate

# Create new migration
npx prisma migrate dev --name migration_name

# Reset database
npx prisma migrate reset

# Open Prisma Studio
npx prisma studio
```

### Design System & UI Components

**Color Palette:**
- **Primary Yellow**: `#fbbf24` (Minion theme)
- **Secondary Blue**: `#87ceeb` (Light blue accent)
- **Background**: `#ffffff` (Clean white)
- **Text**: `#1e293b` (Dark slate gray)

**Typography:**
- **Font Family**: Inter (Google Fonts)
- **Responsive sizing** with mobile-first approach

**Features:**
- **Responsive Design**: Mobile-first responsive layout (B06)
- **Component Library**: Cards, buttons, forms with consistent styling
- **Navigation**: Sticky header with responsive collapsing
- **Progress Bars**: Animated with percentage indicators

### Security Features

- **Input validation** with class-validator
- **SQL injection protection** via Prisma ORM
- **JWT token authentication** with expiration
- **Password hashing** with bcrypt
- **File upload validation** and size limits
- **CORS configuration** for cross-origin requests
- **Environment variable** security

### Demo Credentials

After running the setup script, you can use these credentials:

**Admin Account:**
- **Email**: admin@grocademy.com
- **Password**: admin123
- **Access**: Full admin privileges, can manage users and courses

**Student Account:**
- **Email**: john.doe@example.com
- **Password**: password123
- **Access**: Regular user access, can purchase and view courses

## 🚀 CI/CD & Production Deployment

### Architecture

```text
GitHub (source of truth)
  → GitHub Actions CI   (lint, unit tests, integration tests against a real
                          Postgres service container, production build,
                          Docker build)
  → GitHub Actions CD   (on push to main, after CI succeeds)
      → Docker image built and pushed to GHCR
        (ghcr.io/<owner>/ottocademy:sha-<commit>, and :main)
  → GitLab mirror (downstream, read-only, evaluator access only)
```

GitHub Actions is the only CI/CD engine, and **publishing to GHCR is
currently the last step of the pipeline** - there is no automated deploy
to a hosting platform. (An earlier iteration of this pipeline deployed to
Render; that step has been removed - see "Deploying the image" below for
what running the published image elsewhere requires.) GitLab is used only
as a read-only mirror for evaluator access - it does not run any CI/CD.

### Environments: development vs CI vs production

| | Database | Migrations | Config source |
|---|---|---|---|
| **Development** | `docker-compose.yml` `db` service, or a local Postgres | `npx prisma migrate dev` (creates new migrations) | `.env` (never committed) |
| **CI** | Ephemeral `postgres:14` GitHub Actions service container | `npx prisma migrate deploy` (applies committed migrations) | Job-scoped env vars with throwaway test values |
| **Production** | Whatever external PostgreSQL the deployment target provides (not provisioned by this pipeline) | `npx prisma migrate deploy`, run by the container's entrypoint before the app starts | Environment variables provided by wherever the image is deployed |

Production and CI never run `prisma migrate dev` - only `migrate deploy`,
which applies migrations already committed under `prisma/migrations/`
and never generates new ones.

### Environment variables

All variables the application actually reads are documented in
[`.env.example`](.env.example) with safe placeholders - copy it to `.env`
for local use and never commit the real `.env`. Wherever the image is
ultimately deployed, set the real values as that platform's environment
variables:

| Variable | Purpose |
|---|---|
| `NODE_ENV` | `production` in production |
| `PORT` | Usually set automatically by the hosting platform; app falls back to `3000` locally |
| `DATABASE_URL` | Postgres connection string for the target environment |
| `JWT_SECRET` | Signing secret for session JWTs - use a long random value |
| `FRONTEND_URL` | Base URL the app redirects the browser to after Google OAuth login |
| `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` | Google OAuth client credentials |
| `GOOGLE_CALLBACK_URL` | Must exactly match the callback path below, using the production domain |
| `GOOGLE_CLOUD_PROJECT_ID` / `GOOGLE_CLOUD_KEYFILE` / `GOOGLE_CLOUD_STORAGE_BUCKET` | Google Cloud Storage bucket used for course thumbnails/PDF/video uploads |

Never commit real secrets. If a secret is ever committed to the repository
(this project's history shows one such incident, already removed), rotate
it immediately - removing it from the tree does not undo the exposure.

### Health endpoint

`GET /health` is public (no auth), cheap, and returns:
```json
{ "status": "ok" }
```
It is intentionally excluded from the app's global `/api` prefix (see
`src/backend/main.ts`) so it is reachable at the bare path `/health`, which
is what container/platform health checks typically expect.

### Google OAuth callback

The callback route is fixed by the application at:
```text
/auth/google/callback
```
In the Google Cloud Console OAuth client, register the production callback
as an **Authorized redirect URI**:
```text
https://<your-production-domain>/auth/google/callback
```
and set `GOOGLE_CALLBACK_URL` to that same URL in the deployment target's
environment variables.

### Docker

Build and run the production image standalone (no Compose) against any
external Postgres:
```bash
docker build -t ottocademy:test .
docker run --rm -p 3000:3000 \
  -e DATABASE_URL="postgresql://user:pass@host:5432/db?schema=public" \
  -e JWT_SECRET="a-long-random-secret" \
  -e GOOGLE_CLIENT_ID=placeholder-client-id \
  ottocademy:test
```
On container start, the entrypoint (`scripts/docker-entrypoint.sh`) runs
`npx prisma migrate deploy` and then starts the compiled app - the image
is self-contained and does not depend on Docker Compose being present.
The container runs as a non-root user.

For local multi-service development, `docker-compose.yml` still provisions
Postgres plus a one-shot `db-migrate` + seed step ahead of the app
container, as before.

**Migration safety note:** running `migrate deploy` from the container's own
entrypoint is fine for a single-instance deployment - Prisma also takes an
internal database lock while applying migrations, so a second concurrent
instance would wait rather than race. If you scale to multiple replicas,
prefer running the migration as a separate one-off step (a dedicated
release/job step, or whatever pre-deploy hook your hosting platform offers)
instead of relying on every replica's entrypoint.

### CI (`.github/workflows/ci.yml`)

Runs on every pull request and on pushes to `main`:
lint (ESLint + Prettier check) → Prisma generate → unit tests → integration
tests against a real `postgres:14` service container (with
`prisma migrate deploy`) → production build → dependency audit
(informational) → Docker build.

### CD (`.github/workflows/cd.yml`)

Runs after CI succeeds on `main` (via `workflow_run`, so the expensive
lint/test/build steps are never duplicated): builds the Docker image and
pushes it to `ghcr.io/<owner>/ottocademy`, tagged with both an immutable
`sha-<short-sha>` and a floating `main` tag. **That GHCR push is the last
step of this pipeline** - no deploy step runs afterward, and no
deployment-target secrets or variables are required for CD to run
end-to-end.

`GITHUB_TOKEN` (built-in, no setup needed) is used to push to GHCR with
`contents: read` / `packages: write` permissions only - no other secrets
are needed.

### Deploying the image

Deploying the GHCR image to a hosting platform (Render or otherwise) is
currently a separate, manual step outside this CI/CD pipeline - no
platform-specific secrets are stored in GitHub for it. Whichever platform
is used later, the pattern is the same:
1. Point it at `ghcr.io/<owner>/ottocademy:main` (or a specific
   `sha-<commit>` tag for a pinned rollback) as a prebuilt image, not a
   repository build.
2. If the GHCR package is private, give the platform a registry
   credential, or make the package public (Settings → package visibility).
3. Set the environment variables listed above, including `DATABASE_URL`
   pointing at that platform's PostgreSQL (managed or external).
4. Configure its health check to `GET /health`.
5. Set `GOOGLE_CALLBACK_URL` to that platform's public callback URL (see
   "Google OAuth callback" above).

If GitHub Actions is later extended to deploy automatically again, that
deploy step (and whatever secrets/variables it needs) should be added back
into `cd.yml` as its own job after `build-and-push`, so a failed or
misconfigured deploy step still can't block the GHCR publish that CD's
job already completed.

## 🐛 Troubleshooting

### Docker Issues

**Container won't start:**
```bash
# Check container status
docker-compose ps

# View detailed logs
docker-compose logs app
docker-compose logs db

# Reset everything
docker-compose down -v
.\docker-seed.ps1
```

**Database connection errors:**
```bash
# Ensure database is ready
docker-compose up -d db
docker-compose logs db

# Check if migrations ran
docker-compose exec app npx prisma migrate status
```

### Google OAuth Issues

**"redirect_uri_mismatch" error:**
- Verify callback URL in Google Console matches your `.env` file
- Ensure exact URL match: `http://127.0.0.1:3000/auth/google/callback`

**"invalid_client" error:**
- Check `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` are correct
- Verify OAuth consent screen is properly configured

**OAuth not working:**
- Check if Google APIs are enabled in your project
- Verify environment variables are loaded correctly

### Local Development Issues

**Port already in use:**
```bash
# Change port in .env file
PORT=3001
```

**Prisma client errors:**
```bash
# Regenerate client
npx prisma generate
npm run build
```

**CSS not loading:**
```bash
# Rebuild CSS
npm run build:css:prod
```

---

## ⚡ Quick Commands Summary

**First Time Setup:**
```bash
.\docker-seed.ps1  # Full Docker setup with seeding
```

**Daily Development:**
```bash
docker-compose up --build  # Start application
```

**Reset Everything:**
```bash
docker-compose down -v     # Delete all data
.\docker-seed.ps1          # Fresh setup
```

**Test Google OAuth:**
```bash
# 1. Configure Google OAuth credentials in .env
# 2. Start application
docker-compose up --build
# 3. Visit http://127.0.0.1:3000/auth.html
# 4. Click "Sign in with Google"
```

## 📋 Project Requirements Fulfilled

**Core Requirements (F01-F03):**
- ✅ **F01 - Monolith FE**: Complete frontend with all required pages
- ✅ **F02 - Monolith BE**: Full backend with authentication and business logic  
- ✅ **F03 - REST API**: Complete API for external admin interface

**Design Patterns & Architecture:**
- ✅ **3+ Design Patterns**: Strategy, Repository, Dependency Injection, MVC
- ✅ **OOP Implementation**: Full object-oriented design with NestJS
- ✅ **Docker Integration**: Complete containerization with docker-compose

**Bonus Features Implemented:**
- ✅ **B08 - SOLID**: Comprehensive SOLID principles implementation
- ✅ **B10 - OAuth**: Google authentication integration  
- ✅ **B06 - Responsive**: Mobile-first responsive design

## 📄 License

This project is developed for educational purposes as part of the Labpro (Programming Lab) selection for the 2025 batch.

---

🎉 **Your application will be running at `http://127.0.0.1:3000`**
