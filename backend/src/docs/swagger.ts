export const swaggerDocument = {
  openapi: '3.0.0',
  info: {
    title: "Vanguard Men's Fashion E-Commerce REST API",
    version: '1.0.0',
    description: 'Production-ready REST API for luxury menswear store featuring products, categories, cart, orders, wishlist, reviews, and admin management.',
    contact: {
      name: 'Vanguard Engineering Team',
      email: 'engineering@vanguardstore.com',
    },
  },
  servers: [
    {
      url: 'http://localhost:5000',
      description: 'Local Development Server',
    },
  ],
  components: {
    securitySchemes: {
      BearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Enter your JWT token obtained from /api/auth/login or /api/auth/register',
      },
    },
  },
  paths: {
    '/api/auth/register': {
      post: {
        summary: 'Register a new customer account',
        tags: ['Authentication'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['name', 'email', 'password'],
                properties: {
                  name: { type: 'string', example: 'Alexander Wright' },
                  email: { type: 'string', example: 'alexander@example.com' },
                  password: { type: 'string', example: 'Password@123456' },
                  phone: { type: 'string', example: '+91 98765 43210' },
                },
              },
            },
          },
        },
        responses: {
          201: { description: 'User created successfully with auth token' },
          422: { description: 'Validation error' },
          400: { description: 'Email already registered' },
        },
      },
    },
    '/api/auth/login': {
      post: {
        summary: 'Log in customer or admin',
        tags: ['Authentication'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['email', 'password'],
                properties: {
                  email: { type: 'string', example: 'admin@example.com' },
                  password: { type: 'string', example: 'Admin@123456' },
                },
              },
            },
          },
        },
        responses: {
          200: { description: 'Login successful' },
          401: { description: 'Invalid email or password' },
        },
      },
    },
    '/api/auth/me': {
      get: {
        summary: 'Get currently authenticated user',
        tags: ['Authentication'],
        security: [{ BearerAuth: [] }],
        responses: {
          200: { description: 'Current user profile details' },
          401: { description: 'Unauthorized' },
        },
      },
    },
    '/api/products': {
      get: {
        summary: 'List products with filters & pagination',
        tags: ['Products'],
        parameters: [
          { name: 'page', in: 'query', schema: { type: 'integer', default: 1 } },
          { name: 'limit', in: 'query', schema: { type: 'integer', default: 12 } },
          { name: 'search', in: 'query', schema: { type: 'string' } },
          { name: 'category', in: 'query', schema: { type: 'string', example: 't-shirts' } },
          { name: 'minPrice', in: 'query', schema: { type: 'number' } },
          { name: 'maxPrice', in: 'query', schema: { type: 'number' } },
          { name: 'sort', in: 'query', schema: { type: 'string', enum: ['price_asc', 'price_desc', 'newest', 'rating', 'featured'] } },
        ],
        responses: {
          200: { description: 'List of matching products' },
        },
      },
      post: {
        summary: 'Create a new product (Admin only)',
        tags: ['Products'],
        security: [{ BearerAuth: [] }],
        responses: {
          201: { description: 'Product created' },
          403: { description: 'Admin privileges required' },
        },
      },
    },
    '/api/products/{id}': {
      get: {
        summary: 'Get product details by ID or Slug',
        tags: ['Products'],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: {
          200: { description: 'Product details with variants and reviews' },
          404: { description: 'Product not found' },
        },
      },
    },
    '/api/categories': {
      get: {
        summary: 'List all categories with product counts',
        tags: ['Categories'],
        responses: {
          200: { description: 'List of categories' },
        },
      },
    },
    '/api/cart': {
      get: {
        summary: 'Get customer shopping bag',
        tags: ['Cart'],
        security: [{ BearerAuth: [] }],
        responses: {
          200: { description: 'Cart with items and calculated totals' },
          401: { description: 'Unauthorized' },
        },
      },
      delete: {
        summary: 'Clear all items in cart',
        tags: ['Cart'],
        security: [{ BearerAuth: [] }],
        responses: {
          200: { description: 'Cart emptied' },
        },
      },
    },
    '/api/cart/items': {
      post: {
        summary: 'Add item to cart',
        tags: ['Cart'],
        security: [{ BearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['productId'],
                properties: {
                  productId: { type: 'string', example: 'prod-01' },
                  variantId: { type: 'string', example: 'var-prod-01-1' },
                  quantity: { type: 'integer', default: 1 },
                },
              },
            },
          },
        },
        responses: {
          200: { description: 'Item added and cart updated' },
        },
      },
    },
    '/api/orders': {
      get: {
        summary: 'List order history for authenticated user',
        tags: ['Orders'],
        security: [{ BearerAuth: [] }],
        responses: {
          200: { description: 'User orders' },
        },
      },
      post: {
        summary: 'Place order from current cart',
        tags: ['Orders'],
        security: [{ BearerAuth: [] }],
        responses: {
          201: { description: 'Order created successfully' },
        },
      },
    },
    '/api/orders/{id}': {
      get: {
        summary: 'Get order details by order ID',
        tags: ['Orders'],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        security: [{ BearerAuth: [] }],
        responses: {
          200: { description: 'Order snapshot and tracking' },
          404: { description: 'Order not found' },
        },
      },
    },
    '/api/wishlist': {
      get: {
        summary: 'Get customer wishlist items',
        tags: ['Wishlist'],
        security: [{ BearerAuth: [] }],
        responses: {
          200: { description: 'Wishlisted products' },
        },
      },
    },
    '/api/admin/dashboard': {
      get: {
        summary: 'Get admin dashboard revenue and order analytics',
        tags: ['Admin'],
        security: [{ BearerAuth: [] }],
        responses: {
          200: { description: 'Dashboard statistics' },
          403: { description: 'Admin privileges required' },
        },
      },
    },
    '/api/admin/users': {
      get: {
        summary: 'Get customer user list for admin',
        tags: ['Admin'],
        security: [{ BearerAuth: [] }],
        responses: {
          200: { description: 'List of registered users' },
        },
      },
    },
    '/api/admin/orders': {
      get: {
        summary: 'Get all store orders across customers',
        tags: ['Admin'],
        security: [{ BearerAuth: [] }],
        responses: {
          200: { description: 'Store orders' },
        },
      },
    },
  },
};
