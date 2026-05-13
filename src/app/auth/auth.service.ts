import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, firstValueFrom } from 'rxjs';
import { environment } from '../../environments/environment';

export interface User {
  id: string;
  username: string;
  email: string;
  nombre: string;
  telefono: string;
  tipo: 'admin' | 'cliente';
  foto?: string; // Nuevo campo opcional para la URL de la foto
  password?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = environment.apiUrl;
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();
  private initialized = false;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private http: HttpClient
  ) {
    this.initializeAuth();
  }

  private async initializeAuth(): Promise<void> {
    if (isPlatformBrowser(this.platformId)) {
      const token = localStorage.getItem('token');

      if (token) {
        try {
          const response: any = await firstValueFrom(
            this.http.get(`${this.apiUrl}/auth/verify`, {
              headers: { Authorization: `Bearer ${token}` }
            })
          );

          if (response.success) {
            const user = response.data?.user || response.user;
            this.currentUserSubject.next(user);
            this.isAuthenticatedSubject.next(true);
          } else {
            this.clearAuth();
          }
        } catch (error) {
          console.error('Error al verificar token:', error);
          this.clearAuth();
        }
      }
    }
    this.initialized = true;
  }

  async login(username: string, password: string): Promise<boolean> {
    try {
      const response: any = await firstValueFrom(
        this.http.post(`${this.apiUrl}/auth/login`, { username, password })
      );

      if (response.success) {
        const token = response.data?.token || response.token;
        const user = response.data?.user || response.user;
        if (isPlatformBrowser(this.platformId)) {
          localStorage.setItem('token', token);
          localStorage.setItem('currentUser', JSON.stringify(user));
        }
        this.currentUserSubject.next(user);
        this.isAuthenticatedSubject.next(true);
        return true;
      }
      return false;
    } catch (error: any) {
      console.error('Error en login:', error);
      return false;
    }
  }

  async register(userData: Omit<User, 'id' | 'tipo'>, password: string): Promise<{ success: boolean; message: string }> {
    try {
      const response: any = await firstValueFrom(
        this.http.post(`${this.apiUrl}/auth/register`, {
          ...userData,
          password
        })
      );

      return {
        success: response.success,
        message: response.message
      };
    } catch (error: any) {
      const errors = error.error?.errors;
      let message = error.error?.message || 'Error al registrar usuario';
      
      if (Array.isArray(errors) && errors.length > 0) {
        message = errors.map((e: any) => e.message).join('. ');
      }
      
      return {
        success: false,
        message
      };
    }
  }

  logout(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('token');
      localStorage.removeItem('currentUser');
    }
    this.currentUserSubject.next(null);
    this.isAuthenticatedSubject.next(false);
  }

  private clearAuth(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('token');
      localStorage.removeItem('currentUser');
    }
    this.currentUserSubject.next(null);
    this.isAuthenticatedSubject.next(false);
  }

  isAuthenticated(): boolean {
    if (!isPlatformBrowser(this.platformId)) {
      return false;
    }

    if (!this.initialized) {
      const token = localStorage.getItem('token');
      return !!token;
    }

    return this.isAuthenticatedSubject.value;
  }

  getCurrentUser(): User | null {
    if (!isPlatformBrowser(this.platformId)) {
      return null;
    }

    if (!this.initialized) {
      const userData = localStorage.getItem('currentUser');
      if (userData) {
        try {
          return JSON.parse(userData);
        } catch {
          return null;
        }
      }
      return null;
    }

    return this.currentUserSubject.value;
  }

  getToken(): string | null {
    if (!isPlatformBrowser(this.platformId)) {
      return null;
    }
    return localStorage.getItem('token');
  }

  isInitialized(): boolean {
    return this.initialized;
  }
}
