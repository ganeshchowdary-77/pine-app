import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../auth/auth-service';

@Component({
  selector: 'app-admin-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './admin-navbar.component.html',
  styleUrls: ['./admin-navbar.component.css']
})
export class AdminNavbarComponent {
  private authService = inject(AuthService);
  private router = inject(Router);
  
  currentUser = this.authService.currentUser;
  isMenuOpen = signal(false);
  
  toggleMenu() {
    this.isMenuOpen.update(open => !open);
  }
  
  logout() {
    this.authService.logout();
  }
}
