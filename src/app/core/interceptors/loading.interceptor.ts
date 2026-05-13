import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { finalize } from 'rxjs';
import { LoadingService } from '../services/loading.service';

let activeRequests = 0;

export const loadingInterceptor: HttpInterceptorFn = (req, next) => {
  const loadingService = inject(LoadingService);

  // No mostrar loading para requests de verificación de auth
  if (req.url.includes('/auth/verify') || req.url.includes('/auth/me')) {
    return next(req);
  }

  activeRequests++;
  loadingService.show();

  return next(req).pipe(
    finalize(() => {
      activeRequests--;
      if (activeRequests === 0) {
        loadingService.hide();
      }
    })
  );
};
