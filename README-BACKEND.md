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

## 🐳 Option A: Docker Development

### Prerequisites for Docker
- **Docker** and **Docker Compose** installed

### Setup with Docker
1. Make sure you're using the **Docker .env configuration** (Option B above)
2. Start the services:

```bash
# Start PostgreSQL database in Docker
docker-compose up -d db

# Run database migrations
npx prisma migrate dev --name init

# (Optional) Seed the database
npx prisma db seed
```

### Running with Docker
```bash
# Development mode
npm run build:tsc && npm run start:prod

# OR build and run the entire application in Docker
docker-compose up --build
```

### Docker Commands
```bash
# Start only database
docker-compose up -d db

# Start all services (database + API)
docker-compose up

# Start all services in background
docker-compose up -d

# Stop all services
docker-compose down

# View logs
docker-compose logs -f

# View specific service logs
docker-compose logs -f db
docker-compose logs -f app

# Rebuild containers
docker-compose up --build

# Remove all containers and volumes
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

### Docker Development (Recommended for beginners)
```bash
# 1. Create .env with Docker configuration (Option B)
# 2. Install dependencies
npm install
npx prisma generate

# 3. Start database
docker-compose up -d db

# 4. Setup database
npx prisma migrate dev --name init

# 5. Run application
npm run build:tsc && npm run start:prod
```

### Local Development
```bash
# 1. Create .env with local configuration (Option A)
# 2. Make sure PostgreSQL is running locally
# 3. Install dependencies
npm install
npx prisma generate

# 4. Setup database
npx prisma migrate dev --name init

# 5. Run application
npm run build:tsc && npm run start:prod
```

🎉 **Your API will be running at `http://localhost:3000`**
