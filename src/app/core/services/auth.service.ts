import { Injectable, signal, computed, effect, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { firstValueFrom, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { User, LoginRequest, RegisterRequest, AuthResponse, ApiResponse } from '../models';
import { environment } from '../../../environments/environment';
import { NotificationService } from './notification.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/auth`;
  
  // Signals para estado reactivo
  private currentUser = signal<User | null>(null);
  private initialized = signal<boolean>(false);
  
  // Computed values
  readonly user = computed(() => this.currentUser());
  readonly isAuthenticated = computed(() => !!this.currentUser());
  readonly isAdmin = computed(() => this.currentUser()?.tipo === 'admin');
  readonly isCliente = computed(() => this.currentUser()?.tipo === 'cliente');
  readonly isMecanico = computed(() => this.currentUser()?.tipo === 'mecanico');
  readonly isReady = computed(() => this.initialized());

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private http: HttpClient,
    private router: Router,
    private notificationService: NotificationService
  ) {
    // Inicializar auth al cargar
    this.initializeAuth();
  }

  private async initializeAuth(): Promise<void> {
    if (!isPlatformBrowser(this.platformId)) {
      this.initialized.set(true);
      return;
    }

    try {
      const response = await firstValueFrom(
        this.http.get<AuthResponse>(`${this.apiUrl}/me`).pipe(
          catchError(() => of(null))
        )
      );

      if (response?.success && response.data?.user) {
        this.currentUser.set(response.data.user);
      }
    } catch (error) {
      console.error('Error initializing auth:', error);
    } finally {
      this.initialized.set(true);
    }
  }

  async login(credentials: LoginRequest): Promise<boolean> {
    try {
      const response = await firstValueFrom(
        this.http.post<AuthResponse>(`${this.apiUrl}/login`, credentials)
      );

      if (response.success && response.data?.user) {
        this.currentUser.set(response.data.user);
        this.notificationService.success('Bienvenido ' + response.data.user.nombre);
        return true;
      }
      return false;
    } catch (error: any) {
      const message = error.error?.message || 'Error al iniciar sesión';
      this.notificationService.error(message);
      return false;
    }
  }

  async register(data: RegisterRequest): Promise<{ success: boolean; message: string }> {
    try {
      const response = await firstValueFrom(
        this.http.post<ApiResponse>(`${this.apiUrl}/register`, data)
      );

      return {
        success: response.success,
        message: response.message || 'Registro exitoso'
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.error?.message || 'Error al registrar usuario'
      };
    }
  }

  async logout(): Promise<void> {
    try {
      await firstValueFrom(
        this.http.post<AuthResponse>(`${this.apiUrl}/logout`, {})
      );
    } catch (error) {
      console.error('Error en logout:', error);
    } finally {
      this.currentUser.set(null);
      this.router.navigate(['/login']);
      this.notificationService.info('Sesión cerrada');
    }
  }

  async updateProfile(data: Partial<User>): Promise<boolean> {
    try {
      const response = await firstValueFrom(
        this.http.put<ApiResponse<{ user: User }>>(
          `${environment.apiUrl}/usuarios/profile`, 
          data
        )
      );

      if (response.success && response.data?.user) {
        this.currentUser.set(response.data.user);
        this.notificationService.success('Perfil actualizado');
        return true;
      }
      return false;
    } catch (error: any) {
      const message = error.error?.message || 'Error al actualizar perfil';
      this.notificationService.error(message);
      return false;
    }
  }

  async changePassword(currentPassword: string, newPassword: string): Promise<boolean> {
    try {
      const response = await firstValueFrom(
        this.http.put<ApiResponse>(`${environment.apiUrl}/usuarios/change-password`, {
          currentPassword,
          newPassword
        })
      );

      if (response.success) {
        this.notificationService.success('Contraseña cambiada exitosamente');
        return true;
      }
      return false;
    } catch (error: any) {
      const message = error.error?.message || 'Error al cambiar contraseña';
      this.notificationService.error(message);
      return false;
    }
  }

  // Helper para esperar a que se inicialice la auth
  waitForAuth(): Promise<void> {
    return new Promise((resolve) => {
      if (this.initialized()) {
        resolve();
        return;
      }

      const unsub = effect(() => {
        if (this.initialized()) {
          unsub.destroy();
          resolve();
        }
      });
    });
  }
}
