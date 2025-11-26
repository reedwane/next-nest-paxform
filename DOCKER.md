# Docker Deployment Guide

Run the Appointment Booking System using Docker and Docker Compose.

## Prerequisites

- Docker Engine 20.10+
- Docker Compose 2.0+

## Quick Start

### 1. Configure Environment

```bash
cp .env.docker.example .env.docker
```

Edit `.env.docker` with your values (see `.env.docker.example` for all required variables).

### 2. Run

```bash
# Start all services
docker-compose --env-file .env.docker up -d

# View logs
docker-compose logs -f
```

### 3. Access

- **Frontend**: http://localhost:3001
- **Backend API**: http://localhost:3000
- **API Docs**: http://localhost:3000/api

## Services

- **PostgreSQL**: Port 5432 (database: `appointment_booking`)
- **NestJS API**: Port 3000
- **Next.js Web**: Port 3001

## Common Commands

```bash
# Stop services
docker-compose down

# Rebuild and restart
docker-compose up -d --build

# View logs
docker-compose logs -f api
docker-compose logs -f web

# Access database
docker-compose exec postgres psql -U postgres -d appointment_booking

# Backup database
docker-compose exec postgres pg_dump -U postgres appointment_booking > backup.sql

# Restore database
docker-compose exec -T postgres psql -U postgres appointment_booking < backup.sql
```

## Troubleshooting

```bash
# Check service status
docker-compose ps

# View API logs
docker-compose logs api

# Restart service
docker-compose restart api

# Clean restart
docker-compose down -v
docker-compose up -d --build
```

## Production Deployment

1. **Change default credentials** in `.env.docker`:

   - `JWT_SECRET`
   - `SUPER_ADMIN_PASSWORD`
   - PostgreSQL password

2. **Use HTTPS** with a reverse proxy (Nginx/Traefik)

3. **Update Google Calendar redirect URI** to use HTTPS

4. **Consider managed database** (AWS RDS, Azure Database) for production
