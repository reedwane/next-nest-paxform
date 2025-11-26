# Appointment Booking System

Full-stack appointment booking application with admin dashboard and Google Calendar integration.

## Overview

- **Backend**: NestJS REST API with PostgreSQL and Google Calendar sync
- **Frontend**: Next.js 15 with TypeScript and TailwindCSS
- **Authentication**: JWT-based admin authentication
- **Deployment**: Docker Compose ready

## Quick Start

### Prerequisites

- Node.js 18+
- PostgreSQL 15+
- Google Calendar API credentials

### Local Development

#### 1. Backend Setup

```bash
cd api
npm install
cp .env.example .env
# Edit .env with your configuration
npm run start:dev
```

Backend runs at http://localhost:3000

#### 2. Frontend Setup

```bash
cd web
npm install
cp .env.local.example .env.local
# Edit .env.local with API URL
npm run dev
```

Frontend runs at http://localhost:3001

### Docker Deployment

```bash
# Configure environment
cp .env.docker.example .env.docker
# Edit .env.docker with your values

# Start all services
docker-compose --env-file .env.docker up -d
```

- Frontend: http://localhost:3001
- Backend: http://localhost:3000
- API Docs: http://localhost:3000/api

## Project Structure

```
├── api/                    # NestJS backend
│   ├── src/
│   │   ├── appointment/    # Appointment module
│   │   ├── auth/           # Authentication & seeding
│   │   ├── user/           # User management
│   │   └── config/         # Configuration files
│   ├── Dockerfile
│   └── README.md           # Backend documentation
│
├── web/                    # Next.js frontend
│   ├── app/
│   │   ├── admin/          # Admin dashboard
│   │   ├── login/          # Login page
│   │   └── page.tsx        # Public booking form
│   ├── components/         # Shared components
│   ├── hooks/              # React Query hooks
│   ├── Dockerfile
│   └── README.md           # Frontend documentation
│
├── docker-compose.yml      # Docker orchestration
├── .env.docker.example     # Docker environment template
└── DOCKER.md               # Docker deployment guide
```

## Features

### Public Features

- **Appointment Booking**: 30-minute time slot booking with validation
- **Google Calendar Sync**: Automatic event creation

### Admin Features

- **Dashboard**: View and manage all appointments
- **User Management**: Create and manage admin users
- **Super Admin Protection**: Cannot delete super admin
- **Calendar Integration**: Sync updates/deletions with Google Calendar

## Tech Stack

### Backend

- NestJS
- TypeORM + PostgreSQL
- Passport JWT
- Google Calendar API
- Swagger/OpenAPI

### Frontend

- Next.js 15 (App Router)
- TypeScript
- TailwindCSS
- TanStack Query
- React Hook Form

## Documentation

- **Backend API**: [api/README.md](api/README.md)
- **Frontend**: [web/README.md](web/README.md)
- **Docker Deployment**: [DOCKER.md](DOCKER.md)

## Environment Variables

### Backend (api/.env)

```env
# Database
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_NAME=appointment_booking

# JWT
JWT_SECRET=your-secret-key
JWT_EXPIRATION=24h

# Super Admin
SUPER_ADMIN_EMAIL=admin@example.com
SUPER_ADMIN_PASSWORD=YourPassword123!

# Google Calendar
GOOGLE_CLIENT_ID=your-client-id
GOOGLE_CLIENT_SECRET=your-client-secret
GOOGLE_REDIRECT_URI=http://localhost:3000/auth/google/callback
GOOGLE_REFRESH_TOKEN=your-refresh-token
```

### Frontend (web/.env.local)

```env
NEXT_PUBLIC_API_URL=http://localhost:3000
```

## API Endpoints

### Public

- `POST /appointments` - Create appointment
- `POST /auth/login` - Admin login

### Admin (requires JWT)

- `GET /appointments` - List all appointments
- `DELETE /appointments/:id` - Delete appointment
- `GET /users` - List all users
- `POST /users` - Create admin user
- `DELETE /users/:id` - Delete user

Full API documentation: http://localhost:3000/api

## Development

```bash
# Backend
cd api && npm run start:dev

# Frontend
cd web && npm run dev

# Run tests
cd api && npm test
```

## Production Deployment

1. **Configure environment variables** for production
2. **Set strong passwords** for JWT_SECRET and SUPER_ADMIN_PASSWORD
3. **Use HTTPS** with reverse proxy (Nginx/Traefik)
4. **Update Google Calendar redirect URI** to production URL
5. **Use managed database** (AWS RDS, Azure Database)

See [DOCKER.md](DOCKER.md) for detailed deployment instructions.

## License

MIT
