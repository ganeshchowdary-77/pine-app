import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AdminNavbarComponent } from '../admin-navbar/admin-navbar.component';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [CommonModule, RouterModule, AdminNavbarComponent],
  template: `
    <app-admin-navbar></app-admin-navbar>
    <router-outlet></router-outlet>
  `,
  styles: []
})
export class AdminLayoutComponent {}
