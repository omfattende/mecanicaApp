import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { User } from '../../auth/auth.service';
import { environment } from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class UsuarioService {
    private apiUrl = `${environment.apiUrl}/usuarios`;

    constructor(private http: HttpClient) { }

    getUsuarios(): Observable<any> {
        return this.http.get(`${this.apiUrl}`).pipe(
            map((res: any) => ({ ...res, usuarios: res.data?.usuarios || [] }))
        );
    }

    actualizarUsuario(id: number | string, data: Partial<User>): Observable<any> {
        return this.http.put(`${this.apiUrl}/${id}`, data).pipe(
            map((res: any) => ({ ...res, usuario: res.data?.usuario }))
        );
    }
}
