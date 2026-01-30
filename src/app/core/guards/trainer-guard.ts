import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../../auth/auth-service';

export const trainerGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const authService = inject(AuthService);

  const user = authService.getUser();

  if (user && user.role === 'trainer') {
    return true;
  }

  router.navigate(['/auth/login']);
  return false;
};
