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

  ngOnInit() {
    // Mock data for demo - in real app, this would come from services
    this.loadDashboardData();
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
}
