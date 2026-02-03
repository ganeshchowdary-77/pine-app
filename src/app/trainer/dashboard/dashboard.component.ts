import { Component, inject, OnInit, signal } from '@angular/core';
import { AuthService } from '../../auth/auth-service';
import { TrainerDashboardService } from '../services/trainer-dashboard.service';
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
  private authService = inject(AuthService);
  private dashboardService = inject(TrainerDashboardService);

  stats = signal({
    totalTrainings: 0,
    ongoingTrainings: 0,
    completedTrainings: 0,
    totalEarnings: 0,
    pendingInvoices: 0
  });

  currentUser = signal<{ name: string; email: string } | null>(null);
  welcomeMessage = signal<string>('');

  isLoading = signal(false);
  error = signal<string | null>(null);

  ngOnInit() {
    this.loadUserData();
  }

  private loadUserData() {
    const user = this.authService.getUser();

    if (user) {
      this.currentUser.set({
        name: user.email.split('@')[0],
        email: user.email
      });

      if (user.role === 'trainer' && user.trainerId) {
        this.loadDashboardData(user.trainerId);
      } else {
        this.error.set('User is not a trainer or missing trainer ID');
      }
    } else {
      // Not logged in, redirect
      this.router.navigate(['/auth/login']);
    }
  }

  private loadDashboardData(trainerId: number) {
    this.isLoading.set(true);
    this.dashboardService.getDashboardData(trainerId).subscribe({
      next: (data) => {
        // Update stats
        this.stats.set(data.stats);

        // Update user info with real name from trainer profile
        if (data.trainer) {
          this.currentUser.set({
            name: data.trainer.name,
            email: data.trainer.email
          });
          this.welcomeMessage.set(`Welcome, ${data.trainer.name}!`);
        }

        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Error loading dashboard data', err);
        this.error.set('Failed to load dashboard data. Your session may be invalid (User/Trainer ID mismatch).');
        this.isLoading.set(false);
      }
    });
  }

  logout() {
    this.authService.logout();
  }
}
