import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { catchError, of } from 'rxjs';
import { EnrollmentService } from '../../../shared/services/enrollment.service';

@Component({
  selector: 'app-enrollment-list',
  imports: [RouterLink],
  templateUrl: './enrollment-list.html',
  styleUrl: './enrollment-list.css',
})
export class EnrollmentList {

  private enrollmentService = inject(EnrollmentService);

  enrollments = toSignal(this.loadEnrollments(), {
    initialValue: []
  });

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
        this.enrollments = toSignal(this.loadEnrollments(), {
          initialValue: []
        });
      });
    }
  }
}
