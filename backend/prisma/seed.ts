import { PrismaClient, Role, OrderStatus, PaymentStatus, PaymentMethod } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // 1. Clean existing records in correct relation order
  await prisma.wishlistItem.deleteMany();
  await prisma.wishlist.deleteMany();
  await prisma.review.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.cartItem.deleteMany();
  await prisma.cart.deleteMany();
  await prisma.address.deleteMany();
  await prisma.productVariant.deleteMany();
  await prisma.productImage.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.user.deleteMany();

  console.log('🧹 Cleaned existing records.');

  // 2. Passwords
  const adminPasswordHash = await bcrypt.hash('Admin@123456', 10);
  const userPasswordHash = await bcrypt.hash('Password@123456', 10);

  // 3. Create Users
  const adminUser = await prisma.user.create({
    data: {
      id: 'usr-admin-01',
      name: 'Vanguard Admin',
      email: 'admin@example.com',
      passwordHash: adminPasswordHash,
      phone: '+91 98765 43210',
      role: Role.ADMIN,
      isActive: true,
    },
  });

  const demoCustomer = await prisma.user.create({
    data: {
      id: 'usr-cust-01',
      name: 'Alexander Wright',
      email: 'customer@example.com',
      passwordHash: userPasswordHash,
      phone: '+91 98765 11111',
      role: Role.USER,
      isActive: true,
    },
  });

  const user2 = await prisma.user.create({
    data: {
      id: 'usr-cust-02',
      name: 'Julian Vance',
      email: 'julian@example.com',
      passwordHash: userPasswordHash,
      phone: '+91 98765 22222',
      role: Role.USER,
      isActive: true,
    },
  });

  const user3 = await prisma.user.create({
    data: {
      id: 'usr-cust-03',
      name: 'Marcus Sterling',
      email: 'marcus@example.com',
      passwordHash: userPasswordHash,
      phone: '+91 98765 33333',
      role: Role.USER,
      isActive: true,
    },
  });

  console.log('👤 Users created.');

  // 4. Default Addresses
  const defaultAddress = await prisma.address.create({
    data: {
      id: 'addr-01',
      userId: demoCustomer.id,
      name: 'Alexander Wright',
      phone: '+91 98765 11111',
      addressLine1: '402 Regency Towers, Golf Course Road',
      addressLine2: 'Sector 54',
      city: 'Gurugram',
      state: 'Haryana',
      postalCode: '122002',
      country: 'India',
      isDefault: true,
    },
  });

  // 5. Categories
  const categoriesData = [
    {
      id: 'cat-tshirts',
      name: 'T-Shirts',
      slug: 't-shirts',
      description: 'Heavyweight organic cotton tees engineered for structural drape.',
      imageUrl: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&auto=format&fit=crop&q=80',
    },
    {
      id: 'cat-shirts',
      name: 'Shirts',
      slug: 'shirts',
      description: 'Architectural Oxford, poplin, and relaxed linen button-downs.',
      imageUrl: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=800&auto=format&fit=crop&q=80',
    },
    {
      id: 'cat-jeans',
      name: 'Jeans',
      slug: 'jeans',
      description: 'Kurabo and Kaihara Japanese selvedge denim in raw and washed profiles.',
      imageUrl: 'https://images.unsplash.com/photo-1542272604-780c96856592?w=800&auto=format&fit=crop&q=80',
    },
    {
      id: 'cat-trousers',
      name: 'Trousers',
      slug: 'trousers',
      description: 'Double-pleated wool trousers and heavyweight tailored chinos.',
      imageUrl: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=800&auto=format&fit=crop&q=80',
    },
    {
      id: 'cat-jackets',
      name: 'Jackets',
      slug: 'jackets',
      description: 'Minimalist overshirts, unstructured wool blazers, and trucker jackets.',
      imageUrl: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&auto=format&fit=crop&q=80',
    },
    {
      id: 'cat-hoodies',
      name: 'Hoodies',
      slug: 'hoodies',
      description: '480 GSM loopback French terry sweats and zipped hoodies.',
      imageUrl: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=800&auto=format&fit=crop&q=80',
    },
    {
      id: 'cat-shorts',
      name: 'Shorts',
      slug: 'shorts',
      description: 'Structured cotton twill and heavyweight sweat shorts.',
      imageUrl: 'https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=800&auto=format&fit=crop&q=80',
    },
  ];

  for (const cat of categoriesData) {
    await prisma.category.create({ data: cat });
  }
  console.log('📁 Categories created.');

  // 6. Products, Variants & Images
  const products = [
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
      images: [
        'https://images.unsplash.com/photo-1542272604-780c96856592?w=800&auto=format&fit=crop&q=80',
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
      description: 'Heavyweight double-faced melton wool with dual chest flap pockets and horn buttons. Perfect for transitional layering.',
      price: 8999,
      discountPrice: 7499,
      categoryId: 'cat-jackets',
      brand: 'Vanguard Atelier',
      isFeatured: true,
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
      description: 'Custom-knitted heavyweight French terry with double-needle reverse flatlock stitching and seamless kangaroo pocket.',
      price: 4999,
      discountPrice: 4299,
      categoryId: 'cat-hoodies',
      brand: 'Vanguard Atelier',
      isFeatured: true,
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
      description: 'Structured 320 GSM cotton twill shorts cut to a 6-inch inseam with front coin pocket and horn buttons.',
      price: 2999,
      discountPrice: 2499,
      categoryId: 'cat-shorts',
      brand: 'Vanguard Atelier',
      isFeatured: false,
      images: [
        'https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=800&auto=format&fit=crop&q=80',
      ],
      variants: [
        { size: '30', color: 'Khaki Tan', stock: 15, sku: 'HTP-KHK-30' },
        { size: '32', color: 'Khaki Tan', stock: 20, sku: 'HTP-KHK-32' },
        { size: '34', color: 'Khaki Tan', stock: 15, sku: 'HTP-KHK-34' },
      ],
    },
  ];

  for (const prod of products) {
    const createdProduct = await prisma.product.create({
      data: {
        id: prod.id,
        name: prod.name,
        slug: prod.slug,
        description: prod.description,
        price: prod.price,
        discountPrice: prod.discountPrice,
        categoryId: prod.categoryId,
        brand: prod.brand,
        isFeatured: prod.isFeatured,
        isActive: true,
      },
    });

    // Images
    for (let i = 0; i < prod.images.length; i++) {
      await prisma.productImage.create({
        data: {
          productId: createdProduct.id,
          imageUrl: prod.images[i],
          altText: `${prod.name} View ${i + 1}`,
          sortOrder: i,
        },
      });
    }

    // Variants
    for (const v of prod.variants) {
      await prisma.productVariant.create({
        data: {
          productId: createdProduct.id,
          size: v.size,
          color: v.color,
          stock: v.stock,
          sku: v.sku,
        },
      });
    }
  }
  console.log('👕 Products, variants and images created.');

  // 7. Reviews
  await prisma.review.create({
    data: {
      userId: demoCustomer.id,
      productId: 'prod-01',
      rating: 5,
      comment: 'Unbelievable drape and hand-feel. Easily on par with Japanese luxury brands charging three times the price.',
    },
  });

  await prisma.review.create({
    data: {
      userId: user2.id,
      productId: 'prod-03',
      rating: 5,
      comment: 'Raw denim perfection. The pink selvedge line is crisp and fades are starting to break in after 3 weeks.',
    },
  });

  // 8. Demo Cart for demo customer
  const custCart = await prisma.cart.create({
    data: {
      userId: demoCustomer.id,
    },
  });

  const variantToCart = await prisma.productVariant.findFirst({
    where: { sku: 'HBT-BLK-M' },
  });

  if (variantToCart) {
    await prisma.cartItem.create({
      data: {
        cartId: custCart.id,
        productId: 'prod-01',
        variantId: variantToCart.id,
        quantity: 2,
      },
    });
  }

  // 9. Demo Order for demo customer
  const demoOrder = await prisma.order.create({
    data: {
      id: 'ord-2026-9812',
      userId: demoCustomer.id,
      totalAmount: 6999,
      shippingAmount: 0,
      discountAmount: 1000,
      paymentMethod: PaymentMethod.CREDIT_CARD,
      paymentStatus: PaymentStatus.COMPLETED,
      orderStatus: OrderStatus.SHIPPED,
      shippingAddressId: defaultAddress.id,
    },
  });

  await prisma.orderItem.create({
    data: {
      orderId: demoOrder.id,
      productId: 'prod-03',
      productName: '14oz Japanese Selvedge Denim',
      size: '32',
      color: 'Raw Indigo',
      quantity: 1,
      unitPrice: 6999,
      subtotal: 6999,
    },
  });

  console.log('✅ Seed finished successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
