import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

export interface Vehiculo {
    id?: number;
    usuario_id: number;
    marca: string;
    modelo: string;
    anio: number;
    placa: string;
    color?: string;
    kilometraje?: number;
}

@Injectable({
    providedIn: 'root'
})
export class VehiculoService {
    private apiUrl = `${environment.apiUrl}/vehiculos`;

    constructor(private http: HttpClient) { }

    getVehiculosByUsuario(usuarioId: number): Observable<{ success: boolean, vehiculos: Vehiculo[] }> {
        const token = localStorage.getItem('token');
        const headers: any = {};
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }
        return this.http.get<{ success: boolean, data: { vehiculos: Vehiculo[] } }>(`${this.apiUrl}/usuario/${usuarioId}`, { headers }).pipe(
            map(res => ({ success: res.success, vehiculos: res.data?.vehiculos || [] }))
        );
    }

    registrarVehiculo(vehiculo: Vehiculo): Observable<{ success: boolean, vehiculo: Vehiculo, message: string }> {
        const token = localStorage.getItem('token');
        const headers: any = { 'Content-Type': 'application/json' };
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }
        return this.http.post<{ success: boolean, data: { vehiculo: Vehiculo }, message: string }>(this.apiUrl, vehiculo, { headers }).pipe(
            map(res => ({ success: res.success, vehiculo: res.data?.vehiculo as Vehiculo, message: res.message || 'Vehículo registrado exitosamente' }))
        );
    }
}
