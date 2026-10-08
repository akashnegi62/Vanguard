# Men's Fashion E-Commerce — AI Agent Project Specification

## 1. Project Overview

Build a production-style, assignment-ready men's clothing e-commerce website with:

- Customer-facing storefront
- Admin dashboard
- REST API backend
- PostgreSQL database
- Authentication and authorization
- Product/catalog management
- Cart and checkout
- Order management
- Deployment-ready configuration

The goal is to demonstrate practical full-stack development skills, clean architecture, database design, REST APIs, authentication, CRUD operations, and deployment.

---

# 2. Tech Stack

## Frontend

- Next.js
- TypeScript
- React
- Tailwind CSS
- Zustand for client state
- React Hook Form
- Zod
- Fetch or Axios

## Backend

- Node.js
- Express.js
- TypeScript preferred
- REST API
- JWT authentication
- bcrypt for password hashing
- Zod or equivalent backend validation
- Helmet
- CORS
- Rate limiting

## Database

- PostgreSQL
- Supabase for hosting PostgreSQL

## Deployment

- Frontend: Vercel
- Backend: Render
- Database: Supabase
- Source control: GitHub

## Documentation / Testing

- Swagger / OpenAPI
- Jest
- Supertest
- React Testing Library

---

# 3. Product Scope

The website sells men's clothing only.

Initial categories:

- T-Shirts
- Shirts
- Jeans
- Trousers
- Jackets
- Hoodies
- Shorts

The design should be modern, clean, responsive, and suitable for a fashion e-commerce brand.

---

# 4. User Roles

Implement two roles:

```text
USER
ADMIN
```

## USER

Can:

- Register
- Login
- Logout
- Browse products
- Search products
- Filter products
- Sort products
- View product details
- Add products to cart
- Update cart
- Checkout
- Place orders
- View order history
- Manage profile
- Manage addresses
- Add reviews
- Manage wishlist

## ADMIN

Can:

- Login
- View dashboard
- Manage products
- Manage categories
- Manage product stock
- Manage users
- Manage orders
- Update order status
- View sales/revenue
- View dashboard statistics

---

# 5. Customer Frontend Pages

## Public Pages

```text
/
 /products
 /products/[slug]
 /login
 /register
```

## Customer Pages

```text
/cart
/checkout
/orders
/orders/[id]
/profile
/wishlist
```

## Admin Pages

```text
/admin
/admin/products
/admin/products/new
/admin/products/[id]/edit
/admin/categories
/admin/orders
/admin/orders/[id]
/admin/users
```

---

# 6. Home Page

Create:

- Navbar
- Brand logo
- Search bar
- Category navigation
- Login/Register
- Cart icon
- Hero section
- Featured products
- New arrivals
- Best sellers
- Category cards
- Promotional section
- Footer

The home page should be responsive for:

- Mobile
- Tablet
- Desktop

---

# 7. Product Listing

Route:

```text
/products
```

Features:

- Product grid
- Product cards
- Product image
- Product name
- Original price
- Discount price
- Discount percentage
- Rating
- Add to cart
- Wishlist button
- Search
- Filtering
- Sorting
- Pagination

## Filters

Support:

- Category
- Size
- Color
- Price range
- Brand
- Rating

## Sorting

Support:

- Newest
- Price low to high
- Price high to low
- Highest rated
- Best selling

---

# 8. Product Details

Route:

```text
/products/[slug]
```

Show:

- Product images
- Product name
- Description
- Brand
- Price
- Discount price
- Discount percentage
- Available sizes
- Available colors
- Stock
- Quantity selector
- Add to cart
- Buy now
- Wishlist
- Reviews
- Related products

Product variants should support combinations such as:

```text
Size: M
Color: Black
Stock: 15
```

---

# 9. Authentication

Implement:

- Register
- Login
- Logout
- Get current user
- JWT authentication
- Password hashing with bcrypt
- Protected routes
- Admin authorization
- Role-based access control

Backend middleware:

```text
authMiddleware
adminMiddleware
```

Never trust frontend role information for authorization. Authorization must be enforced on the backend.

---

# 10. Cart

Route:

```text
/cart
```

Features:

- Add product
- Select size/color variant
- Remove product
- Increase quantity
- Decrease quantity
- Update quantity
- Clear cart
- Calculate subtotal
- Calculate shipping
- Calculate discount
- Calculate total

For authenticated users, persist the cart in PostgreSQL.

---

# 11. Checkout

Route:

```text
/checkout
```

Collect:

- Customer name
- Email
- Phone
- Shipping address
- City
- State
- Postal code
- Country
- Payment method

For the assignment MVP:

```text
Cash on Delivery
Test Payment
```

A real payment gateway is optional.

---

# 12. Orders

Customer order page:

```text
/orders
```

Order detail:

```text
/orders/[id]
```

Order statuses:

```text
PENDING
CONFIRMED
PROCESSING
SHIPPED
DELIVERED
CANCELLED
```

Payment statuses:

```text
PENDING
PAID
FAILED
REFUNDED
```

Customer can:

- View order history
- View order details
- View products
- View quantities
- View total
- View payment status
- View order status

---

# 13. User Profile

Route:

```text
/profile
```

Features:

- View profile
- Update name
- Update phone
- Change password
- Manage addresses
- View order history

---

# 14. Wishlist

Route:

```text
/wishlist
```

Features:

- Add product
- Remove product
- View wishlist
- Move product to cart

---

# 15. Product Reviews

Customers can review purchased products.

Fields:

```text
rating
comment
user_id
product_id
created_at
updated_at
```

Rules:

- Rating: 1–5
- User should only be allowed to review a product they purchased
- One review per user/product is recommended

---

# 16. Admin Dashboard

Route:

```text
/admin
```

Dashboard statistics:

- Total users
- Total products
- Total orders
- Total revenue
- Pending orders
- Delivered orders
- Recent orders
- Recent users
- Sales overview

Example dashboard cards:

```text
Users
Products
Orders
Revenue
```

Add a simple sales chart if practical.

---

# 17. Admin Product Management

Route:

```text
/admin/products
```

Features:

- View products
- Search products
- Filter products
- Pagination
- Add product
- Edit product
- Delete product
- Activate/deactivate product
- Manage stock
- Manage variants
- Upload/manage product images

Product fields:

```text
name
slug
description
price
discount_price
category_id
brand
is_featured
is_active
created_at
updated_at
```

---

# 18. Admin Category Management

Route:

```text
/admin/categories
```

Features:

- List categories
- Add category
- Edit category
- Delete category
- Activate/deactivate category

Initial categories:

```text
T-Shirts
Shirts
Jeans
Trousers
Jackets
Hoodies
Shorts
```

---

# 19. Admin Order Management

Route:

```text
/admin/orders
```

Features:

- List orders
- Search orders
- Filter orders
- Pagination
- View order details
- Update order status
- Update payment status
- Cancel order

---

# 20. Admin User Management

Route:

```text
/admin/users
```

Features:

- List users
- Search users
- View user details
- Activate/deactivate user
- View order history
- Change role where appropriate

---

# 21. Database Design

Use PostgreSQL.

Recommended tables:

```text
users
categories
products
product_images
product_variants
addresses
cart
cart_items
orders
order_items
reviews
wishlist
wishlist_items
```

## users

```text
id
name
email
password_hash
phone
role
is_active
created_at
updated_at
```

Constraints:

- Primary key on id
- Unique email
- Valid role
- Timestamps

## categories

```text
id
name
slug
description
image_url
is_active
created_at
updated_at
```

## products

```text
id
name
slug
description
price
discount_price
category_id
brand
is_featured
is_active
created_at
updated_at
```

## product_images

```text
id
product_id
image_url
alt_text
sort_order
created_at
```

## product_variants

```text
id
product_id
size
color
stock
sku
created_at
updated_at
```

## addresses

```text
id
user_id
name
phone
address_line1
address_line2
city
state
postal_code
country
is_default
created_at
updated_at
```

## cart

```text
id
user_id
created_at
updated_at
```

## cart_items

```text
id
cart_id
product_id
variant_id
quantity
created_at
updated_at
```

## orders

```text
id
user_id
total_amount
shipping_amount
discount_amount
payment_method
payment_status
order_status
shipping_address_id
created_at
updated_at
```

## order_items

Store the purchase snapshot so historical orders are not affected by future product changes.

```text
id
order_id
product_id
variant_id
product_name
size
color
quantity
unit_price
subtotal
created_at
```

## reviews

```text
id
user_id
product_id
rating
comment
created_at
updated_at
```

Recommended constraint:

```text
UNIQUE(user_id, product_id)
```

## wishlist

```text
id
user_id
created_at
```

## wishlist_items

```text
id
wishlist_id
product_id
created_at
```

---

# 22. Database Relationships

```text
users
 |
 +-- addresses
 |
 +-- cart
 |     |
 |     +-- cart_items
 |
 +-- orders
 |     |
 |     +-- order_items
 |
 +-- reviews
 |
 +-- wishlist
       |
       +-- wishlist_items

categories
 |
 +-- products
       |
       +-- product_images
       |
       +-- product_variants
```

Use:

- Primary keys
- Foreign keys
- Unique constraints
- NOT NULL constraints
- Indexes
- Transactions where needed

---

# 23. Backend REST API

Base URL:

```text
/api
```

## Authentication

```http
POST /api/auth/register
POST /api/auth/login
POST /api/auth/logout
GET  /api/auth/me
```

## Users

```http
GET /api/users/profile
PUT /api/users/profile
PUT /api/users/password
```

## Products

```http
GET    /api/products
GET    /api/products/:id
POST   /api/products
PUT    /api/products/:id
DELETE /api/products/:id
```

Product listing should support query parameters:

```text
/api/products?page=1&limit=12
/api/products?search=tshirt
/api/products?category=shirts
/api/products?minPrice=500&maxPrice=2000
/api/products?sort=price_asc
```

## Categories

```http
GET    /api/categories
GET    /api/categories/:id
POST   /api/categories
PUT    /api/categories/:id
DELETE /api/categories/:id
```

## Cart

```http
GET    /api/cart
POST   /api/cart/items
PUT    /api/cart/items/:itemId
DELETE /api/cart/items/:itemId
DELETE /api/cart
```

## Orders

```http
POST /api/orders
GET  /api/orders
GET  /api/orders/:id
```

## Reviews

```http
GET    /api/products/:id/reviews
POST   /api/products/:id/reviews
PUT    /api/reviews/:id
DELETE /api/reviews/:id
```

## Wishlist

```http
GET    /api/wishlist
POST   /api/wishlist/items
DELETE /api/wishlist/items/:productId
```

## Admin

```http
GET /api/admin/dashboard
GET /api/admin/users
GET /api/admin/orders
PUT /api/admin/orders/:id/status
PUT /api/admin/orders/:id/payment-status
```

---

# 24. API Standards

Use consistent JSON responses.

Success example:

```json
{
  "success": true,
  "message": "Products fetched successfully",
  "data": []
}
```

Error example:

```json
{
  "success": false,
  "message": "Product not found",
  "error": "PRODUCT_NOT_FOUND"
}
```

Use proper HTTP status codes:

```text
200 OK
201 Created
400 Bad Request
401 Unauthorized
403 Forbidden
404 Not Found
409 Conflict
422 Unprocessable Entity
500 Internal Server Error
```

---

# 25. Backend Folder Structure

Recommended:

```text
backend/
├── src/
│   ├── config/
│   │   └── database.ts
│   │
│   ├── controllers/
│   │   ├── auth.controller.ts
│   │   ├── product.controller.ts
│   │   ├── category.controller.ts
│   │   ├── cart.controller.ts
│   │   ├── order.controller.ts
│   │   ├── review.controller.ts
│   │   ├── wishlist.controller.ts
│   │   └── admin.controller.ts
│   │
│   ├── routes/
│   │   ├── auth.routes.ts
│   │   ├── product.routes.ts
│   │   ├── category.routes.ts
│   │   ├── cart.routes.ts
│   │   ├── order.routes.ts
│   │   ├── review.routes.ts
│   │   ├── wishlist.routes.ts
│   │   └── admin.routes.ts
│   │
│   ├── middleware/
│   │   ├── auth.middleware.ts
│   │   ├── admin.middleware.ts
│   │   ├── error.middleware.ts
│   │   └── rateLimit.middleware.ts
│   │
│   ├── services/
│   ├── validators/
│   ├── utils/
│   ├── types/
│   ├── app.ts
│   └── server.ts
│
├── tests/
├── .env
├── .env.example
├── package.json
└── README.md
```

---

# 26. Frontend Folder Structure

```text
frontend/
├── app/
│   ├── page.tsx
│   ├── products/
│   │   ├── page.tsx
│   │   └── [slug]/
│   │       └── page.tsx
│   │
│   ├── login/
│   │   └── page.tsx
│   ├── register/
│   │   └── page.tsx
│   ├── cart/
│   │   └── page.tsx
│   ├── checkout/
│   │   └── page.tsx
│   ├── orders/
│   │   ├── page.tsx
│   │   └── [id]/
│   │       └── page.tsx
│   ├── profile/
│   │   └── page.tsx
│   ├── wishlist/
│   │   └── page.tsx
│   │
│   └── admin/
│       ├── page.tsx
│       ├── products/
│       ├── categories/
│       ├── orders/
│       └── users/
│
├── components/
├── hooks/
├── lib/
│   └── api.ts
├── store/
├── types/
├── utils/
├── public/
├── .env.local
└── package.json
```

---

# 27. Frontend Components

Create reusable components:

```text
Navbar
Footer
SearchBar
CategoryNav
HeroSection
ProductCard
ProductGrid
ProductFilters
ProductSort
ProductGallery
ProductVariantSelector
QuantitySelector
AddToCartButton
WishlistButton
CartItem
CartSummary
CheckoutForm
AddressForm
OrderCard
OrderStatus
ReviewCard
ReviewForm
Pagination
LoadingSpinner
EmptyState
ErrorState
Modal
ConfirmDialog
AdminSidebar
AdminHeader
StatsCard
DataTable
```

Avoid duplicating UI logic.

---

# 28. State Management

Use Zustand for:

```text
cart state
user/auth state
wishlist state
```

Use server/API state appropriately instead of putting all backend data into global state.

Keep business logic outside UI components where possible.

---

# 29. Validation

Use React Hook Form + Zod on the frontend.

Validate:

- Register
- Login
- Product form
- Category form
- Address
- Checkout
- Review

Validate again on the backend.

Never trust frontend validation alone.

---

# 30. Security Requirements

Implement:

- bcrypt password hashing
- JWT authentication
- Backend authorization
- Admin role protection
- Input validation
- Parameterized SQL queries / safe database access
- Helmet
- CORS
- Rate limiting
- Secure environment variables
- Proper error handling
- No secrets committed to Git
- No database credentials in frontend
- No JWT secrets in frontend

Do not return password hashes from APIs.

---

# 31. Image Handling

Product images should not be stored directly in PostgreSQL.

Store image URLs.

For MVP, use a suitable image hosting/storage service.

Database:

```text
product_images.image_url
```

The frontend displays the URL.

If using Supabase Storage, organize files by product or UUID.

---

# 32. Pagination

Implement backend pagination.

Example:

```text
GET /api/products?page=1&limit=12
```

Response:

```json
{
  "success": true,
  "data": [],
  "pagination": {
    "page": 1,
    "limit": 12,
    "total": 86,
    "totalPages": 8
  }
}
```

---

# 33. Search and Filtering

Search should be handled by the backend.

Example:

```text
GET /api/products?search=black-shirt
```

Support:

- Search by product name
- Category
- Price range
- Size
- Color
- Brand
- Rating
- Sorting
- Pagination

Avoid fetching all products to the frontend and filtering everything client-side.

---

# 34. Order Transaction

Order creation should use a database transaction.

Conceptually:

```text
BEGIN TRANSACTION

1. Validate cart
2. Validate stock
3. Calculate total
4. Create order
5. Create order items
6. Reduce stock
7. Clear cart

COMMIT
```

If any important step fails:

```text
ROLLBACK
```

This prevents inconsistent orders and stock.

---

# 35. Admin Dashboard Calculations

Implement SQL queries for:

- Total users
- Total products
- Total orders
- Total revenue
- Pending orders
- Delivered orders
- Recent orders
- Sales by date

Example:

```sql
SELECT SUM(total_amount)
FROM orders
WHERE payment_status = 'PAID';
```

---

# 36. Swagger Documentation

Create:

```text
/api-docs
```

Document:

- Authentication
- Products
- Categories
- Cart
- Orders
- Reviews
- Wishlist
- Admin

Include:

- Request body
- Query parameters
- Path parameters
- Response examples
- Authentication requirements
- Error responses

---

# 37. Testing

## Backend tests

Test:

- Register
- Login
- Invalid login
- Protected endpoint
- Admin authorization
- Product CRUD
- Category CRUD
- Cart
- Order creation
- Stock validation

Use:

```text
Jest
Supertest
```

## Frontend tests

Test:

- Login form
- Product card
- Product listing
- Add to cart
- Cart quantity
- Checkout form
- Admin product form

Use:

```text
React Testing Library
```

---

# 38. Environment Variables

## Frontend

```env
NEXT_PUBLIC_API_URL=
```

## Backend

```env
PORT=
DATABASE_URL=
JWT_SECRET=
JWT_EXPIRES_IN=
FRONTEND_URL=
NODE_ENV=
```

Never commit real `.env` files.

Provide:

```text
.env.example
```

---

# 39. Deployment

## Frontend — Vercel

Requirements:

- Connect GitHub
- Configure Next.js
- Add environment variables
- Build successfully
- Production deployment

Example:

```env
NEXT_PUBLIC_API_URL=https://your-api.onrender.com
```

## Backend — Render

Requirements:

- Connect GitHub
- Node environment
- Build command
- Start command
- Environment variables
- CORS configuration
- Production database connection

Example:

```env
DATABASE_URL=
JWT_SECRET=
FRONTEND_URL=https://your-store.vercel.app
NODE_ENV=production
```

## Database — Supabase

Requirements:

- Create PostgreSQL project
- Configure database
- Run migrations
- Seed initial data
- Create indexes
- Configure connection string

---

# 40. Seed Data

Create seed data for the demo.

Minimum:

```text
1 admin
5–10 users
7 categories
30+ products
multiple product variants
multiple orders
sample reviews
```

Example admin:

```text
email: admin@example.com
password: use-a-demo-password
```

Do not hard-code production credentials.

---

# 41. Demo Data

Products should look realistic.

Example:

```text
Classic Black Oversized T-Shirt
Slim Fit Oxford Shirt
Regular Fit Blue Jeans
Premium Cotton Hoodie
Casual Linen Shirt
Classic Chino Trousers
Denim Jacket
```

Each product should have:

- Description
- Price
- Discount
- Category
- Images
- Sizes
- Colors
- Stock
- Rating

---

# 42. UI/UX Requirements

Design should be:

- Modern
- Clean
- Minimal
- Fashion-oriented
- Responsive
- Accessible

Desktop:

```text
Navbar
Hero
Product grid
Category sections
Footer
```

Mobile:

- Responsive navbar
- Mobile menu
- 2-column product grid where appropriate
- Responsive filters
- Touch-friendly buttons

Use loading states and empty states.

Examples:

```text
Loading products...
No products found
Your cart is empty
No orders yet
```

---

# 43. Error Handling

Frontend should gracefully handle:

- API unavailable
- Invalid login
- Product not found
- Out-of-stock product
- Failed checkout
- Unauthorized access
- Server errors

Backend should have a centralized error middleware.

Do not expose stack traces in production.

---

# 44. GitHub Structure

Recommended repository:

```text
mens-fashion-store/
├── frontend/
├── backend/
├── README.md
└── .gitignore
```

Suggested branches:

```text
main
develop
feature/auth
feature/products
feature/cart
feature/orders
feature/admin
```

Use meaningful commits:

```text
feat: add product API
feat: add JWT authentication
feat: add cart functionality
feat: add admin product CRUD
fix: resolve stock validation issue
```

---

# 45. README Requirements

README must contain:

1. Project overview
2. Features
3. Tech stack
4. Architecture
5. Folder structure
6. Database schema / ER diagram
7. API documentation
8. Environment variables
9. Local setup
10. Database setup
11. Seed instructions
12. Test instructions
13. Deployment instructions
14. Screenshots
15. Demo credentials
16. Future improvements

---

# 46. Development Rules for the AI Agent

The AI agent must follow these rules:

### Code quality

- Use TypeScript where practical.
- Use reusable components.
- Avoid duplicate code.
- Keep controllers thin.
- Put business logic in services.
- Keep database queries organized.
- Use clear naming.
- Use consistent API responses.
- Add error handling.
- Add validation.
- Add comments only when they improve understanding.

### Architecture

Prefer:

```text
Route
  ↓
Controller
  ↓
Service
  ↓
Database
```

Middleware should handle:

```text
Authentication
Authorization
Validation
Errors
Rate limiting
```

### Security

Never:

- Expose secrets
- Store plain-text passwords
- Trust client-side admin checks
- Put database credentials in frontend code
- Return password hashes
- Commit `.env`

### Database

Use:

- Foreign keys
- Constraints
- Indexes
- Transactions
- Normalized tables

Do not create unnecessary duplicated data.

---

# 47. Development Phases

Build the project incrementally.

## Phase 1 — Project Setup

- [ ] Create frontend
- [ ] Create backend
- [ ] Configure TypeScript
- [ ] Configure Tailwind
- [ ] Configure PostgreSQL
- [ ] Configure environment variables
- [ ] Configure Git

## Phase 2 — Database

- [ ] Create schema
- [ ] Create relationships
- [ ] Add constraints
- [ ] Add indexes
- [ ] Add migrations
- [ ] Add seed data

## Phase 3 — Backend Foundation

- [ ] Express setup
- [ ] Database connection
- [ ] Error middleware
- [ ] CORS
- [ ] Helmet
- [ ] Rate limiting
- [ ] API structure

## Phase 4 — Authentication

- [ ] Register
- [ ] Login
- [ ] JWT
- [ ] bcrypt
- [ ] Auth middleware
- [ ] Admin middleware
- [ ] Current user endpoint

## Phase 5 — Products

- [ ] Product CRUD
- [ ] Category CRUD
- [ ] Product variants
- [ ] Product images
- [ ] Search
- [ ] Filter
- [ ] Sort
- [ ] Pagination

## Phase 6 — Customer Store

- [ ] Home page
- [ ] Product listing
- [ ] Product details
- [ ] Search
- [ ] Filters
- [ ] Wishlist

## Phase 7 — Cart and Orders

- [ ] Cart
- [ ] Cart items
- [ ] Checkout
- [ ] Address
- [ ] Order creation
- [ ] Stock management
- [ ] Order history

## Phase 8 — Admin

- [ ] Dashboard
- [ ] Product management
- [ ] Category management
- [ ] User management
- [ ] Order management
- [ ] Revenue statistics

## Phase 9 — Reviews

- [ ] Product reviews
- [ ] Rating
- [ ] Review validation

## Phase 10 — Testing

- [ ] Backend tests
- [ ] API tests
- [ ] Frontend tests
- [ ] Error cases

## Phase 11 — Documentation

- [ ] Swagger
- [ ] README
- [ ] ER diagram
- [ ] API documentation
- [ ] Screenshots

## Phase 12 — Deployment

- [ ] Supabase
- [ ] Render
- [ ] Vercel
- [ ] Environment variables
- [ ] CORS
- [ ] Production testing

---

# 48. MVP Priority

If time is limited, implement in this order:

## Must Have

- Authentication
- Products
- Categories
- Product details
- Search
- Filter
- Cart
- Checkout
- Orders
- Admin login
- Admin dashboard
- Product CRUD
- Category CRUD
- Order management
- User management
- PostgreSQL
- REST API
- Deployment

## Should Have

- Wishlist
- Reviews
- Ratings
- Pagination
- Image upload
- Dashboard charts
- Swagger
- Forgot password

## Optional

- Razorpay/Stripe
- Coupons
- Email notifications
- Product recommendations
- Recently viewed
- Multiple admin roles
- Advanced analytics

---

# 49. Definition of Done

The project is considered complete only when:

- [ ] Customer can register
- [ ] Customer can login
- [ ] Customer can browse products
- [ ] Customer can search products
- [ ] Customer can filter products
- [ ] Customer can view product details
- [ ] Customer can select size/color
- [ ] Customer can add products to cart
- [ ] Customer can update cart
- [ ] Customer can checkout
- [ ] Customer can create an order
- [ ] Customer can view order history
- [ ] Customer can manage profile
- [ ] Admin can login
- [ ] Admin dashboard works
- [ ] Admin can CRUD products
- [ ] Admin can CRUD categories
- [ ] Admin can manage users
- [ ] Admin can manage orders
- [ ] Stock is validated
- [ ] Authentication works
- [ ] Authorization works
- [ ] Database relationships work
- [ ] API validation works
- [ ] Error handling works
- [ ] Swagger works
- [ ] Tests pass
- [ ] Frontend deployed on Vercel
- [ ] Backend deployed on Render
- [ ] PostgreSQL deployed on Supabase
- [ ] README is complete
- [ ] Production environment variables are configured
- [ ] No secrets are committed

---

# 50. Important Scope Rule

Do not over-engineer the assignment.

Prioritize:

```text
Working Features
    >
Clean Architecture
    >
Good Database Design
    >
Security
    >
Responsive UI
    >
Testing
    >
Extra Features
```

Build a complete, polished MVP first. Only add optional features after the core customer and admin workflows are stable.
