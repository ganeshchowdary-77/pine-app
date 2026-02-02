import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-trainer-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class TrainerDashboardComponent implements OnInit {
  private router = inject(Router);

  stats = signal({
    totalTrainings: 0,
    ongoingTrainings: 0,
    completedTrainings: 0,
    totalEarnings: 0,
    pendingInvoices: 0
  });

  currentUser = signal<{ name: string; email: string } | null>(null);
  welcomeMessage = signal<string>('');

  ngOnInit() {
    // Load user data and dashboard data
    this.loadUserData();
    this.loadDashboardData();
  }

  private loadUserData() {
    // Get current user from localStorage
    const userStr = localStorage.getItem('currentUser');
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        this.currentUser.set(user);
        this.welcomeMessage.set(`Welcome, ${user.name || user.email || 'Trainer'}!`);
      } catch (e) {
        // Fallback to mock data
        this.setMockUser();
      }
    } else {
      // Fallback to mock data
      this.setMockUser();
    }
  }

  private setMockUser() {
    const mockUser = {
      name: 'John Davis',
      email: 'trainer1@pine.com'
    };
    this.currentUser.set(mockUser);
    this.welcomeMessage.set(`Welcome, ${mockUser.name}!`);
  }

  private loadDashboardData() {
    // Mock stats data
    this.stats.set({
      totalTrainings: 5,
      ongoingTrainings: 2,
      completedTrainings: 3,
      totalEarnings: 15000,
      pendingInvoices: 2
    });
  }

  logout() {
    // Clear any stored user data
    localStorage.removeItem('currentUser');
    localStorage.removeItem('token');
    
    // Navigate to login page
    this.router.navigate(['/auth/login']);
  }
}
