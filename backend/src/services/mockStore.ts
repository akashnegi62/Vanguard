import { Role, OrderStatus, PaymentStatus, PaymentMethod } from '@prisma/client';
import bcrypt from 'bcryptjs';

export interface MockUser {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  phone?: string | null;
  role: Role;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface MockCategory {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  imageUrl?: string | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface MockProductVariant {
  id: string;
  productId: string;
  size: string;
  color: string;
  stock: number;
  sku: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface MockProductImage {
  id: string;
  productId: string;
  imageUrl: string;
  altText?: string | null;
  sortOrder: number;
  createdAt: Date;
}

export interface MockProduct {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  discountPrice?: number | null;
  categoryId: string;
  brand: string;
  isFeatured: boolean;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  images: MockProductImage[];
  variants: MockProductVariant[];
  category?: MockCategory;
  rating?: number;
  reviewsCount?: number;
}

export interface MockAddress {
  id: string;
  userId: string;
  name: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string | null;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface MockCartItem {
  id: string;
  cartId: string;
  productId: string;
  variantId?: string | null;
  quantity: number;
  createdAt: Date;
  updatedAt: Date;
  product?: MockProduct;
  variant?: MockProductVariant | null;
}

export interface MockCart {
  id: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
  items: MockCartItem[];
}

export interface MockOrderItem {
  id: string;
  orderId: string;
  productId: string;
  variantId?: string | null;
  productName: string;
  size?: string | null;
  color?: string | null;
  quantity: number;
  unitPrice: number;
  subtotal: number;
  createdAt: Date;
}

export interface MockOrder {
  id: string;
  userId: string;
  totalAmount: number;
  shippingAmount: number;
  discountAmount: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  orderStatus: OrderStatus;
  shippingAddressId?: string | null;
  shippingAddress?: MockAddress | null;
  items: MockOrderItem[];
  createdAt: Date;
  updatedAt: Date;
  user?: { id: string; name: string; email: string };
}

export interface MockReview {
  id: string;
  userId: string;
  productId: string;
  rating: number;
  comment: string;
  createdAt: Date;
  updatedAt: Date;
  user?: { id: string; name: string };
}

export interface MockWishlist {
  id: string;
  userId: string;
  productIds: string[];
  createdAt: Date;
}

class MockStore {
  users: MockUser[] = [];
  categories: MockCategory[] = [];
  products: MockProduct[] = [];
  addresses: MockAddress[] = [];
  carts: MockCart[] = [];
  orders: MockOrder[] = [];
  reviews: MockReview[] = [];
  wishlists: MockWishlist[] = [];

  constructor() {
    this.seed();
  }

  private seed() {
    const adminHash = bcrypt.hashSync('Admin@123456', 10);
    const userHash = bcrypt.hashSync('Password@123456', 10);

    // Users
    this.users = [
      {
        id: 'usr-admin-01',
        name: 'Vanguard Admin',
        email: 'admin@example.com',
        passwordHash: adminHash,
        phone: '+91 98765 43210',
        role: Role.ADMIN,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 'usr-cust-01',
        name: 'Alexander Wright',
        email: 'customer@example.com',
        passwordHash: userHash,
        phone: '+91 98765 11111',
        role: Role.USER,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 'usr-cust-02',
        name: 'Julian Vance',
        email: 'julian@example.com',
        passwordHash: userHash,
        phone: '+91 98765 22222',
        role: Role.USER,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 'usr-cust-03',
        name: 'Marcus Sterling',
        email: 'marcus@example.com',
        passwordHash: userHash,
        phone: '+91 98765 33333',
        role: Role.USER,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    // Categories
    this.categories = [
      {
        id: 'cat-tshirts',
        name: 'T-Shirts',
        slug: 't-shirts',
        description: 'Heavyweight organic cotton tees engineered for structural drape.',
        imageUrl: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&auto=format&fit=crop&q=80',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 'cat-shirts',
        name: 'Shirts',
        slug: 'shirts',
        description: 'Architectural Oxford, poplin, and relaxed linen button-downs.',
        imageUrl: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=800&auto=format&fit=crop&q=80',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 'cat-jeans',
        name: 'Jeans',
        slug: 'jeans',
        description: 'Kurabo and Kaihara Japanese selvedge denim in raw and washed profiles.',
        imageUrl: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=800&auto=format&fit=crop&q=80',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 'cat-trousers',
        name: 'Trousers',
        slug: 'trousers',
        description: 'Double-pleated wool trousers and heavyweight tailored chinos.',
        imageUrl: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=800&auto=format&fit=crop&q=80',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 'cat-jackets',
        name: 'Jackets',
        slug: 'jackets',
        description: 'Minimalist overshirts, unstructured wool blazers, and trucker jackets.',
        imageUrl: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&auto=format&fit=crop&q=80',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 'cat-hoodies',
        name: 'Hoodies',
        slug: 'hoodies',
        description: '480 GSM loopback French terry sweats and zipped hoodies.',
        imageUrl: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=800&auto=format&fit=crop&q=80',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 'cat-shorts',
        name: 'Shorts',
        slug: 'shorts',
        description: 'Structured cotton twill and heavyweight sweat shorts.',
        imageUrl: 'https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=800&auto=format&fit=crop&q=80',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    // Addresses
    this.addresses = [
      {
        id: 'addr-01',
        userId: 'usr-cust-01',
        name: 'Alexander Wright',
        phone: '+91 98765 11111',
        addressLine1: '402 Regency Towers, Golf Course Road',
        addressLine2: 'Sector 54',
        city: 'Gurugram',
        state: 'Haryana',
        postalCode: '122002',
        country: 'India',
        isDefault: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    // Helper to generate products
    const rawProducts = [
      {
        id: 'prod-01',
        name: 'Heavyweight Boxy T-Shirt',
        slug: 'heavyweight-boxy-t-shirt',
        description: 'Crafted from 280 GSM combed organic cotton with a structured boxy silhouette and reinforced ribbed collar.',
        price: 2499,
        discountPrice: 1999,
        categoryId: 'cat-tshirts',
        brand: 'Vanguard Atelier',
        isFeatured: true,
        rating: 4.9,
        reviewsCount: 38,
        images: [
          'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&auto=format&fit=crop&q=80',
          'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=800&auto=format&fit=crop&q=80',
        ],
        variants: [
          { size: 'S', color: 'Vintage Black', stock: 25, sku: 'HBT-BLK-S' },
          { size: 'M', color: 'Vintage Black', stock: 40, sku: 'HBT-BLK-M' },
          { size: 'L', color: 'Vintage Black', stock: 30, sku: 'HBT-BLK-L' },
          { size: 'XL', color: 'Vintage Black', stock: 15, sku: 'HBT-BLK-XL' },
          { size: 'M', color: 'Bone White', stock: 20, sku: 'HBT-WHT-M' },
          { size: 'L', color: 'Bone White', stock: 18, sku: 'HBT-WHT-L' },
        ],
      },
      {
        id: 'prod-02',
        name: 'Architectural Oxford Shirt',
        slug: 'architectural-oxford-shirt',
        description: 'Woven from premium 2-ply long-staple cotton with mother-of-pearl buttons and a refined button-down collar.',
        price: 4499,
        discountPrice: 3899,
        categoryId: 'cat-shirts',
        brand: 'Vanguard Atelier',
        isFeatured: true,
        rating: 4.8,
        reviewsCount: 29,
        images: [
          'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=800&auto=format&fit=crop&q=80',
          'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800&auto=format&fit=crop&q=80',
        ],
        variants: [
          { size: '38', color: 'Sky Blue', stock: 20, sku: 'AOS-BLU-38' },
          { size: '40', color: 'Sky Blue', stock: 25, sku: 'AOS-BLU-40' },
          { size: '42', color: 'Sky Blue', stock: 15, sku: 'AOS-BLU-42' },
          { size: '40', color: 'Optic White', stock: 30, sku: 'AOS-WHT-40' },
        ],
      },
      {
        id: 'prod-03',
        name: '14oz Japanese Selvedge Denim',
        slug: '14oz-japanese-selvedge-denim',
        description: 'Woven on vintage shuttle looms in Kojima, Japan. Rope-dyed pure indigo with pink selvedge ID and custom copper rivets.',
        price: 7999,
        discountPrice: 6999,
        categoryId: 'cat-jeans',
        brand: 'Kojima Selvedge',
        isFeatured: true,
        rating: 5.0,
        reviewsCount: 44,
        images: [
          'https://images.unsplash.com/photo-1582552938357-32b906df40cb?w=800&auto=format&fit=crop&q=80',
          'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=800&auto=format&fit=crop&q=80',
        ],
        variants: [
          { size: '30', color: 'Raw Indigo', stock: 12, sku: 'JSD-IND-30' },
          { size: '32', color: 'Raw Indigo', stock: 22, sku: 'JSD-IND-32' },
          { size: '34', color: 'Raw Indigo', stock: 18, sku: 'JSD-IND-34' },
        ],
      },
      {
        id: 'prod-04',
        name: 'Double-Pleated Wool Trousers',
        slug: 'double-pleated-wool-trousers',
        description: 'Super 120s virgin wool with deep forward pleats, extended tab closure, and an elegant gentle taper.',
        price: 6499,
        discountPrice: null,
        categoryId: 'cat-trousers',
        brand: 'Vanguard Atelier',
        isFeatured: true,
        rating: 4.7,
        reviewsCount: 19,
        images: [
          'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=800&auto=format&fit=crop&q=80',
        ],
        variants: [
          { size: '30', color: 'Charcoal Grey', stock: 10, sku: 'DPW-CHR-30' },
          { size: '32', color: 'Charcoal Grey', stock: 15, sku: 'DPW-CHR-32' },
          { size: '34', color: 'Charcoal Grey', stock: 12, sku: 'DPW-CHR-34' },
        ],
      },
      {
        id: 'prod-05',
        name: 'Unstructured Wool Overshirt',
        slug: 'unstructured-wool-overshirt',
        description: 'Heavyweight double-faced melton wool with dual chest flap pockets and horn buttons.',
        price: 8999,
        discountPrice: 7499,
        categoryId: 'cat-jackets',
        brand: 'Vanguard Atelier',
        isFeatured: true,
        rating: 4.9,
        reviewsCount: 31,
        images: [
          'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&auto=format&fit=crop&q=80',
        ],
        variants: [
          { size: 'M', color: 'Espresso', stock: 10, sku: 'UWO-ESP-M' },
          { size: 'L', color: 'Espresso', stock: 14, sku: 'UWO-ESP-L' },
          { size: 'XL', color: 'Espresso', stock: 8, sku: 'UWO-ESP-XL' },
        ],
      },
      {
        id: 'prod-06',
        name: '480 GSM Loopback Hoodie',
        slug: '480-gsm-loopback-hoodie',
        description: 'Custom-knitted heavyweight French terry with double-needle reverse flatlock stitching.',
        price: 4999,
        discountPrice: 4299,
        categoryId: 'cat-hoodies',
        brand: 'Vanguard Atelier',
        isFeatured: true,
        rating: 4.8,
        reviewsCount: 27,
        images: [
          'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=800&auto=format&fit=crop&q=80',
        ],
        variants: [
          { size: 'S', color: 'Heather Grey', stock: 14, sku: 'LBH-GRY-S' },
          { size: 'M', color: 'Heather Grey', stock: 25, sku: 'LBH-GRY-M' },
          { size: 'L', color: 'Heather Grey', stock: 20, sku: 'LBH-GRY-L' },
        ],
      },
      {
        id: 'prod-07',
        name: 'Heavy Twill Pleated Shorts',
        slug: 'heavy-twill-pleated-shorts',
        description: 'Structured 320 GSM cotton twill shorts cut to a 6-inch inseam with front coin pocket.',
        price: 2999,
        discountPrice: 2499,
        categoryId: 'cat-shorts',
        brand: 'Vanguard Atelier',
        isFeatured: false,
        rating: 4.6,
        reviewsCount: 16,
        images: [
          'https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=800&auto=format&fit=crop&q=80',
        ],
        variants: [
          { size: '30', color: 'Khaki Tan', stock: 15, sku: 'HTP-KHK-30' },
          { size: '32', color: 'Khaki Tan', stock: 20, sku: 'HTP-KHK-32' },
          { size: '34', color: 'Khaki Tan', stock: 15, sku: 'HTP-KHK-34' },
        ],
      },
      {
        id: 'prod-08',
        name: 'Relaxed Belgian Linen Shirt',
        slug: 'relaxed-belgian-linen-shirt',
        description: 'Pure 100% Normandy-harvested linen pre-washed for effortless softness with camp collar styling.',
        price: 4999,
        discountPrice: 4299,
        categoryId: 'cat-shirts',
        brand: 'Vanguard Atelier',
        isFeatured: true,
        rating: 4.8,
        reviewsCount: 22,
        images: [
          'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800&auto=format&fit=crop&q=80',
        ],
        variants: [
          { size: 'M', color: 'Sand Beige', stock: 18, sku: 'RBL-SND-M' },
          { size: 'L', color: 'Sand Beige', stock: 14, sku: 'RBL-SND-L' },
        ],
      },
      {
        id: 'prod-09',
        name: 'Tailored Cotton Chino Trousers',
        slug: 'tailored-cotton-chino-trousers',
        description: 'Heavyweight compact cotton twill with clean flat front, slanted side pockets, and horn buttons.',
        price: 4499,
        discountPrice: null,
        categoryId: 'cat-trousers',
        brand: 'Vanguard Atelier',
        isFeatured: false,
        rating: 4.7,
        reviewsCount: 19,
        images: [
          'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=800&auto=format&fit=crop&q=80',
        ],
        variants: [
          { size: '30', color: 'Navy', stock: 20, sku: 'TCC-NAV-30' },
          { size: '32', color: 'Navy', stock: 25, sku: 'TCC-NAV-32' },
          { size: '34', color: 'Navy', stock: 18, sku: 'TCC-NAV-34' },
        ],
      },
      {
        id: 'prod-10',
        name: 'Selvedge Denim Trucker Jacket',
        slug: 'selvedge-denim-trucker-jacket',
        description: 'Type-III silhouette rendered in 14.5oz rigid Japanese denim with custom silver shanks.',
        price: 9499,
        discountPrice: 8499,
        categoryId: 'cat-jackets',
        brand: 'Kojima Selvedge',
        isFeatured: true,
        rating: 4.9,
        reviewsCount: 35,
        images: [
          'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=800&auto=format&fit=crop&q=80',
        ],
        variants: [
          { size: 'M', color: 'Vintage Wash', stock: 12, sku: 'SDT-VW-M' },
          { size: 'L', color: 'Vintage Wash', stock: 15, sku: 'SDT-VW-L' },
          { size: 'XL', color: 'Vintage Wash', stock: 10, sku: 'SDT-VW-XL' },
        ],
      },
    ];

    this.products = rawProducts.map((p) => {
      const cat = this.categories.find((c) => c.id === p.categoryId);
      const images: MockProductImage[] = p.images.map((url, idx) => ({
        id: `img-${p.id}-${idx}`,
        productId: p.id,
        imageUrl: url,
        altText: `${p.name} photo`,
        sortOrder: idx,
        createdAt: new Date(),
      }));

      const variants: MockProductVariant[] = p.variants.map((v, idx) => ({
        id: `var-${p.id}-${idx}`,
        productId: p.id,
        size: v.size,
        color: v.color,
        stock: v.stock,
        sku: v.sku,
        createdAt: new Date(),
        updatedAt: new Date(),
      }));

      return {
        id: p.id,
        name: p.name,
        slug: p.slug,
        description: p.description,
        price: p.price,
        discountPrice: p.discountPrice,
        categoryId: p.categoryId,
        brand: p.brand,
        isFeatured: p.isFeatured,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
        images,
        variants,
        category: cat,
        rating: p.rating,
        reviewsCount: p.reviewsCount,
      };
    });

    // Reviews
    this.reviews = [
      {
        id: 'rev-01',
        userId: 'usr-cust-01',
        productId: 'prod-01',
        rating: 5,
        comment: 'Unbelievable drape and hand-feel. Easily on par with Japanese luxury brands charging three times the price.',
        createdAt: new Date(),
        updatedAt: new Date(),
        user: { id: 'usr-cust-01', name: 'Alexander Wright' },
      },
      {
        id: 'rev-02',
        userId: 'usr-cust-02',
        productId: 'prod-03',
        rating: 5,
        comment: 'Raw denim perfection. The pink selvedge line is crisp and fades are starting to break in nicely.',
        createdAt: new Date(),
        updatedAt: new Date(),
        user: { id: 'usr-cust-02', name: 'Julian Vance' },
      },
    ];

    // Orders
    this.orders = [
      {
        id: 'ord-2026-9812',
        userId: 'usr-cust-01',
        totalAmount: 6999,
        shippingAmount: 0,
        discountAmount: 1000,
        paymentMethod: PaymentMethod.CREDIT_CARD,
        paymentStatus: PaymentStatus.COMPLETED,
        orderStatus: OrderStatus.SHIPPED,
        shippingAddressId: 'addr-01',
        shippingAddress: this.addresses[0],
        items: [
          {
            id: 'ord-item-01',
            orderId: 'ord-2026-9812',
            productId: 'prod-03',
            variantId: 'var-prod-03-1',
            productName: '14oz Japanese Selvedge Denim',
            size: '32',
            color: 'Raw Indigo',
            quantity: 1,
            unitPrice: 6999,
            subtotal: 6999,
            createdAt: new Date(),
          },
        ],
        createdAt: new Date(Date.now() - 86400000 * 2),
        updatedAt: new Date(),
        user: { id: 'usr-cust-01', name: 'Alexander Wright', email: 'customer@example.com' },
      },
    ];

    // Carts
    this.carts = [
      {
        id: 'cart-usr-cust-01',
        userId: 'usr-cust-01',
        createdAt: new Date(),
        updatedAt: new Date(),
        items: [
          {
            id: 'ci-01',
            cartId: 'cart-usr-cust-01',
            productId: 'prod-01',
            variantId: 'var-prod-01-1',
            quantity: 2,
            createdAt: new Date(),
            updatedAt: new Date(),
            product: this.products[0],
            variant: this.products[0].variants[1],
          },
        ],
      },
    ];

    // Wishlist
    this.wishlists = [
      {
        id: 'wl-usr-cust-01',
        userId: 'usr-cust-01',
        productIds: ['prod-02', 'prod-05'],
        createdAt: new Date(),
      },
    ];
  }
}

export const mockStore = new MockStore();
