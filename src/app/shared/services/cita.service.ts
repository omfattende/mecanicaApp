import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

export interface Cita {
    id?: number;
    usuario_id: number;
    vehiculo_id: number;
    fecha: string;
    hora: string;
    servicio: string;
    descripcion?: string;
    repuestos_solicitados?: string;
    repuestos_propios?: string;
    estado?: string;
    cliente_nombre?: string;
    cliente_telefono?: string;
    marca?: string;
    modelo?: string;
    placa?: string;
}

@Injectable({
    providedIn: 'root'
})
export class CitaService {
    private apiUrl = `${environment.apiUrl}/citas`;

    constructor(private http: HttpClient) { }

    getCitas(): Observable<{ success: boolean, citas: Cita[] }> {
        return this.http.get<{ success: boolean, data: { citas: Cita[] } }>(this.apiUrl).pipe(
            map(res => ({ success: res.success, citas: res.data?.citas || [] }))
        );
    }

    getCitasByCliente(usuarioId: number): Observable<{ success: boolean, citas: Cita[] }> {
        return this.http.get<{ success: boolean, data: { citas: Cita[] } }>(`${this.apiUrl}/cliente/${usuarioId}`).pipe(
            map(res => ({ success: res.success, citas: res.data?.citas || [] }))
        );
    }

    crearCita(cita: Cita): Observable<{ success: boolean, cita: Cita, message: string }> {
        return this.http.post<{ success: boolean, data: { cita: Cita }, message: string }>(this.apiUrl, cita).pipe(
            map(res => ({ success: res.success, cita: res.data?.cita as Cita, message: res.message || 'Cita creada exitosamente' }))
        );
    }

    actualizarEstadoCita(id: number, estado: string): Observable<{ success: boolean, cita: Cita, message: string }> {
        return this.http.put<{ success: boolean, data: { cita: Cita }, message: string }>(`${this.apiUrl}/${id}/estado`, { estado }).pipe(
            map(res => ({ success: res.success, cita: res.data?.cita as Cita, message: res.message || 'Estado actualizado exitosamente' }))
        );
    }
}
