const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

// Types
export interface User {
  id: string;
  name: string;
  email: string;
  created_at: string;
  updated_at: string;
}

export interface Niche {
  id: string;
  niche_name: string;
  description?: string;
  category_id: string;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: string;
  category_name: string;
  description?: string;
  created_at: string;
  updated_at: string;
}

export interface Query {
  id: string;
  query: string;
  description?: string;
  created_at: string;
  updated_at: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
}

// API Client
class ApiClient {
  private baseURL: string;
  private token: string | null = null;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
    // Load token from localStorage on initialization
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('affiliate-marketers-token');
    }
  }

  setToken(token: string | null) {
    this.token = token;
    if (typeof window !== 'undefined') {
      if (token) {
        localStorage.setItem('affiliate-marketers-token', token);
      } else {
        localStorage.removeItem('affiliate-marketers-token');
      }
    }
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    };

    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`;
    }

    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  // Auth endpoints
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    return this.request<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  async register(userData: RegisterRequest): Promise<User> {
    return this.request<User>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async getCurrentUser(): Promise<User> {
    return this.request<User>('/auth/me');
  }

  // Niches endpoints
  async getNiches(): Promise<Niche[]> {
    const response = await this.request<{niches: Niche[]}>('/niches/');
    return response.niches;
  }

  async getNiche(id: string): Promise<Niche> {
    return this.request<Niche>(`/niches/${id}`);
  }

  async createNiche(niche: Omit<Niche, 'id' | 'created_at' | 'updated_at'>): Promise<Niche> {
    return this.request<Niche>('/niches/', {
      method: 'POST',
      body: JSON.stringify(niche),
    });
  }

  async updateNiche(id: string, niche: Partial<Omit<Niche, 'id' | 'created_at' | 'updated_at'>>): Promise<Niche> {
    return this.request<Niche>(`/niches/${id}`, {
      method: 'PUT',
      body: JSON.stringify(niche),
    });
  }

  async deleteNiche(id: string): Promise<{ message: string }> {
    return this.request<{ message: string }>(`/niches/${id}`, {
      method: 'DELETE',
    });
  }

  // Categories endpoints
  async getCategories(): Promise<Category[]> {
    const response = await this.request<{categories: Category[]}>('/categories/');
    return response.categories;
  }

  async getCategory(id: string): Promise<Category> {
    return this.request<Category>(`/categories/${id}`);
  }

  async createCategory(category: Omit<Category, 'id' | 'created_at' | 'updated_at'>): Promise<Category> {
    return this.request<Category>('/categories/', {
      method: 'POST',
      body: JSON.stringify(category),
    });
  }

  async updateCategory(id: string, category: Partial<Omit<Category, 'id' | 'created_at' | 'updated_at'>>): Promise<Category> {
    return this.request<Category>(`/categories/${id}`, {
      method: 'PUT',
      body: JSON.stringify(category),
    });
  }

  async deleteCategory(id: string): Promise<{ message: string }> {
    return this.request<{ message: string }>(`/categories/${id}`, {
      method: 'DELETE',
    });
  }

  // Queries endpoints
  async getQueries(): Promise<Query[]> {
    return this.request<Query[]>('/queries/');
  }

  async getQuery(id: string): Promise<Query> {
    return this.request<Query>(`/queries/${id}`);
  }

  async createQuery(query: Omit<Query, 'id' | 'created_at' | 'updated_at'>): Promise<Query> {
    return this.request<Query>('/queries/', {
      method: 'POST',
      body: JSON.stringify(query),
    });
  }

  async updateQuery(id: string, query: Partial<Omit<Query, 'id' | 'created_at' | 'updated_at'>>): Promise<Query> {
    return this.request<Query>(`/queries/${id}`, {
      method: 'PUT',
      body: JSON.stringify(query),
    });
  }

  async deleteQuery(id: string): Promise<{ message: string }> {
    return this.request<{ message: string }>(`/queries/${id}`, {
      method: 'DELETE',
    });
  }
}

export const apiClient = new ApiClient(API_BASE_URL);
