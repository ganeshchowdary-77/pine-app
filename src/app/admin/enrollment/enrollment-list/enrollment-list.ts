import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { catchError, forkJoin, of, switchMap, BehaviorSubject } from 'rxjs';
import { EnrollmentService } from '../../../shared/services/enrollment.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-enrollment-list',
  imports: [CommonModule, RouterLink],
  templateUrl: './enrollment-list.html',
  styleUrl: './enrollment-list.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EnrollmentList {

  private enrollmentService = inject(EnrollmentService);
  private http = inject(HttpClient);
  private router = inject(Router);
  private refreshTrigger = new BehaviorSubject<void>(void 0);

  data = toSignal(this.refreshTrigger.pipe(
    switchMap(() => this.loadData())
  ), {
    initialValue: { enrollments: [], pos: [], companies: [], trainers: [] }
  });

  loadData() {
    return this.enrollmentService.syncStatuses().pipe(
      switchMap(() => forkJoin({
        enrollments: this.enrollmentService.getAll(),
        pos: this.http.get<any[]>('http://localhost:3000/purchaseOrders'),
        companies: this.http.get<any[]>('http://localhost:3000/companies'),
        trainers: this.http.get<any[]>('http://localhost:3000/trainers')
      })),
      catchError(err => {
        console.error(err);
        return of({ enrollments: [], pos: [], companies: [], trainers: [] });
      })
    );
  }

  enrollments = computed(() => this.data().enrollments);
  pos = computed(() => this.data().pos);
  companies = computed(() => this.data().companies);
  trainers = computed(() => this.data().trainers);

  // Helper methods to get names
  getCompanyName(companyId: number | string): string {
    const company = this.companies().find((c: any) => c.id == companyId);
    return company?.name || `Company #${companyId}`;
  }

  getTrainerName(trainerId: number | string | null | undefined): string {
    if (!trainerId) return 'Not Assigned';
    const trainer = this.trainers().find((t: any) => t.id == trainerId);
    return trainer?.name || `Trainer #${trainerId}`;
  }

  // ✅ Requested = trainer acceptance pending
  requested = computed(() => {
    const enrollments = this.enrollments();
    const pos = this.pos();

    return enrollments.filter(e => {
      if (e.status !== 'REQUESTED') return false;

      const trainerPO = pos.find(
        (p: any) => p.enrollmentId == e.id && p.type === 'TRAINER'
      );

      return trainerPO && trainerPO.status !== 'ACCEPTED';
    });
  });

  approved = computed(() =>
    this.enrollments().filter(e => e.status === 'APPROVED')
  );

  ongoing = computed(() =>
    this.enrollments().filter(e => e.status === 'ONGOING')
  );

  completed = computed(() =>
    this.enrollments().filter(e => e.status === 'COMPLETED')
  );

  editEnrollment(id: number | string) {
    this.router.navigate(['/admin/enrollments/edit', id]);
  }

  deleteEnrollment(id: number | string) {
    if (confirm('Are you sure you want to delete this enrollment?')) {
      this.enrollmentService.delete(id).subscribe({
        next: () => {
          console.log('[LIST] Enrollment deleted successfully');
          this.refreshTrigger.next();
        },
        error: err => console.error('[LIST] Delete error:', err)
      });
    }
  }
}
