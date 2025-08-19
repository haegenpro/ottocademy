# 🍌 Grocademy - Learn with the Minions!

A comprehensive course platform built with NestJS backend and vanilla frontend integration, featuring user authentication, course management, module tracking, and a Docker-ready setup.

<div align="center">
  <img src="https://img.shields.io/badge/Node.js-18+-green.svg" alt="Node.js" />
  <img src="https://img.shields.io/badge/NestJS-10+-red.svg" alt="NestJS" />
  <img src="https://img.shields.io/badge/PostgreSQL-15+-blue.svg" alt="PostgreSQL" />
  <img src="https://img.shields.io/badge/Docker-Ready-blue.svg" alt="Docker" />
</div>

## 📋 Table of Contents

- [Project Overview](#-project-overview)
- [Features](#-features)
- [Architecture](#-architecture)
- [Quick Start](#-quick-start)
- [Frontend Specification](#-frontend-specification)
- [Backend Specification](#-backend-specification)
- [API Documentation](#-api-documentation)
- [Database Schema](#-database-schema)
- [Development](#-development)
- [Deployment](#-deployment)
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

## ✨ Features

### Frontend Features (F01 - Monolith FE)
- ✅ **User Registration**: Email, username, full name, and password
- ✅ **User Authentication**: Login with email/username and password
- ✅ **Course Browsing**: Search, filter, and paginated course listing
- ✅ **Course Details**: Complete course information with purchase/access controls
- ✅ **My Courses**: Personal dashboard for purchased courses
- ✅ **Module Viewer**: Sequential module access with progress tracking
- ✅ **Progress Tracking**: Visual progress bars and completion status
- ✅ **Certificate Download**: PDF certificates for completed courses

### Backend Features (F02 - Monolith BE & F03 - REST API)
- ✅ **User Management**: CRUD operations with role-based access
- ✅ **Course Management**: Full course lifecycle management
- ✅ **Module Management**: Content organization and sequencing
- ✅ **Purchase System**: Course buying with balance validation
- ✅ **Progress Tracking**: Module completion and course progress
- ✅ **Authentication**: JWT-based authentication with Passport
- ✅ **File Upload**: Support for course materials and user avatars

## 🏗️ Architecture

```
grocademy-api/
├── src/
│   ├── backend/               # NestJS Backend
│   │   ├── auth/              # Authentication (JWT, Passport)
│   │   ├── users/             # User management and profiles
│   │   ├── courses/           # Course CRUD and management
│   │   ├── modules/           # Module content and ordering
│   │   ├── files/             # File upload handling
│   │   ├── prisma/            # Database service
│   │   └── main.ts            # Application entry point
│   └── frontend/              # Vanilla Frontend
│       ├── index.html         # Landing page
│       ├── auth.html          # Login/Register forms
│       ├── courses.html       # Course browsing
│       ├── course-detail.html # Individual course details
│       ├── my-courses.html    # User's purchased courses
│       ├── module.html        # Module content viewer
│       ├── css/styles.css     # Minion-themed styling
│       └── js/api.js          # API integration layer
├── prisma/
│   ├── schema.prisma          # Database schema
│   └── migrations/            # Database migrations
├── docker-compose.yml         # Container orchestration
├── Dockerfile                 # Multi-stage build
└── scripts/                   # Setup and seeding scripts
```

## 🚀 Quick Start

### Prerequisites
- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **PostgreSQL** (for local development) OR **Docker** (recommended)

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
- ✅ Runs database migrations
- ✅ Seeds initial data (courses, users, modules)
- ✅ Builds and starts the application
- ✅ Smart seeding (only seeds if database is empty)

**Daily development (after initial setup):**
```bash
docker-compose up --build
```

**Your application will be running at:**
- **Frontend**: http://localhost:3000
- **API Endpoints**: http://localhost:3000/api

### � Option B: Local Development

#### 1. Environment Setup
Create `.env` file:
```env
# Database Configuration
POSTGRES_USER=postgres
POSTGRES_PASSWORD=your_password
POSTGRES_DB=grocademy
DATABASE_URL="postgresql://postgres:your_password@localhost:5432/grocademy?schema=public"

# JWT Secret
JWT_SECRET=your_super_secret_jwt_key

# Application Port
PORT=3000
```

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

## 🖥️ Frontend Specification

### Page Structure

#### 1. Landing Page (`index.html`)
- **Hero section** with platform introduction
- **Quick access** to authentication
- **Feature highlights** and statistics
- **Responsive design** with Minion theme

#### 2. Authentication Page (`auth.html`)
- **Registration form** with validation:
  - Email (required, unique)
  - Username (required, unique)
  - First Name & Last Name (required)
  - Password & Confirmation (required, min 6 chars)
- **Login form** with email/username + password
- **Error handling** with user-friendly messages
- **Automatic redirect** after successful authentication

#### 3. Course Browsing (`courses.html`)
- **Search functionality** across course titles and descriptions
- **Pagination** (backend-implemented with configurable page size)
- **Course filtering** by category
- **Responsive grid layout** with course cards
- **Real-time search** with debouncing

#### 4. Course Detail (`course-detail.html`)
- **Complete course information**: title, description, instructor, price
- **Module listing** with locked/unlocked status
- **Purchase button** (if not owned and sufficient balance)
- **Access button** (if owned)
- **Certificate download** (if completed)
- **Progress indicator** for owned courses

#### 5. My Courses (`my-courses.html`)
- **Purchased courses dashboard**
- **Progress tracking** with visual indicators
- **Quick access** to continue learning
- **Completion status** and certificates

#### 6. Module Viewer (`module.html`)
- **Sequential module navigation**
- **Content display** (PDF viewer/video player)
- **Completion marking** functionality
- **Progress bar** for course completion
- **Responsive design** for various content types

### Frontend Technology Stack
- **HTML5**: Semantic markup and accessibility
- **CSS3**: Custom properties, flexbox, grid, Tailwind-based utilities
- **Vanilla JavaScript**: ES6+, async/await, Fetch API
- **Design System**: Minion-themed with yellow (#fbbf24) and blue (#87ceeb)

## ⚙️ Backend Specification

### Core Modules

#### 1. Authentication Module (`/auth`)
- **User registration** with validation
- **JWT-based login** with Passport integration
- **Profile management** and user info retrieval
- **Role-based access control** (Admin/User)

#### 2. User Management (`/users`)
- **CRUD operations** for user accounts
- **Balance management** for course purchases
- **Admin-only** user management endpoints
- **Profile picture** upload support

#### 3. Course Management (`/courses`)
- **Public course listing** with search and pagination
- **Course CRUD** operations (admin-only for create/update/delete)
- **Course purchasing** with balance validation
- **Category-based** organization
- **File upload** for course materials

#### 4. Module Management (`/modules`)
- **Module CRUD** operations
- **Content management** (text, PDF, video URLs)
- **Order management** and sequencing
- **Progress tracking** integration
- **Completion marking**

### Database Models

#### User
```prisma
model User {
  id        String   @id @default(uuid())
  email     String   @unique
  username  String   @unique
  firstName String
  lastName  String
  password  String
  balance   Float    @default(0)
  role      Role     @default(USER)
  // Relations...
}
```

#### Course
```prisma
model Course {
  id          String   @id @default(uuid())
  title       String
  description String
  instructor  String
  price       Float
  category    Category
  imageUrl    String?
  // Relations...
}
```

#### Module
```prisma
model Module {
  id          String      @id @default(uuid())
  title       String
  content     String
  type        ModuleType
  order       Int
  courseId    String
  // Relations...
}
```

## 📡 API Documentation

### Authentication Endpoints

#### Register User
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

#### Login User
```http
POST /auth/login
Content-Type: application/json

{
  "identifier": "username_or_email",
  "password": "password123"
}
```

### Course Endpoints

#### Get All Courses
```http
GET /courses?search=keyword&page=1&limit=12&category=PROGRAMMING
```

#### Get Course by ID
```http
GET /courses/{courseId}
```

#### Purchase Course
```http
POST /courses/{courseId}/buy
Authorization: Bearer {jwt_token}
```

### Module Endpoints

#### Get Course Modules
```http
GET /courses/{courseId}/modules
Authorization: Bearer {jwt_token}
```

#### Mark Module Complete
```http
PATCH /modules/{moduleId}/complete
Authorization: Bearer {jwt_token}
```

### User Management (Admin Only)

#### Get All Users
```http
GET /users
Authorization: Bearer {admin_jwt_token}
```

#### Add User Balance
```http
POST /users/{userId}/balance
Authorization: Bearer {admin_jwt_token}
Content-Type: application/json

{
  "amount": 100.00
}
```

## 🎨 Design System

### Color Palette
- **Primary Yellow**: `#fbbf24` (Minion theme)
- **Secondary Blue**: `#87ceeb` (Light blue accent)
- **Background**: `#ffffff` (Clean white)
- **Text**: `#1e293b` (Dark slate gray)
- **Muted**: `#64748b` (Medium gray)

### Typography
- **Font Family**: Inter (Google Fonts)
- **Headings**: 600-700 font weight
- **Body Text**: 400-500 font weight
- **Responsive sizing** with mobile-first approach

### Component Library
- **Cards**: Rounded corners, subtle shadows, hover effects
- **Buttons**: Primary, secondary, outline variants with loading states
- **Forms**: Clean inputs with validation feedback
- **Navigation**: Sticky header with responsive collapsing
- **Progress Bars**: Animated with percentage indicators

## 🛠️ Development

### Available Scripts

| Command | Description |
|---------|-------------|
| `npm run build` | Build TypeScript and CSS |
| `npm run build:css:prod` | Build minified CSS |
| `npm run start:prod` | Start production server |
| `npm run start:dev` | Development mode with watching |
| `npm run seed` | Seed database with initial data |
| `npm run lint` | Run ESLint |
| `npm run format` | Format with Prettier |
| `npm run test` | Run unit tests |

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

### File Upload Configuration

The backend supports file uploads for:
- **Course images** (JPG, PNG, WebP)
- **Module content** (PDF files)
- **User avatars** (Profile pictures)

Files are stored in `/uploads` directory with proper validation and security measures.

## 🚢 Deployment

### Docker Production Deployment

```bash
# Build production images
docker-compose -f docker-compose.prod.yml build

# Start production stack
docker-compose -f docker-compose.prod.yml up -d

# View logs
docker-compose -f docker-compose.prod.yml logs -f
```

### Environment Variables for Production

```env
NODE_ENV=production
DATABASE_URL="postgresql://user:pass@host:5432/db"
JWT_SECRET="production_secret_key"
PORT=3000
```

## 🎓 Demo Credentials

After running the setup script, you can use these credentials:

### Admin Account
- **Email**: admin@grocademy.com
- **Password**: admin123
- **Access**: Full admin privileges

### Student Account
- **Email**: john.doe@example.com
- **Password**: password123
- **Access**: Regular user access

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

## 📊 Performance & Security

### Implemented Features
- **Input validation** with class-validator
- **SQL injection protection** via Prisma ORM
- **JWT token authentication** with expiration
- **File upload validation** and size limits
- **CORS configuration** for cross-origin requests
- **Environment variable** security
- **Password hashing** with bcrypt

### Performance Optimizations
- **Database indexing** on frequently queried fields
- **Pagination** for large datasets
- **Eager/lazy loading** optimization
- **Static file caching** headers
- **Compressed responses** (gzip)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit changes: `git commit -am 'Add feature'`
4. Push to branch: `git push origin feature-name`
5. Submit a pull request

## 📄 License

This project is developed for educational purposes as part of the Grocademy platform specification.

---

## 📞 Support

For questions and support:
- Check the troubleshooting section above
- Review the API documentation
- Examine the demo credentials and test data

**🎉 Happy Learning with Grocademy! 🍌**
POSTGRES_PASSWORD=your_postgres_password
POSTGRES_DB=grocademy
DATABASE_URL="postgresql://postgres:your_postgres_password@localhost:5432/grocademy?schema=public"

# JWT Secret for Authentication
JWT_SECRET=your_super_secret_jwt_key_here

# Application Port
PORT=3000
```

#### 2. Installation & Setup

```bash
# Install dependencies
npm install

# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma migrate dev --name init

# Seed the database
npx prisma db seed

# Build CSS for frontend
npm run build:css:prod

# Build the application
npm run build

# Start the application
npm run start:prod
```

## 🏗️ Project Structure

```
grocademy-api/
├── src/
│   ├── backend/           # NestJS backend API
│   │   ├── auth/          # Authentication module
│   │   ├── users/         # User management
│   │   ├── courses/       # Course management
│   │   ├── modules/       # Module management
│   │   ├── prisma/        # Prisma service
│   │   ├── app.module.ts  # Main application module
│   │   └── main.ts        # Application entry point
│   └── frontend/          # Static frontend files
│       ├── index.html     # Main landing page
│       ├── css/           # Styled with Tailwind CSS
│       ├── js/            # Frontend JavaScript
│       └── public/        # Static assets
├── prisma/
│   ├── schema.prisma      # Database schema
│   └── migrations/        # Database migrations
├── docker-compose.yml     # Docker setup
├── Dockerfile            # Container configuration
└── README.md             # This file
```

## 🔗 API Endpoints

### Authentication
- `POST /auth/register` - User registration
- `POST /auth/login` - User login
- `GET /auth/profile` - Get user profile (requires JWT)

### Users (Admin only)
- `GET /users` - List all users
- `GET /users/:id` - Get user by ID
- `PUT /users/:id` - Update user
- `DELETE /users/:id` - Delete user
- `POST /users/:id/balance` - Add balance to user

### Courses
- `GET /courses` - List all courses
- `GET /courses/:id` - Get course by ID
- `POST /courses` - Create course (admin only)
- `PUT /courses/:id` - Update course (admin only)
- `DELETE /courses/:id` - Delete course (admin only)
- `POST /courses/:id/buy` - Purchase course
- `POST /courses/:courseId/modules` - Add module to course (admin only)

### Modules
- `PUT /modules/:id` - Update module (admin only)
- `DELETE /modules/:id` - Delete module (admin only)
- `PATCH /modules/:id/complete` - Mark module as complete
- `PATCH /modules/reorder` - Reorder modules (admin only)

## 🧪 Testing the Application

### Frontend Access
Visit http://localhost:3000 to access the main Grocademy frontend interface.

### API Testing

#### Health Check
```bash
curl http://localhost:3000/api
```

#### Register a User
```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "username": "testuser",
    "firstName": "Test",
    "lastName": "User",
    "password": "password123"
  }'
```

#### Login
```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "identifier": "testuser",
    "password": "password123"
  }'
```

#### Get Courses
```bash
curl http://localhost:3000/courses
```

## 📝 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run build` | Build both CSS and TypeScript |
| `npm run build:css` | Build CSS in watch mode |
| `npm run build:css:prod` | Build minified CSS for production |
| `npm run start:prod` | Start the compiled application |
| `npm run start:dev` | Start in development mode with file watching |
| `npm run lint` | Run ESLint |
| `npm run format` | Format code with Prettier |
| `npm run test` | Run unit tests |

## 🗃️ Database Schema

### Models
- **User** - User accounts with authentication
- **Course** - Course information with categories
- **Module** - Course modules with content
- **UserCourse** - User course purchases
- **ModuleCompletion** - User module progress
- **Certificate** - Course completion certificates

### Course Categories
- BUSINESS, COMPUTER_SCIENCE, DATA_SCIENCE
- ARTIFICIAL_INTELLIGENCE, INFORMATION_TECHNOLOGY
- SOCIAL_SCIENCE, PHYSICAL_SCIENCE, PERSONAL_DEVELOPMENT
- ARTS, LANGUAGE

## 🛠️ Development Notes

- **Frontend Integration**: Static files served from `/src/frontend/`
- **API Prefix**: All API routes prefixed with `/api`
- **Root Route**: Serves the main `index.html` frontend
- **TypeScript**: Custom source structure with `src/backend/` as root
- **Docker**: Multi-stage build with production optimization
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT with Passport integration

## 🛠️ Troubleshooting

### Docker Environment Issues

#### Cannot connect to Docker
- Ensure Docker Desktop is running
- Check Docker service status

#### Database Connection Issues
```bash
# Check if containers are running
docker-compose ps

# Check database logs
docker-compose logs db

# Reset everything
docker-compose down -v
.\docker-seed.ps1
```

### Local Development Issues

#### Port Already in Use
```bash
# Add to .env file
PORT=3001
```

#### Module Not Found Errors
```bash
# Regenerate Prisma client
npx prisma generate
npm run build
```

#### Frontend Not Loading
- Ensure CSS is built: `npm run build:css:prod`
- Check frontend files exist in `src/frontend/`
- Verify static file serving in `main.ts`

## 📦 Tech Stack

- **Backend Framework:** NestJS
- **Database:** PostgreSQL
- **ORM:** Prisma
- **Authentication:** JWT with Passport
- **Frontend:** Vanilla HTML/CSS/JS with Tailwind CSS
- **Validation:** class-validator
- **File Upload:** Multer
- **Language:** TypeScript
- **Containerization:** Docker & Docker Compose

## 🎉 Default Login Credentials

After seeding the database:

**Admin Account:**
- Email: `admin@grocademy.com`
- Password: `admin123`

**Regular User:**
- Email: `john.doe@email.com`
- Password: `password123`

## 📄 License

This project is part of the Grocademy platform development for educational purposes.

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

🎉 **Your application will be running at `http://localhost:3000`**
