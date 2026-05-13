import { CanActivateFn, Router } from '@angular/router';
import { inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { AuthService } from './auth.service';

export const LoginGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const platformId = inject(PLATFORM_ID);

  // En el servidor, permitir acceso
  if (!isPlatformBrowser(platformId)) {
    return true;
  }

  // Si ya está autenticado, redirigir según el tipo de usuario
  if (authService.isAuthenticated()) {
    const currentUser = authService.getCurrentUser();
    if (currentUser?.tipo === 'admin') {
      router.navigate(['/admin']);
    } else {
      router.navigate(['/cliente']);
    }
    return false;
  }

  return true;
};
