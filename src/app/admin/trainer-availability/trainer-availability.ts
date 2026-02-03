import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { catchError, forkJoin, map, of } from 'rxjs';
import { TrainerService } from '../../shared/services/trainer.service';
import { EnrollmentService } from '../../shared/services/enrollment.service';

@Component({
  selector: 'app-trainer-availability',
  imports: [RouterLink],
  templateUrl: './trainer-availability.html',
  styleUrl: './trainer-availability.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TrainerAvailability {

  private trainerService = inject(TrainerService);
  private enrollmentService = inject(EnrollmentService);

  data = toSignal(this.loadData(), {
    initialValue: { trainers: [], enrollments: [] }
  });

  loadData() {
    return forkJoin({
      trainers: this.trainerService.getAll(),
      enrollments: this.enrollmentService.getAll()
    }).pipe(
      catchError(err => {
        console.error(err);
        return of({ trainers: [], enrollments: [] });
      })
    );
  }

  // Assigned trainers
  assigned = computed(() => {
    const { trainers, enrollments } = this.data();

    const activeTrainerIds = new Set(
      enrollments
        .filter(e =>
          e.status === 'APPROVED' || e.status === 'ONGOING'
        )
        .map(e => e.trainerId)
    );

    return trainers.filter(t => activeTrainerIds.has(t.id));
  });

  // Available trainers
  available = computed(() => {
    const { trainers, enrollments } = this.data();

    const activeTrainerIds = new Set(
      enrollments
        .filter(e =>
          e.status === 'APPROVED' || e.status === 'ONGOING'
        )
        .map(e => e.trainerId)
    );

    return trainers.filter(t => !activeTrainerIds.has(t.id));
  });
}
