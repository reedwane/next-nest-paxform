# Appointment Booking API

A NestJS-based REST API for managing appointment bookings with Google Calendar integration and admin-only authentication.

## Features

- **Admin-Only Authentication** - JWT-based auth with role-based access control
- **Super Admin Seeding** - Auto-creates super admin from environment variables on startup
- **Appointment Management** - CRUD operations with 30-minute time slot validation
- **Google Calendar Integration** - Automatic event creation, updates, and deletions
- **User Management** - Admin user CRUD with super admin protection
- **Public Booking** - Public endpoint for creating appointments
- **Swagger Documentation** - Interactive API docs at `/api`

## Tech Stack

- **NestJS** - Progressive Node.js framework
- **TypeORM** - ORM with PostgreSQL
- **Passport JWT** - Authentication strategy
- **Google Calendar API** - Calendar event management
- **Swagger/OpenAPI** - API documentation

## Prerequisites

- Node.js 18+
- PostgreSQL database
- Google Cloud project with Calendar API enabled

## Installation

```bash
npm install
```

## Environment Setup

Create a `.env` file based on `.env.example`:

```env
# Database
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_NAME=appointment_booking
DB_SYNCHRONIZE=true
DB_SSL=false

# JWT
JWT_SECRET=your-secret-key-change-this-in-production
JWT_EXPIRATION=24h

# Super Admin (Auto-created on first startup)
SUPER_ADMIN_EMAIL=admin@example.com
SUPER_ADMIN_PASSWORD=SuperAdmin123!

# Google Calendar API
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_REDIRECT_URI=http://localhost:3000/auth/google/callback
GOOGLE_REFRESH_TOKEN=your-refresh-token

# Application
PORT=3000
NODE_ENV=development
```

### Getting Google Calendar Credentials

1. Create a project in [Google Cloud Console](https://console.cloud.google.com/)
2. Enable Google Calendar API
3. Create OAuth 2.0 credentials (Web application)
4. Add redirect URI: `https://developers.google.com/oauthplayground`
5. Use [OAuth Playground](https://developers.google.com/oauthplayground/) to get refresh token:
   - Configure with your Client ID and Secret
   - Authorize `https://www.googleapis.com/auth/calendar`
   - Exchange code for tokens
   - Copy the `refresh_token`

## Running the Application

```bash
# Development
npm run start:dev

# Production
npm run build
npm run start:prod
```

The API will be available at `http://localhost:3000`

## API Documentation

Interactive Swagger docs: `http://localhost:3000/api`

## API Endpoints

### Public Endpoints

```
POST /auth/login          - Admin login (returns JWT token)
POST /appointments        - Create appointment (public booking)
```

### Protected Endpoints (Admin Only)

All endpoints below require JWT authentication with `isAdmin: true`

#### Appointments

```
GET    /appointments           - List all appointments (paginated)
GET    /appointments/:id       - Get appointment by ID
PATCH  /appointments/:id       - Update appointment
DELETE /appointments/:id       - Delete appointment
```

#### Users

```
GET    /users                  - List all users (paginated)
POST   /users                  - Create new admin user
GET    /users/:id              - Get user by ID
PATCH  /users/:id              - Update user
DELETE /users/:id              - Delete user
```

## Key Features Explained

### 1. Admin-Only Authentication

- Only users with `isAdmin: true` can authenticate
- JWT guard enforces admin status globally
- Super admin cannot be updated or deleted

### 2. Super Admin Seeding

On application startup, a super admin is automatically created if:

- `SUPER_ADMIN_EMAIL` and `SUPER_ADMIN_PASSWORD` are set in `.env`
- No user with that email exists

### 3. Appointment Time Slot Validation

- Prevents overlapping bookings within 30-minute windows
- Validates on creation and update
- Returns 409 Conflict if slot is unavailable

### 4. Google Calendar Sync

- **Create**: Appointment creation triggers Google Calendar event
- **Update**: Changes sync to existing calendar event
- **Delete**: Removes event from calendar
- Email notifications sent to attendees automatically

### 5. Protected Super Admin

The super admin account (defined in `.env`) is protected:

- Cannot be updated via API
- Cannot be deleted via API
- Ensures at least one admin always has access

## Query Parameters

Both appointments and users support pagination and filtering:

```
?_page=1              - Page number (default: 1)
?_limit=10            - Items per page (default: 10)
?_sort=createdAt      - Sort field
?_order=DESC          - Sort order (ASC/DESC)
?email=user@email.com - Filter by exact email
?email_like=user      - Search by email (case-insensitive)
?name_like=john       - Search by name (case-insensitive)
```

## Database Schema

### Users Table

```typescript
{
  id: UUID(PK);
  email: string(unique);
  password: string(hashed);
  isAdmin: boolean;
  createdAt: timestamp;
  updatedAt: timestamp;
}
```

### Appointments Table

```typescript
{
  id: UUID(PK);
  name: string;
  email: string;
  appointmentDateTime: timestamp;
  notes: string(nullable);
  googleEventId: string(nullable);
  createdAt: timestamp;
}
```

## Security

- Passwords hashed with bcrypt (salt rounds: 10)
- JWT tokens expire after 24 hours (configurable)
- Admin-only access enforced at guard level
- Super admin protected from modifications
- Input validation on all DTOs

## Error Handling

Standard HTTP status codes:

- `200` - Success
- `201` - Created
- `400` - Bad Request (validation errors)
- `401` - Unauthorized (invalid/missing token)
- `403` - Forbidden (non-admin or super admin protection)
- `404` - Not Found
- `409` - Conflict (duplicate email, time slot unavailable)

## Development

```bash
# Run in watch mode
npm run start:dev

# Run tests
npm run test

# Lint
npm run lint

# Format
npm run format
```

## Project Structure

```
src/
├── appointment/
│   ├── dto/                    # Data transfer objects
│   ├── entities/               # TypeORM entities
│   ├── appointment.controller.ts
│   ├── appointment.service.ts
│   ├── appointment.module.ts
│   └── google-calendar.service.ts
├── auth/
│   ├── decorators/             # Custom decorators (@Public)
│   ├── dto/                    # Login DTOs
│   ├── guards/                 # JWT auth guard
│   ├── strategies/             # Passport strategies
│   ├── auth.controller.ts
│   ├── auth.service.ts
│   ├── auth.module.ts
│   └── seed.service.ts         # Super admin seeding
├── user/
│   ├── dto/                    # User DTOs
│   ├── entities/               # User entity
│   ├── user.controller.ts
│   ├── user.service.ts
│   └── user.module.ts
├── common/
│   └── decorators/             # Shared decorators (pagination, query)
├── config/
│   ├── database.config.ts      # TypeORM/Database configuration
│   └── jwt.config.ts           # JWT configuration
├── app.module.ts
└── main.ts
```

## License

MIT
