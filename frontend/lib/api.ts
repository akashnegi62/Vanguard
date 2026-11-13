import { ApiResponse, Product, Category, Order, User, Review } from '@/types';

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
      throw err;
    }
  }

  // --- Auth ---
  async login(email: string, password: string): Promise<ApiResponse<{ user: User; token: string }>> {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async register(
    name: string,
    email: string,
    password: string,
    phone?: string,
    role?: 'USER' | 'ADMIN',
    adminSecret?: string
  ): Promise<ApiResponse<{ user: User; token: string }>> {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password, phone, role, adminSecret }),
    });
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

    const query = searchParams.toString();
    return this.request(`/products${query ? `?${query}` : ''}`);
  }

  async getProductBySlug(slug: string): Promise<ApiResponse<Product>> {
    const encoded = encodeURIComponent(slug);
    try {
      return await this.request(`/products/slug/${encoded}`);
    } catch {
      return this.request(`/products/${encoded}`);
    }
  }

  async getProductById(id: string): Promise<ApiResponse<Product>> {
    const encoded = encodeURIComponent(id);
    try {
      return await this.request(`/products/${encoded}`);
    } catch {
      return this.request(`/products/slug/${encoded}`);
    }
  }

  // --- Categories ---
  async getCategories(): Promise<ApiResponse<Category[]>> {
    return this.request('/categories');
  }

  // --- Orders ---
  async createOrder(orderData: any): Promise<ApiResponse<Order>> {
    return this.request('/orders', {
      method: 'POST',
      body: JSON.stringify(orderData),
    });
  }

  async getMyOrders(): Promise<ApiResponse<Order[]>> {
    return this.request('/orders');
  }

  async getOrderById(id: string): Promise<ApiResponse<Order>> {
    return this.request(`/orders/${id}`);
  }

  // --- Reviews ---
  async addReview(productId: string, rating: number, comment: string): Promise<ApiResponse<Review>> {
    return this.request(`/products/${productId}/reviews`, {
      method: 'POST',
      body: JSON.stringify({ rating, comment }),
    });
  }

  // --- Admin ---
  async getAdminDashboard(): Promise<ApiResponse<any>> {
    return this.request('/admin/dashboard');
  }

  async getAdminOrders(): Promise<ApiResponse<Order[]>> {
    return this.request('/admin/orders');
  }

  async updateOrderStatus(id: string, status: string): Promise<ApiResponse<any>> {
    return this.request(`/admin/orders/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
  }

  async updatePaymentStatus(id: string, status: string): Promise<ApiResponse<any>> {
    return this.request(`/admin/orders/${id}/payment-status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
  }

  async getAdminUsers(): Promise<ApiResponse<User[]>> {
    return this.request('/admin/users');
  }

  async createProduct(data: any): Promise<ApiResponse<Product>> {
    return this.request<Product>('/products', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateProduct(id: string, data: any): Promise<ApiResponse<Product>> {
    return this.request<Product>(`/products/${id}`, {
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
    return this.request(`/admin/users/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ isActive }),
    });
  }

  async updateUserRole(id: string, role: string): Promise<ApiResponse<any>> {
    return this.request(`/admin/users/${id}/role`, {
      method: 'PUT',
      body: JSON.stringify({ role }),
    });
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
