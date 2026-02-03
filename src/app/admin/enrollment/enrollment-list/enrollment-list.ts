import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { catchError, of } from 'rxjs';
import { EnrollmentService } from '../../../shared/services/enrollment.service';

@Component({
  selector: 'app-enrollment-list',
  imports: [RouterLink],
  templateUrl: './enrollment-list.html',
  styleUrl: './enrollment-list.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EnrollmentList {

  private enrollmentService = inject(EnrollmentService);

  // Raw enrollments signal
  enrollments = toSignal(this.loadEnrollments(), {
    initialValue: []
  });

  // Grouped signals
  requested = computed(() =>
    this.enrollments().filter(e => e.status === 'REQUESTED')
  );

  approved = computed(() =>
    this.enrollments().filter(e => e.status === 'APPROVED')
  );

  ongoing = computed(() =>
    this.enrollments().filter(e => e.status === 'ONGOING')
  );

  completed = computed(() =>
    this.enrollments().filter(e => e.status === 'COMPLETED')
  );

  loadEnrollments() {
    return this.enrollmentService.getAll().pipe(
      catchError(err => {
        console.error('Error fetching enrollments:', err);
        return of([]);
      })
    );
  }

  deleteEnrollment(id: number) {
    if (confirm('Are you sure you want to delete this enrollment?')) {
      this.enrollmentService.delete(id).subscribe(() => {
        // reload signal
        this.enrollments = toSignal(this.loadEnrollments(), {
          initialValue: []
        });
      });
    }
  }
}
