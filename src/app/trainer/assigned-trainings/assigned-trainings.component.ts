import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../auth/auth-service';
import { EnrollmentService, CompanyService, PurchaseOrderService } from '../../shared/services';
import { Enrollment, Company, PurchaseOrder } from '../../shared/models';
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
  private poService = inject(PurchaseOrderService);

  trainings = signal<Enrollment[]>([]);
  companyMap = signal<Map<string, Company>>(new Map());
  poMap = signal<Map<string, PurchaseOrder>>(new Map());
  isLoading = signal(false);

  // Computed signals for categorization
  ongoingTrainings = computed(() =>
    this.trainings().filter(t => t.status === 'ONGOING')
  );

  newRequests = computed(() =>
    this.trainings().filter(t => t.status === 'REQUESTED')
  );

  historyTrainings = computed(() =>
    this.trainings().filter(t => t.status === 'COMPLETED' || t.status === 'REJECTED')
  );

  ngOnInit() {
    this.loadData();
  }

  private loadData() {
    const user = this.authService.getUser();
    if (!user || user.role !== 'trainer' || !user.trainerId) return;

    this.isLoading.set(true);

    forkJoin({
      enrollments: this.enrollmentService.getByTrainerId(user.trainerId),
      companies: this.companyService.getAll(),
      pos: this.poService.getTrainerPOs()
    }).subscribe({
      next: ({ enrollments, companies, pos }) => {
        // Create company map
        const map = new Map<string, Company>();
        companies.forEach(c => map.set(String(c.id), c));
        this.companyMap.set(map);

        // Create PO map
        const poMap = new Map<string, PurchaseOrder>();
        pos.forEach(p => {
          if (p.enrollmentId) poMap.set(String(p.enrollmentId), p);
        });
        this.poMap.set(poMap);

        this.trainings.set(enrollments);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Error loading training data', err);
        this.isLoading.set(false);
      }
    });
  }

  getCompanyName(companyId: string): string {
    const company = this.companyMap().get(companyId);
    return company ? company.name : 'Unknown Company';
  }

  getDuration(start: string, end: string): string {
    const startDate = new Date(start);
    const endDate = new Date(end);
    const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // Include start day
    return `${diffDays} Days`;
  }

  getCost(enrollmentId: string): number | null {
    const po = this.poMap().get(enrollmentId);
    return po ? po.totalAmount : null;
  }

  acceptAssignment(id: string) {
    this.updateStatus(id, 'ONGOING');
  }

  rejectAssignment(id: string) {
    this.updateStatus(id, 'REJECTED');
  }

  private updateStatus(id: string, status: 'ONGOING' | 'REJECTED') {
    this.isLoading.set(true);
    this.enrollmentService.updateStatus(id, status).subscribe({
      next: (updatedEnrollment) => {
        this.trainings.update(current =>
          current.map(t => t.id === id ? updatedEnrollment : t)
        );
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error(`Error updating assignment to ${status}`, err);
        this.isLoading.set(false);
      }
    });
  }
}

