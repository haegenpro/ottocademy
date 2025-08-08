# Grocademy API Backend

A NestJS-based backend API for the Grocademy course platform with PostgreSQL database and Prisma ORM.

## 🚀 Quick Start

### Prerequisites

- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **PostgreSQL** (for local development) OR **Docker** (for containerized development)

### 1. Environment Setup

Choose one of the following setups based on your preferred development environment:

#### Option A: Local Development (with PostgreSQL installed locally)

Create a `.env` file in the root directory:

```env
# Database Configuration
POSTGRES_USER=postgres
POSTGRES_PASSWORD=your_postgres_password
POSTGRES_DB=grocademy

# Database URL for Prisma (Local PostgreSQL)
DATABASE_URL="postgresql://postgres:your_postgres_password@localhost:5432/grocademy?schema=public"

# JWT Secret for Authentication
JWT_SECRET=your_super_secret_jwt_key_here

# Application Port
PORT=3000
```

#### Option B: Docker Development (with PostgreSQL in Docker)

Create a `.env` file in the root directory:

```env
# Database Configuration (Docker)
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=grocademy

# Database URL for Prisma (Docker PostgreSQL)
DATABASE_URL="postgresql://postgres:postgres@db:5432/grocademy?schema=public"

# JWT Secret for Authentication
JWT_SECRET=your_super_secret_jwt_key_here

# Application Port
PORT=3000
```

**Important:** Replace the following values:
- `your_postgres_password` - Your PostgreSQL password (for local setup)
- `your_super_secret_jwt_key_here` - A strong secret key for JWT tokens

### 2. Installation

```bash
# Install dependencies
npm install

# Generate Prisma client
npx prisma generate
```

### 3. Database Setup & Running

Choose your preferred development environment:

## 🐳 Option A: Docker Development (Recommended)

### Prerequisites for Docker
- **Docker** and **Docker Compose** installed

### Three Easy Ways to Start

#### 🚀 **Method 1: Use the Setup Script (Recommended)**

**Windows PowerShell:**
```bash
# One command setup - handles everything automatically
.\docker-seed.ps1
```

**Features:**
- ✅ **Smart Seeding**: Only seeds database if it's empty (prevents redundant data)
- ✅ **Health Checks**: Waits for database to be ready before proceeding
- ✅ **Error Handling**: Provides clear feedback and troubleshooting info
- ✅ **Safe Re-runs**: Can be run multiple times without issues
- ✅ **Progress Tracking**: Shows detailed setup progress with colored output

**Bash/Git Bash:**
```bash
# Make executable and run
chmod +x docker-seed.sh
./docker-seed.sh
```

#### 🔧 **Method 2: Manual Setup (If you prefer step-by-step)**

1. **Create `.env` file** with Docker configuration:
```env
# Database Configuration (Docker)
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=grocademy

# Database URL for Prisma (Docker PostgreSQL)
DATABASE_URL="postgresql://postgres:postgres@db:5432/grocademy?schema=public"

# JWT Secret for Authentication
JWT_SECRET=your_super_secret_jwt_key_here
```

2. **First-time setup:**
```bash
# Install dependencies locally (needed for Prisma CLI)
npm install

# Start only the database first
docker-compose up -d db

# Run migrations and seeding inside Docker containers
docker-compose run --rm app npx prisma migrate deploy
docker-compose run --rm app npm run seed:docker

# Start the complete application
docker-compose up --build
```

#### ⚡ **Method 3: Quick Daily Development**

**After initial setup (Method 1 or 2), you only need:**

```bash
# Start both database and application
docker-compose up --build

# Or run in background
docker-compose up -d --build
```

### 🔄 **Understanding Data Persistence & Smart Seeding**

The system now includes **intelligent seeding** that prevents redundant operations:

#### **🧠 Smart Seeding Behavior:**
- **First Run**: Detects empty database → Creates comprehensive test data
- **Subsequent Runs**: Detects existing data → Skips seeding, shows credentials
- **After Volume Reset**: Detects empty database → Re-creates all test data

#### **📊 Data Persistence Scenarios:**

| Action | Database State | Smart Seeding Behavior |
|--------|----------------|------------------------|
| `docker compose up` | Data persists | ✅ **Skips seeding** - shows existing credentials |
| `docker compose restart` | Data persists | ✅ **Skips seeding** - data already exists |
| `docker compose down` → `up` | Data persists | ✅ **Skips seeding** - volumes preserved |
| `docker compose down -v` → setup | Data deleted | ✅ **Full seeding** - detects empty database |
| Volume manually deleted | Data deleted | ✅ **Full seeding** - detects empty database |

#### **🎯 When Setup is Actually Needed:**
- ✅ **First time running the project**
- ✅ **After `docker compose down -v` (volumes deleted)**
- ✅ **After manually deleting Docker volumes**
- ❌ **NOT needed after normal container stops/starts**
- ❌ **NOT needed after `docker compose restart`**

### 🛠️ **Daily Development Workflow:**

**First Time:**
```bash
.\docker-seed.ps1  # Full setup with seeding
```

**Every Other Time:**
```bash
docker compose up -d  # Just start - data persists
```

**Reset Everything:**
```bash
docker compose down -v  # Delete data
.\docker-seed.ps1       # Fresh setup
```

### 🛠️ **When to Re-run Setup:**

| Scenario | Data Status | Action Needed |
|----------|-------------|---------------|
| Normal restart | ✅ Persists | Just `docker-compose up` |
| Volume reset (`-v`) | ❌ Lost | Re-run setup script |
| First time | ❌ Empty | Run setup script |

### 🔧 **Quick Troubleshooting:**

**Database Connection Issues:**
```bash
# Check if database is running
docker compose ps db

# Check database logs
docker compose logs db

# Reset everything and try again
docker compose down -v
.\docker-seed.ps1
```

**Seeding Issues:**
```bash
# Check migration logs
docker compose logs db-migrate

# Manual seeding (if needed)
docker compose exec app node scripts/docker-seed.js
```

**Application Won't Start:**
```bash
# Check app logs
docker compose logs app

# Restart just the app
docker compose restart app
```
| After `down -v` | ❌ Lost | Re-run `.\docker-seed.ps1` |
| Fresh clone | ❌ None | Run `.\docker-seed.ps1` |
| Schema changes | ⚠️ Needs migration | Re-run setup script |

### Docker Commands Reference
```bash
# Start all services
docker-compose up

# Start in background
docker-compose up -d

# Start with rebuild
docker-compose up --build

# Stop all services
docker-compose down

# View logs
docker-compose logs -f

# View specific service logs
docker-compose logs -f app
docker-compose logs -f db

# Reset everything (⚠️ This deletes all data)
docker-compose down -v
```

## 💻 Option B: Local Development

### Prerequisites for Local Development
- **PostgreSQL** installed and running locally
- Database server accessible at `localhost:5432`

### Setup for Local Development
1. Make sure you're using the **Local .env configuration** (Option A above)
2. Ensure PostgreSQL is running on your machine
3. Create the database:

```bash
# Create database and run migrations
npx prisma migrate dev --name init

# (Optional) Seed the database with initial data
npx prisma db seed
```

### Running Locally
```bash
# Development mode (recommended)
npm run build:tsc && npm run start:prod

# Development with file watching
npm run dev:watch
# In another terminal:
npm run start:prod

# Production mode
npm run build:tsc
npm run start:prod
```

## 🤔 Which Development Environment Should I Choose?

### 🐳 Docker Development
**Pros:**
- ✅ Consistent environment across different machines
- ✅ No need to install PostgreSQL locally
- ✅ Easy to clean up and reset database
- ✅ Isolated from your local system
- ✅ Easy to share with team members

**Cons:**
- ❌ Slightly slower startup times
- ❌ Requires Docker knowledge
- ❌ Uses more system resources

**Best for:** Team development, consistency across environments, if you don't want to install PostgreSQL locally.

### 💻 Local Development
**Pros:**
- ✅ Faster performance
- ✅ Direct access to database tools
- ✅ Simpler debugging
- ✅ No Docker overhead

**Cons:**
- ❌ Requires PostgreSQL installation
- ❌ Environment differences between developers
- ❌ Potential conflicts with other projects

**Best for:** Solo development, performance-critical development, if you already have PostgreSQL set up.

## 📝 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run build:tsc` | Build using TypeScript compiler |
| `npm run build:clean` | Clean TypeScript build cache |
| `npm run start:prod` | Start the compiled application |
| `npm run start:dev:tsc` | Build and start in one command |
| `npm run dev:watch` | Watch for file changes and auto-compile |
| `npm run lint` | Run ESLint |
| `npm run format` | Format code with Prettier |
| `npm run test` | Run unit tests |

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

## 🗃️ Database Schema

### Models
- **User** - User accounts with authentication
- **Course** - Course information with categories
- **Module** - Course modules with content
- **UserCourse** - User course purchases
- **ModuleCompletion** - User module progress
- **Certificate** - Course completion certificates

### Course Categories
- BUSINESS
- COMPUTER_SCIENCE
- DATA_SCIENCE
- ARTIFICIAL_INTELLIGENCE
- INFORMATION_TECHNOLOGY
- SOCIAL_SCIENCE
- PHYSICAL_SCIENCE
- PERSONAL_DEVELOPMENT
- ARTS
- LANGUAGE

## 🧪 Testing the API

### Health Check
```bash
curl http://localhost:3000
```

### Register a User
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

### Login
```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "identifier": "testuser",
    "password": "password123"
  }'
```

### Get Courses
```bash
curl http://localhost:3000/courses
```

## 🛠️ Troubleshooting

### Docker Environment Issues

#### Database Connection Issues
```bash
# Check if Docker containers are running
docker-compose ps

# Check database logs
docker-compose logs db

# Restart database service
docker-compose restart db

# Connect to database container
docker-compose exec db psql -U postgres -d grocademy
```

#### Container Issues
```bash
# Rebuild containers if there are issues
docker-compose down
docker-compose up --build

# Clean up all containers and volumes (⚠️ This will delete all data)
docker-compose down -v
docker system prune -a
```

### Local Environment Issues

#### Database Connection Issues
```bash
# Check if PostgreSQL is running (Windows)
Get-Service postgresql*

# Check if PostgreSQL is running (Mac/Linux)
brew services list | grep postgresql
# or
sudo systemctl status postgresql

# Verify DATABASE_URL in .env file
# Make sure it points to localhost:5432 for local development
```

#### Local PostgreSQL Setup
```bash
# Install PostgreSQL (Windows with Chocolatey)
choco install postgresql

# Install PostgreSQL (Mac with Homebrew)
brew install postgresql
brew services start postgresql

# Create database manually if needed
createdb grocademy
```

### General Issues

### Build Errors
```bash
# Clean build cache and rebuild
npm run build:clean
npm run build:tsc
```

### Module Not Found Errors
```bash
# Regenerate Prisma client
npx prisma generate
npm run build:tsc
```

### Port Already in Use
If port 3000 is occupied, set a different port:
```bash
# Add to .env file
PORT=3001
```

## 🏗️ Project Structure

```
src/backend/
├── auth/           # Authentication module
├── users/          # User management
├── courses/        # Course management
├── modules/        # Module management
├── prisma/         # Prisma service
├── app.module.ts   # Main application module
└── main.ts         # Application entry point

prisma/
├── schema.prisma   # Database schema
└── migrations/     # Database migrations
```

## 📦 Tech Stack

- **Framework:** NestJS
- **Database:** PostgreSQL
- **ORM:** Prisma
- **Authentication:** JWT with Passport
- **Validation:** class-validator
- **File Upload:** Multer
- **Language:** TypeScript

## 🔧 Development Notes

- The project uses a custom source structure (`src/backend/`)
- TypeScript compilation requires `--force` flag due to incremental build cache issues
- Prisma client is generated to the standard location (`node_modules/@prisma/client`)
- All API routes require proper authentication except registration and login

## 📄 License

This project is part of the Grocademy platform development.

---

## ⚡ Quick Setup Summary

### 🐳 Docker Development (Recommended)
```bash
# 1. Create .env with Docker configuration
# 2. Install dependencies (for Prisma CLI)
npm install

# 3. First-time setup
docker-compose up -d db
$env:DATABASE_URL="postgresql://postgres:postgres@localhost:5432/grocademy?schema=public"; npx prisma migrate deploy
$env:DATABASE_URL="postgresql://postgres:postgres@localhost:5432/grocademy?schema=public"; npx prisma db seed
docker-compose down

# 4. Daily development - just run this!
docker-compose up --build
```

### 💻 Local Development
```bash
# 1. Create .env with local configuration
# 2. Make sure PostgreSQL is running locally
# 3. Install dependencies
npm install
npx prisma generate

# 4. Setup database
npx prisma migrate dev --name init
npx prisma db seed

# 5. Run application
npm run build:tsc && npm run start:prod
```

🎉 **Your API will be running at `http://localhost:3000`**
