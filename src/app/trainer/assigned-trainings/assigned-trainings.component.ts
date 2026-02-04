import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../auth/auth-service';
import { EnrollmentService, CompanyService } from '../../shared/services';
import { Enrollment, Company } from '../../shared/models';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-assigned-trainings',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './assigned-trainings.component.html',
  styleUrls: ['./assigned-trainings.component.css']
})
export class AssignedTrainingsComponent implements OnInit {
  private authService = inject(AuthService);
  private enrollmentService = inject(EnrollmentService);
  private companyService = inject(CompanyService);

  trainings = signal<Enrollment[]>([]);
  companyMap = new Map<number | string, Company>();
  isLoading = signal(false);

  ngOnInit() {
    this.loadData();
  }

  private loadData() {
    const user = this.authService.getUser();
    if (!user || user.role !== 'trainer' || !user.trainerId) return;

    this.isLoading.set(true);

    forkJoin({
      enrollments: this.enrollmentService.getByTrainerId(user.trainerId),
      companies: this.companyService.getAll()
    }).subscribe({
      next: ({ enrollments, companies }) => {
        // Create company map
        companies.forEach(c => this.companyMap.set(c.id, c));

        this.trainings.set(enrollments);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Error loading training data', err);
        this.isLoading.set(false);
      }
    });
  }

  getCompanyName(companyId: number | string): string {
    const company = this.companyMap.get(companyId);
    return company ? company.name : 'Unknown Company';
  }
}
