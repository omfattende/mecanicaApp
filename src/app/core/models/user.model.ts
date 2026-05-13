export interface User {
  id: number;
  username: string;
  email: string;
  nombre: string;
  telefono: string;
  tipo: 'admin' | 'cliente' | 'mecanico';
  foto?: string;
  created_at?: string;
  updated_at?: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  nombre: string;
  telefono: string;
}

export interface AuthResponse {
  success: boolean;
  message?: string;
  data?: {
    user: User;
  };
}
