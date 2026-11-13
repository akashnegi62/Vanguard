import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import fs from 'fs';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Supabase URL or Key missing in .env');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});

const mockDataPath = path.resolve(__dirname, 'mockData.json');
const mockData = JSON.parse(fs.readFileSync(mockDataPath, 'utf-8'));

const catMap: Record<string, string> = {
  'cat-1': 'cat-tshirts',
  'cat-2': 'cat-shirts',
  'cat-3': 'cat-jeans',
  'cat-4': 'cat-trousers',
  'cat-5': 'cat-jackets',
  'cat-6': 'cat-hoodies',
  'cat-7': 'cat-shorts',
  'cat-sneakers': 'cat-sneakers',
};

async function seed() {
  console.log('🚀 Starting Supabase Seeding...');

  // 1. Seed Categories
  console.log('📦 Seeding Categories...');
  for (const cat of mockData.categories) {
    const mappedId = catMap[cat.id] || cat.id;
    const { error } = await supabase.from('categories').upsert({
      id: mappedId,
      name: cat.name,
      slug: cat.slug,
      description: cat.description || null,
      image_url: cat.imageUrl || null,
      is_active: cat.isActive !== false,
      updated_at: new Date().toISOString(),
    });
    if (error) {
      console.warn(`⚠️ Error upserting category ${cat.name}:`, error.message);
    } else {
      console.log(`  ✓ Category: ${cat.name} (${mappedId})`);
    }
  }

  // 2. Seed Users
  console.log('👤 Seeding Users...');
  const defaultPasswordHash = await bcrypt.hash('password123', 10);
  for (const user of mockData.users) {
    const { error } = await supabase.from('users').upsert({
      id: user.id,
      name: user.name,
      email: user.email,
      password_hash: defaultPasswordHash,
      phone: user.phone || null,
      role: user.role,
      is_active: user.isActive !== false,
      updated_at: new Date().toISOString(),
    });
    if (error) {
      console.warn(`⚠️ Error upserting user ${user.email}:`, error.message);
    } else {
      console.log(`  ✓ User: ${user.name} (${user.email})`);
    }
  }

  // 3. Seed Products, Images, Variants, Reviews
  console.log('🛍️ Seeding Products, Images, Variants, Reviews...');
  let prodSuccess = 0;
  let imgSuccess = 0;
  let varSuccess = 0;
  let revSuccess = 0;

  for (const prod of mockData.products) {
    const resolvedCatId = catMap[prod.categoryId] || prod.categoryId;

    const { error: pErr } = await supabase.from('products').upsert({
      id: prod.id,
      name: prod.name,
      slug: prod.slug,
      description: prod.description || '',
      price: Number(prod.price),
      discount_price: prod.discountPrice ? Number(prod.discountPrice) : null,
      category_id: resolvedCatId,
      brand: prod.brand || 'Vanguard Atelier',
      is_featured: Boolean(prod.isFeatured),
      is_active: prod.isActive !== false,
      created_at: prod.createdAt || new Date().toISOString(),
      updated_at: prod.updatedAt || new Date().toISOString(),
    });

    if (pErr) {
      console.warn(`⚠️ Error upserting product ${prod.name} (${prod.id}):`, pErr.message);
      continue;
    }
    prodSuccess++;

    // Images
    if (prod.images && prod.images.length > 0) {
      for (let i = 0; i < prod.images.length; i++) {
        const img = prod.images[i];
        const { error: iErr } = await supabase.from('product_images').upsert({
          id: img.id || `img-${prod.id}-${i}`,
          product_id: prod.id,
          image_url: img.imageUrl,
          alt_text: img.altText || prod.name,
          sort_order: img.sortOrder ?? i,
        });
        if (!iErr) imgSuccess++;
      }
    }

    // Variants
    if (prod.variants && prod.variants.length > 0) {
      for (let i = 0; i < prod.variants.length; i++) {
        const v = prod.variants[i];
        const { error: vErr } = await supabase.from('product_variants').upsert({
          id: v.id || `var-${prod.id}-${i}`,
          product_id: prod.id,
          size: v.size,
          color: v.color,
          stock: Number(v.stock ?? 10),
          sku: v.sku || `${prod.slug}-${v.size}-${i + 1}`.toUpperCase(),
          updated_at: new Date().toISOString(),
        });
        if (!vErr) varSuccess++;
        else console.warn(`    ⚠️ Variant error for ${prod.name}:`, vErr.message);
      }
    }

    // Reviews
    if (prod.reviews && prod.reviews.length > 0) {
      for (const rev of prod.reviews) {
        const { error: rErr } = await supabase.from('reviews').upsert({
          id: rev.id,
          user_id: rev.userId || 'usr-1',
          product_id: prod.id,
          rating: Number(rev.rating),
          comment: rev.comment || '',
          updated_at: new Date().toISOString(),
        });
        if (!rErr) revSuccess++;
      }
    }
  }

  console.log(`  ✓ Products seeded: ${prodSuccess}`);
  console.log(`  ✓ Product images seeded: ${imgSuccess}`);
  console.log(`  ✓ Product variants seeded: ${varSuccess}`);
  console.log(`  ✓ Product reviews seeded: ${revSuccess}`);

  // 4. Seed Addresses from Orders
  console.log('📍 Seeding Addresses...');
  for (const order of mockData.orders) {
    if (order.shippingAddress) {
      const addr = order.shippingAddress;
      const { error: aErr } = await supabase.from('addresses').upsert({
        id: addr.id,
        user_id: addr.userId || order.userId || 'usr-1',
        name: addr.name,
        phone: addr.phone,
        address_line1: addr.addressLine1,
        address_line2: addr.addressLine2 || null,
        city: addr.city,
        state: addr.state,
        postal_code: addr.postalCode,
        country: addr.country || 'India',
        is_default: Boolean(addr.isDefault),
        updated_at: new Date().toISOString(),
      });
      if (aErr) {
        console.warn(`⚠️ Error upserting address ${addr.id}:`, aErr.message);
      } else {
        console.log(`  ✓ Address: ${addr.id} (${addr.city})`);
      }
    }
  }

  // 5. Verification
  console.log('\n📊 Verifying seeded data in Supabase...');
  const [{ count: cCount }, { count: pCount }, { count: iCount }, { count: vCount }, { count: uCount }] = await Promise.all([
    supabase.from('categories').select('*', { count: 'exact', head: true }),
    supabase.from('products').select('*', { count: 'exact', head: true }),
    supabase.from('product_images').select('*', { count: 'exact', head: true }),
    supabase.from('product_variants').select('*', { count: 'exact', head: true }),
    supabase.from('users').select('*', { count: 'exact', head: true }),
  ]);

  console.log(`  Total Categories in Supabase: ${cCount}`);
  console.log(`  Total Products in Supabase: ${pCount}`);
  console.log(`  Total Images in Supabase: ${iCount}`);
  console.log(`  Total Variants in Supabase: ${vCount}`);
  console.log(`  Total Users in Supabase: ${uCount}`);
  console.log('✨ Seeding completed successfully!');
}

seed().catch((err) => {
  console.error('Fatal seeding error:', err);
  process.exit(1);
});

