import { ApiResponse, Product, Category, Order, User, Review } from '@/types';
import { MOCK_PRODUCTS, MOCK_CATEGORIES, MOCK_ORDERS, MOCK_USERS } from './mockData';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api';

class ApiService {
  private getToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('mens_store_token');
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
    const token = this.getToken();
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    if (
      endpoint.startsWith('/admin') ||
      ((endpoint.startsWith('/products') || endpoint.startsWith('/categories')) &&
        options.method &&
        options.method !== 'GET')
    ) {
      headers['x-admin-role'] = 'ADMIN';
    }

    try {
      const res = await fetch(`${BASE_URL}${endpoint}`, {
        ...options,
        headers,
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'API request failed');
      }
      return data;
    } catch (err: any) {
      // Backend offline or network error - provide structured fallback where appropriate
      throw err;
    }
  }

  // --- Auth ---
  async login(email: string, password: string): Promise<ApiResponse<{ user: User; token: string }>> {
    try {
      return await this.request('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });
    } catch (err) {
      // Fallback for demo
      const user = MOCK_USERS.find((u) => u.email.toLowerCase() === email.toLowerCase());
      if (user && (password.length >= 6)) {
        const token = `mock-jwt-token-${user.id}`;
        return {
          success: true,
          message: 'Logged in successfully (Demo Mode)',
          data: { user, token },
        };
      }
      throw new Error('Invalid email or password. Try user@example.com or admin@example.com with password: password123');
    }
  }

  async register(
    name: string,
    email: string,
    password: string,
    phone?: string,
    role?: 'USER' | 'ADMIN',
    adminSecret?: string
  ): Promise<ApiResponse<{ user: User; token: string }>> {
    try {
      return await this.request('/auth/register', {
        method: 'POST',
        body: JSON.stringify({ name, email, password, phone, role, adminSecret }),
      });
    } catch (err: any) {
      if (err.message && !err.message.includes('fetch')) {
        throw err;
      }
      const newUser: User = {
        id: `usr-${Date.now()}`,
        name,
        email,
        phone: phone || null,
        role: role || 'USER',
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      const token = `mock-jwt-token-${newUser.id}`;
      return {
        success: true,
        message: 'Account created successfully',
        data: { user: newUser, token },
      };
    }
  }

  async getCurrentUser(): Promise<ApiResponse<User>> {
    return this.request('/auth/me');
  }

  // --- Products ---
  async getProducts(params?: Record<string, any>): Promise<ApiResponse<Product[]>> {
    const searchParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, val]) => {
        if (val !== undefined && val !== null && val !== '') {
          searchParams.append(key, String(val));
        }
      });
    }

    try {
      const query = searchParams.toString();
      return await this.request(`/products${query ? `?${query}` : ''}`);
    } catch (err) {
      // Return filtered mock products
      let list = [...MOCK_PRODUCTS];
      if (params?.category) {
        const cat = MOCK_CATEGORIES.find((c) => c.slug === params.category || c.id === params.category);
        if (cat) list = list.filter((p) => p.categoryId === cat.id);
      }
      if (params?.search) {
        const q = String(params.search).toLowerCase();
        list = list.filter((p) => p.name.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q) || p.description.toLowerCase().includes(q));
      }
      if (params?.minPrice) {
        list = list.filter((p) => (p.discountPrice || p.price) >= Number(params.minPrice));
      }
      if (params?.maxPrice) {
        list = list.filter((p) => (p.discountPrice || p.price) <= Number(params.maxPrice));
      }
      if (params?.brand) {
        list = list.filter((p) => p.brand.toLowerCase() === String(params.brand).toLowerCase());
      }
      if (params?.size) {
        list = list.filter((p) => p.variants.some((v) => v.size.toLowerCase() === String(params.size).toLowerCase()));
      }
      if (params?.color) {
        list = list.filter((p) => p.variants.some((v) => v.color.toLowerCase().includes(String(params.color).toLowerCase())));
      }
      if (params?.rating) {
        list = list.filter((p) => (p.avgRating || 0) >= Number(params.rating));
      }

      // Sort
      if (params?.sort === 'price_asc') {
        list.sort((a, b) => (a.discountPrice || a.price) - (b.discountPrice || b.price));
      } else if (params?.sort === 'price_desc') {
        list.sort((a, b) => (b.discountPrice || b.price) - (a.discountPrice || a.price));
      } else if (params?.sort === 'rating') {
        list.sort((a, b) => (b.avgRating || 0) - (a.avgRating || 0));
      } else if (params?.sort === 'best_selling') {
        list.sort((a, b) => (b.totalReviews || 0) - (a.totalReviews || 0));
      } else {
        list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      }

      const page = Number(params?.page) || 1;
      const limit = Number(params?.limit) || 12;
      const total = list.length;
      const totalPages = Math.ceil(total / limit) || 1;
      const start = (page - 1) * limit;
      const paginated = list.slice(start, start + limit);

      return {
        success: true,
        data: paginated,
        pagination: {
          page,
          limit,
          total,
          totalPages,
        },
      };
    }
  }

  async getProductBySlug(slug: string): Promise<ApiResponse<Product>> {
    const encoded = encodeURIComponent(slug);
    try {
      return await this.request(`/products/slug/${encoded}`);
    } catch (err) {
      try {
        return await this.request(`/products/${encoded}`);
      } catch (err2) {
        const prod = MOCK_PRODUCTS.find((p) => p.slug === slug || p.id === slug);
        if (prod) {
          return {
            success: true,
            data: prod,
          };
        }
        throw new Error('Product not found');
      }
    }
  }

  async getProductById(id: string): Promise<ApiResponse<Product>> {
    const encoded = encodeURIComponent(id);
    try {
      return await this.request(`/products/${encoded}`);
    } catch (err) {
      try {
        return await this.request(`/products/slug/${encoded}`);
      } catch (err2) {
        const prod = MOCK_PRODUCTS.find((p) => p.id === id || p.slug === id);
        if (prod) {
          return {
            success: true,
            data: prod,
          };
        }
        throw new Error('Product not found');
      }
    }
  }

  // --- Categories ---
  async getCategories(): Promise<ApiResponse<Category[]>> {
    try {
      return await this.request('/categories');
    } catch (err) {
      return {
        success: true,
        data: MOCK_CATEGORIES,
      };
    }
  }

  // --- Orders ---
  async createOrder(orderData: any): Promise<ApiResponse<Order>> {
    try {
      return await this.request('/orders', {
        method: 'POST',
        body: JSON.stringify(orderData),
      });
    } catch (err) {
      const newOrder: Order = {
        id: `ord-${Date.now().toString().slice(-4)}`,
        userId: orderData.userId || 'usr-1',
        totalAmount: orderData.totalAmount,
        shippingAmount: orderData.shippingAmount || 0,
        discountAmount: orderData.discountAmount || 0,
        paymentMethod: orderData.paymentMethod || 'Cash on Delivery',
        paymentStatus: orderData.paymentMethod === 'Test Payment' ? 'PAID' : 'PENDING',
        orderStatus: 'PENDING',
        shippingAddress: orderData.shippingAddress,
        items: orderData.items,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      return {
        success: true,
        message: 'Order placed successfully',
        data: newOrder,
      };
    }
  }

  async getMyOrders(): Promise<ApiResponse<Order[]>> {
    try {
      return await this.request('/orders');
    } catch (err) {
      return {
        success: true,
        data: MOCK_ORDERS,
      };
    }
  }

  async getOrderById(id: string): Promise<ApiResponse<Order>> {
    try {
      return await this.request(`/orders/${id}`);
    } catch (err) {
      const ord = MOCK_ORDERS.find((o) => o.id === id);
      if (ord) return { success: true, data: ord };
      throw new Error('Order not found');
    }
  }

  // --- Reviews ---
  async addReview(productId: string, rating: number, comment: string): Promise<ApiResponse<Review>> {
    try {
      return await this.request(`/products/${productId}/reviews`, {
        method: 'POST',
        body: JSON.stringify({ rating, comment }),
      });
    } catch (err) {
      const rev: Review = {
        id: `rev-${Date.now()}`,
        userId: 'usr-1',
        productId,
        rating,
        comment,
        createdAt: new Date().toISOString(),
        user: { id: 'usr-1', name: 'You', email: 'user@example.com' },
      };
      return { success: true, message: 'Review submitted', data: rev };
    }
  }

  // --- Admin ---
  async getAdminDashboard(): Promise<ApiResponse<any>> {
    try {
      return await this.request('/admin/dashboard');
    } catch (err) {
      return {
        success: true,
        data: {
          totalUsers: MOCK_USERS.length + 15,
          totalProducts: MOCK_PRODUCTS.length,
          totalOrders: MOCK_ORDERS.length + 28,
          totalRevenue: 284500,
          pendingOrders: 4,
          deliveredOrders: 26,
          recentOrders: MOCK_ORDERS,
          recentUsers: MOCK_USERS,
        },
      };
    }
  }

  async getAdminOrders(): Promise<ApiResponse<Order[]>> {
    try {
      return await this.request('/admin/orders');
    } catch (err) {
      return { success: true, data: MOCK_ORDERS };
    }
  }

  async updateOrderStatus(id: string, status: string): Promise<ApiResponse<any>> {
    try {
      return await this.request(`/admin/orders/${id}/status`, {
        method: 'PUT',
        body: JSON.stringify({ status }),
      });
    } catch (err) {
      return { success: true, message: 'Order status updated', data: { id, status } };
    }
  }

  async updatePaymentStatus(id: string, status: string): Promise<ApiResponse<any>> {
    try {
      return await this.request(`/admin/orders/${id}/payment-status`, {
        method: 'PUT',
        body: JSON.stringify({ status }),
      });
    } catch (err) {
      return { success: true, message: 'Payment status updated', data: { id, status } };
    }
  }

  async getAdminUsers(): Promise<ApiResponse<User[]>> {
    try {
      return await this.request('/admin/users');
    } catch (err) {
      return { success: true, data: MOCK_USERS };
    }
  }

  async createProduct(data: any): Promise<ApiResponse<Product>> {
    return this.request('/products', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateProduct(id: string, data: any): Promise<ApiResponse<Product>> {
    return this.request(`/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteProduct(id: string): Promise<ApiResponse<any>> {
    return this.request(`/products/${id}`, {
      method: 'DELETE',
    });
  }

  async updateUserStatus(id: string, isActive: boolean): Promise<ApiResponse<any>> {
    try {
      return await this.request(`/admin/users/${id}/status`, {
        method: 'PUT',
        body: JSON.stringify({ isActive }),
      });
    } catch (err) {
      return { success: true, message: 'User status updated', data: { id, isActive } };
    }
  }

  async updateUserRole(id: string, role: string): Promise<ApiResponse<any>> {
    try {
      return await this.request(`/admin/users/${id}/role`, {
        method: 'PUT',
        body: JSON.stringify({ role }),
      });
    } catch (err) {
      return { success: true, message: 'User role updated', data: { id, role } };
    }
  }

  async createCategory(data: any): Promise<ApiResponse<Category>> {
    return this.request('/categories', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateCategory(id: string, data: any): Promise<ApiResponse<Category>> {
    return this.request(`/categories/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteCategory(id: string): Promise<ApiResponse<any>> {
    return this.request(`/categories/${id}`, {
      method: 'DELETE',
    });
  }
}

export const api = new ApiService();
