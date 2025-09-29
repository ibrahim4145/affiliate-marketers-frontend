const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

// Types
export interface User {
  id: string;
  name: string;
  email: string;
  created_at: string;
  updated_at: string;
}

export interface Industry {
  id: string;
  industry_name: string;
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

  // Industries endpoints
  async getIndustries(): Promise<Industry[]> {
    return this.request<Industry[]>('/industries/');
  }

  async getIndustry(id: string): Promise<Industry> {
    return this.request<Industry>(`/industries/${id}`);
  }

  async createIndustry(industry: Omit<Industry, 'id' | 'created_at' | 'updated_at'>): Promise<Industry> {
    return this.request<Industry>('/industries/', {
      method: 'POST',
      body: JSON.stringify(industry),
    });
  }

  async updateIndustry(id: string, industry: Partial<Omit<Industry, 'id' | 'created_at' | 'updated_at'>>): Promise<Industry> {
    return this.request<Industry>(`/industries/${id}`, {
      method: 'PUT',
      body: JSON.stringify(industry),
    });
  }

  async deleteIndustry(id: string): Promise<{ message: string }> {
    return this.request<{ message: string }>(`/industries/${id}`, {
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
