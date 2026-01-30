import { Routes } from '@angular/router';

export const routes: Routes = [
    {
      path: 'auth',
      loadChildren: () =>
        import('./auth/auth-module').then(m => m.AuthModule)
    },
    {
      path: 'admin',
      loadChildren: () =>
        import('./admin/admin-module').then(m => m.AdminModule)
    },
    {
      path: 'trainer',
      loadChildren: () =>
        import('./trainer/trainer-module').then(m => m.TrainerModule)
    },
    {
      path: '',
      redirectTo: 'auth',
      pathMatch: 'full'
    }
];
