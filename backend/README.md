# Vanguard Men's Fashion E-Commerce — REST API Backend

Production-grade REST API backend built for the Vanguard Luxury Menswear E-Commerce platform per specifications in `store.md`.

## Features

- **Clean Architecture**: Decoupled `controllers`, `services`, `routes`, `middlewares`, `validators`, `types`, and `config`.
- **Database**: PostgreSQL with Prisma ORM (13 tables, complete relations, indexes, cascade rules).
- **Offline / Development Resilience**: In-memory repository fallback keeps the server, Swagger UI, and tests 100% operational even before starting PostgreSQL.
- **Authentication**: JWT token authentication with bcrypt password hashing and role-based access control (`USER`, `ADMIN`).
- **Validation**: Strict runtime validation using Zod on all incoming requests returning standardized HTTP 422 errors.
- **Security**: Helmet security headers, CORS protection, and IP rate limiting on API & auth endpoints.
- **Interactive Documentation**: Swagger / OpenAPI 3.0 documentation served at `/api-docs`.
- **Testing**: Complete automated test suite using Jest and Supertest.

---

## Getting Started

### 1. Environment Variables

Create `.env` (or copy from `.env.example`):

```env
PORT=5000
NODE_ENV=development
DATABASE_URL="postgresql://postgres:postgrespassword@localhost:5432/mens_fashion_store?schema=public"
JWT_SECRET=super_secret_jwt_key_mens_fashion_2026_demo
JWT_EXPIRES_IN=7d
FRONTEND_URL=http://localhost:3000
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Database Migration & Seeding (PostgreSQL)

If PostgreSQL is running locally or via Docker:

```bash
# Push schema to PostgreSQL database
npm run prisma:push

# Seed admin, demo customers, 7 categories, 35+ products, and variants
npm run prisma:seed
```

Or execute the raw SQL schema and seed scripts:

```bash
psql -U postgres -d mens_fashion_store -f sql/schema.sql
```

### 4. Run Development Server

```bash
npm run dev
```

The API will be available at:
- Base API: `http://localhost:5000/api`
- Swagger UI: `http://localhost:5000/api-docs`
- Health Check: `http://localhost:5000/health`

### 5. Run Test Suite

```bash
npm test
```

---

## Seed Demo Credentials

| Role | Email | Password |
|---|---|---|
| **Admin** | `admin@example.com` | `Admin@123456` |
| **Customer** | `customer@example.com` | `Password@123456` |
| **Customer 2** | `julian@example.com` | `Password@123456` |
