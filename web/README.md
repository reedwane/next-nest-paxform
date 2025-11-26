# Appointment Booking System - Frontend

Next.js 15 frontend application for the appointment booking system with admin dashboard.

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: React Context + TanStack Query
- **Forms**: React Hook Form
- **Icons**: Lucide React

## Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment

Create `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:3000
```

### 3. Run Development Server

```bash
npm run dev
```

Access at http://localhost:3000

## Project Structure

```
app/
├── (public)/
│   ├── page.tsx              # Public appointment booking form
│   └── login/                # Admin login page
├── admin/
│   ├── layout.tsx            # Protected route wrapper
│   ├── dashboard/            # Appointments management
│   │   ├── page.tsx
│   │   └── components/       # Dashboard components
│   └── users/                # User management
│       ├── page.tsx
│       └── components/       # User components
├── provider.tsx              # React Query + Auth providers
└── layout.tsx                # Root layout

components/
└── ProtectedRoute.tsx        # Auth guard component

contexts/
└── AuthContext.tsx           # Authentication context

hooks/
├── useAppointments.ts        # Appointments queries/mutations
└── useUsers.ts               # Users queries/mutations

lib/
└── api.ts                    # API client

types/
└── index.ts                  # TypeScript types
```

## Features

### Public

- **Appointment Booking**: Form to create appointments with validation
- **Admin Login**: JWT-based authentication

### Admin Dashboard

- **Appointments Management**: View and delete appointments
- **User Management**: Create and manage admin users
- **Protected Routes**: Automatic redirect if not authenticated
- **Real-time Updates**: React Query auto-refetch on mutations

## Key Components

### Data Fetching (React Query)

- Automatic caching and background refetching
- Optimistic updates
- Cache invalidation on mutations

### Authentication

- JWT token stored in localStorage
- Context-based auth state
- Protected route wrapper

### Component Architecture

- Page components orchestrate logic
- Presentational components for UI
- Custom hooks for data fetching
- Shared components in `/components`

## Development

```bash
# Run dev server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Lint code
npm run lint
```

## Environment Variables

| Variable              | Description     | Default                 |
| --------------------- | --------------- | ----------------------- |
| `NEXT_PUBLIC_API_URL` | Backend API URL | `http://localhost:3000` |
