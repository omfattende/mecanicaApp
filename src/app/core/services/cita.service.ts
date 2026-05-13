import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { Cita, CreateCitaRequest, UpdateCitaRequest, EstadoCita, ApiResponse } from '../models';
import { environment } from '../../../environments/environment';
import { NotificationService } from './notification.service';

@Injectable({
  providedIn: 'root'
})
export class CitaService {
  private apiUrl = `${environment.apiUrl}/citas`;
  
  // Signals
  private citas = signal<Cita[]>([]);
  private loading = signal<boolean>(false);
  
  // Computed
  readonly allCitas = computed(() => this.citas());
  readonly isLoading = computed(() => this.loading());
  
  readonly citasPendientes = computed(() => 
    this.citas().filter(c => c.estado === 'Pendiente')
  );
  readonly citasEnProgreso = computed(() => 
    this.citas().filter(c => c.estado === 'En progreso')
  );
  readonly citasCompletadas = computed(() => 
    this.citas().filter(c => c.estado === 'Completada')
  );

  constructor(
    private http: HttpClient,
    private notificationService: NotificationService
  ) {}

  async loadCitas(): Promise<void> {
    this.loading.set(true);
    try {
      const response = await firstValueFrom(
        this.http.get<ApiResponse<{ citas: Cita[] }>>(this.apiUrl)
      );
      if (response.success && response.data?.citas) {
        this.citas.set(response.data.citas);
      }
    } finally {
      this.loading.set(false);
    }
  }

  async loadMisCitas(): Promise<void> {
    this.loading.set(true);
    try {
      const response = await firstValueFrom(
        this.http.get<ApiResponse<{ citas: Cita[] }>>(`${this.apiUrl}/mis-citas`)
      );
      if (response.success && response.data?.citas) {
        this.citas.set(response.data.citas);
      }
    } finally {
      this.loading.set(false);
    }
  }

  async loadCitasByUsuario(usuarioId: number): Promise<void> {
    this.loading.set(true);
    try {
      const response = await firstValueFrom(
        this.http.get<ApiResponse<{ citas: Cita[] }>>(`${this.apiUrl}/cliente/${usuarioId}`)
      );
      if (response.success && response.data?.citas) {
        this.citas.set(response.data.citas);
      }
    } finally {
      this.loading.set(false);
    }
  }

  async getCita(id: number): Promise<Cita | null> {
    try {
      const response = await firstValueFrom(
        this.http.get<ApiResponse<{ cita: Cita }>>(`${this.apiUrl}/${id}`)
      );
      return response.data?.cita || null;
    } catch {
      return null;
    }
  }

  async createCita(data: CreateCitaRequest): Promise<Cita | null> {
    try {
      const response = await firstValueFrom(
        this.http.post<ApiResponse<{ cita: Cita }>>(this.apiUrl, data)
      );
      if (response.success && response.data?.cita) {
        this.citas.update(list => [...list, response.data!.cita]);
        this.notificationService.success('Cita creada exitosamente');
        return response.data.cita;
      }
      return null;
    } catch (error: any) {
      this.notificationService.error(error.error?.message || 'Error al crear cita');
      return null;
    }
  }

  async updateCita(id: number, data: UpdateCitaRequest): Promise<Cita | null> {
    try {
      const response = await firstValueFrom(
        this.http.put<ApiResponse<{ cita: Cita }>>(`${this.apiUrl}/${id}`, data)
      );
      if (response.success && response.data?.cita) {
        this.citas.update(list => 
          list.map(c => c.id === id ? response.data!.cita : c)
        );
        this.notificationService.success('Cita actualizada exitosamente');
        return response.data.cita;
      }
      return null;
    } catch (error: any) {
      this.notificationService.error(error.error?.message || 'Error al actualizar cita');
      return null;
    }
  }

  async updateEstado(id: number, estado: EstadoCita): Promise<Cita | null> {
    try {
      const response = await firstValueFrom(
        this.http.put<ApiResponse<{ cita: Cita }>>(`${this.apiUrl}/${id}/estado`, { estado })
      );
      if (response.success && response.data?.cita) {
        this.citas.update(list => 
          list.map(c => c.id === id ? response.data!.cita : c)
        );
        this.notificationService.success('Estado actualizado exitosamente');
        return response.data.cita;
      }
      return null;
    } catch (error: any) {
      this.notificationService.error(error.error?.message || 'Error al actualizar estado');
      return null;
    }
  }

  async cancelarCita(id: number): Promise<Cita | null> {
    try {
      const response = await firstValueFrom(
        this.http.post<ApiResponse<{ cita: Cita }>>(`${this.apiUrl}/${id}/cancelar`, {})
      );
      if (response.success && response.data?.cita) {
        this.citas.update(list => 
          list.map(c => c.id === id ? response.data!.cita : c)
        );
        this.notificationService.success('Cita cancelada exitosamente');
        return response.data.cita;
      }
      return null;
    } catch (error: any) {
      this.notificationService.error(error.error?.message || 'Error al cancelar cita');
      return null;
    }
  }

  async deleteCita(id: number): Promise<boolean> {
    try {
      await firstValueFrom(
        this.http.delete<ApiResponse>(`${this.apiUrl}/${id}`)
      );
      this.citas.update(list => list.filter(c => c.id !== id));
      this.notificationService.success('Cita eliminada exitosamente');
      return true;
    } catch (error: any) {
      this.notificationService.error(error.error?.message || 'Error al eliminar cita');
      return false;
    }
  }

  getCitaById(id: number): Cita | undefined {
    return this.citas().find(c => c.id === id);
  }
}
