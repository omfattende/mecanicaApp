import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { Vehiculo, CreateVehiculoRequest, UpdateVehiculoRequest, ApiResponse } from '../models';
import { environment } from '../../../environments/environment';
import { NotificationService } from './notification.service';

@Injectable({
  providedIn: 'root'
})
export class VehiculoService {
  private apiUrl = `${environment.apiUrl}/vehiculos`;
  
  // Signals
  private vehiculos = signal<Vehiculo[]>([]);
  private loading = signal<boolean>(false);
  
  // Computed
  readonly allVehiculos = computed(() => this.vehiculos());
  readonly isLoading = computed(() => this.loading());

  constructor(
    private http: HttpClient,
    private notificationService: NotificationService
  ) {}

  async loadVehiculos(): Promise<void> {
    this.loading.set(true);
    try {
      const response = await firstValueFrom(
        this.http.get<ApiResponse<{ vehiculos: Vehiculo[] }>>(this.apiUrl)
      );
      if (response.success && response.data?.vehiculos) {
        this.vehiculos.set(response.data.vehiculos);
      }
    } finally {
      this.loading.set(false);
    }
  }

  async loadMisVehiculos(): Promise<void> {
    this.loading.set(true);
    try {
      const response = await firstValueFrom(
        this.http.get<ApiResponse<{ vehiculos: Vehiculo[] }>>(`${this.apiUrl}/mis-vehiculos`)
      );
      if (response.success && response.data?.vehiculos) {
        this.vehiculos.set(response.data.vehiculos);
      }
    } finally {
      this.loading.set(false);
    }
  }

  async getVehiculo(id: number): Promise<Vehiculo | null> {
    try {
      const response = await firstValueFrom(
        this.http.get<ApiResponse<{ vehiculo: Vehiculo }>>(`${this.apiUrl}/${id}`)
      );
      return response.data?.vehiculo || null;
    } catch {
      return null;
    }
  }

  async createVehiculo(data: CreateVehiculoRequest): Promise<Vehiculo | null> {
    try {
      const response = await firstValueFrom(
        this.http.post<ApiResponse<{ vehiculo: Vehiculo }>>(this.apiUrl, data)
      );
      if (response.success && response.data?.vehiculo) {
        this.vehiculos.update(list => [...list, response.data!.vehiculo]);
        this.notificationService.success('Vehículo registrado exitosamente');
        return response.data.vehiculo;
      }
      return null;
    } catch (error: any) {
      this.notificationService.error(error.error?.message || 'Error al registrar vehículo');
      return null;
    }
  }

  async updateVehiculo(id: number, data: UpdateVehiculoRequest): Promise<Vehiculo | null> {
    try {
      const response = await firstValueFrom(
        this.http.put<ApiResponse<{ vehiculo: Vehiculo }>>(`${this.apiUrl}/${id}`, data)
      );
      if (response.success && response.data?.vehiculo) {
        this.vehiculos.update(list => 
          list.map(v => v.id === id ? response.data!.vehiculo : v)
        );
        this.notificationService.success('Vehículo actualizado exitosamente');
        return response.data.vehiculo;
      }
      return null;
    } catch (error: any) {
      this.notificationService.error(error.error?.message || 'Error al actualizar vehículo');
      return null;
    }
  }

  async deleteVehiculo(id: number): Promise<boolean> {
    try {
      await firstValueFrom(
        this.http.delete<ApiResponse>(`${this.apiUrl}/${id}`)
      );
      this.vehiculos.update(list => list.filter(v => v.id !== id));
      this.notificationService.success('Vehículo eliminado exitosamente');
      return true;
    } catch (error: any) {
      this.notificationService.error(error.error?.message || 'Error al eliminar vehículo');
      return false;
    }
  }

  getVehiculoById(id: number): Vehiculo | undefined {
    return this.vehiculos().find(v => v.id === id);
  }
}
