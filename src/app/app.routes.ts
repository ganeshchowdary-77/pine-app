import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth-guard';
import { adminGuard } from './core/guards/admin-guard';
import { trainerGuard } from './core/guards/trainer-guard';

export const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.routes').then((m) => m.AUTH_ROUTES),
  },
  {
    path: 'admin',
    canActivate: [authGuard, adminGuard],
    loadChildren: () => import('./admin/admin.routes').then((m) => m.ADMIN_ROUTES),
  },
  {
    path: 'trainer',
    canActivate: [authGuard, trainerGuard],
    loadChildren: () => import('./trainer/trainer.routes').then((m) => m.TRAINER_ROUTES),
  },
  {
    path: '',
    redirectTo: 'auth',
    pathMatch: 'full',
  },
];
