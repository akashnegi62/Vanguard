# Vanguard Men's Fashion E-Commerce — REST API Backend

Production-grade REST API backend built for the Vanguard Luxury Menswear E-Commerce platform per specifications in `store.md`.

## Features

- **Database**: PostgreSQL on **Supabase** via **Prisma ORM** (13 tables, complete relations, indexes, cascade rules).
- **Supabase Integration**: Direct and pooled connections (Supavisor connection pooler), plus `@supabase/supabase-js` SDK integration.
- **Clean Architecture**: Decoupled `controllers`, `services`, `routes`, `middlewares`, `validators`, `types`, and `config`.
- **Offline / Development Resilience**: In-memory repository fallback keeps the server, Swagger UI, and tests 100% operational even before configuring your live Supabase database.
- **Authentication**: JWT token authentication with bcrypt password hashing and role-based access control (`USER`, `ADMIN`).
- **Validation**: Strict runtime validation using Zod on all incoming requests returning standardized HTTP 422 errors.
- **Security**: Helmet security headers, CORS protection, and IP rate limiting on API & auth endpoints.
- **Interactive Documentation**: Swagger / OpenAPI 3.0 documentation served at `/api-docs`.
- **Testing**: Complete automated test suite using Jest and Supertest (12/12 passing).

---

## Setting Up with Supabase

### 1. Create a Project on Supabase
1. Go to [supabase.com](https://supabase.com) and create a free project.
2. In your Supabase Dashboard, navigate to **Project Settings** > **Database**.
3. Under **Connection string**:
   - Select **URI** and copy the connection string.
   - For **Transaction Pooler** (Port 6543), set as `DATABASE_URL`.
   - For **Session / Direct connection** (Port 5432), set as `DIRECT_URL`.

### 2. Configure `backend/.env`

```env
PORT=5001
NODE_ENV=development

# Supabase PostgreSQL Connection Strings
DATABASE_URL="postgresql://postgres.[YOUR-PROJECT-REF]:[YOUR-PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres.[YOUR-PROJECT-REF]:[YOUR-PASSWORD]@aws-0-[REGION].pooler.supabase.com:5432/postgres"

# Supabase API Credentials (from Settings > API)
SUPABASE_URL=https://[YOUR-PROJECT-REF].supabase.co
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

JWT_SECRET=super_secret_jwt_key_mens_fashion_2026_demo
JWT_EXPIRES_IN=7d
FRONTEND_URL=http://localhost:3000
```

### 3. Push Schema to Supabase

Run the Prisma push command:

```bash
npm run prisma:push
```

This will automatically create all 13 tables, types, and indexes in your Supabase database:
- `users`, `categories`, `products`, `product_images`, `product_variants`
- `addresses`, `cart`, `cart_items`, `orders`, `order_items`
- `reviews`, `wishlist`, `wishlist_items`

*Alternatively, you can copy the contents of `sql/schema.sql` into the Supabase Dashboard **SQL Editor** and click "Run".*

### 4. Seed Demo Data to Supabase

```bash
npm run prisma:seed
```

This seeds:
- 1 Admin (`admin@example.com` / `Admin@123456`)
- 3 Customer accounts (`customer@example.com` / `Password@123456`)
- 7 Categories (`t-shirts`, `shirts`, `jeans`, `trousers`, `jackets`, `hoodies`, `shorts`)
- 10+ Complete Products with multiple variants (sizes, colors, stock, SKU) and images
- Sample customer orders, addresses, and product reviews.

---

## Running the Application

### Development (Hot-Reload)
```bash
npm run dev
```

### Production Build
```bash
npm run build
npm start
```

- Base API: `http://localhost:5001/api`
- Swagger Documentation: `http://localhost:5001/api-docs`
- Health Check: `http://localhost:5001/health`

### Run Tests
```bash
npm test
```
