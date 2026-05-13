import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

export interface TareaServicio {
    id?: number;
    cita_id: number;
    descripcion: string;
    completada?: boolean;
    fecha_creacion?: string;
}

@Injectable({
    providedIn: 'root'
})
export class TareaService {
    private apiUrl = `${environment.apiUrl}/tareas`;

    constructor(private http: HttpClient) { }

    getTareasByCita(citaId: number): Observable<{ success: boolean, tareas: TareaServicio[] }> {
        return this.http.get<{ success: boolean, data: { tareas: TareaServicio[] } }>(`${this.apiUrl}/cita/${citaId}`).pipe(
            map(res => ({ success: res.success, tareas: res.data?.tareas || [] }))
        );
    }

    crearTarea(tarea: TareaServicio): Observable<{ success: boolean, tarea: TareaServicio, message: string }> {
        return this.http.post<{ success: boolean, data: { tarea: TareaServicio }, message: string }>(this.apiUrl, tarea).pipe(
            map(res => ({ success: res.success, tarea: res.data?.tarea as TareaServicio, message: res.message || 'Tarea creada exitosamente' }))
        );
    }

    actualizarTarea(id: number, completada: boolean): Observable<{ success: boolean, tarea: TareaServicio, message: string }> {
        return this.http.put<{ success: boolean, data: { tarea: TareaServicio }, message: string }>(`${this.apiUrl}/${id}`, { completada }).pipe(
            map(res => ({ success: res.success, tarea: res.data?.tarea as TareaServicio, message: res.message || 'Tarea actualizada exitosamente' }))
        );
    }

    eliminarTarea(id: number): Observable<{ success: boolean, message: string }> {
        return this.http.delete<{ success: boolean, message: string }>(`${this.apiUrl}/${id}`);
    }
}
