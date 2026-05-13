import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { NotificationService } from '../services/notification.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const notificationService = inject(NotificationService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let errorMessage = 'Ha ocurrido un error inesperado';

      if (error.error instanceof ErrorEvent) {
        // Error del cliente
        errorMessage = error.error.message;
      } else {
        // Error del servidor
        switch (error.status) {
          case 0:
            errorMessage = 'No se puede conectar al servidor. Verifique su conexión.';
            break;
          case 400:
            const errors400 = error.error?.errors;
            if (Array.isArray(errors400) && errors400.length > 0) {
              errorMessage = errors400.map((e: any) => e.message).join('. ');
            } else {
              errorMessage = error.error?.message || 'Solicitud incorrecta';
            }
            break;
          case 403:
            errorMessage = 'No tiene permisos para realizar esta acción';
            break;
          case 404:
            errorMessage = 'Recurso no encontrado';
            break;
          case 409:
            errorMessage = error.error?.message || 'Conflicto con el recurso';
            break;
          case 422:
            errorMessage = 'Datos de entrada inválidos';
            break;
          case 429:
            errorMessage = 'Demasiadas solicitudes. Por favor espere.';
            break;
          case 500:
            errorMessage = 'Error interno del servidor';
            break;
          case 503:
            errorMessage = 'Servicio no disponible';
            break;
          default:
            errorMessage = error.error?.message || `Error ${error.status}`;
        }
      }

      // Mostrar notificación de error (excepto 401 que se maneja en auth interceptor)
      if (error.status !== 401) {
        notificationService.error(errorMessage);
      }

      return throwError(() => error);
    })
  );
};
