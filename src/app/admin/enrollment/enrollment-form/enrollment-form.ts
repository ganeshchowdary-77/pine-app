import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { EnrollmentService } from '../../../shared/services/enrollment.service';
import { CompanyService } from '../../../shared/services/company.service';
import { TrainerService } from '../../../shared/services/trainer.service';
import { TrainingRequestService } from '../../../shared/services/training-request.service';

@Component({
  selector: 'app-enrollment-form',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './enrollment-form.html',
  styleUrl: './enrollment-form.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EnrollmentForm implements OnInit {
  private enrollmentService = inject(EnrollmentService);
  private companyService = inject(CompanyService);
  private trainerService = inject(TrainerService);
  private requestService = inject(TrainingRequestService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private fb = inject(FormBuilder);

  form = this.fb.group({
    companyId: [null as number | null, Validators.required],
    trainerId: [null as number | null, Validators.required],
    technology: ['', Validators.required],
    startDate: ['', Validators.required],
    endDate: ['', Validators.required],
    budget: [null as number | null, [Validators.required, Validators.min(0)]],
    requestId: [null as number | null],
    status: ['REQUESTED' as string, Validators.required]
  });

  companies = toSignal(this.companyService.getAll(), { initialValue: [] });
  trainers = toSignal(this.trainerService.getAll(), { initialValue: [] });

  enrollmentId = signal<number | null>(null);

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    const requestId = this.route.snapshot.queryParamMap.get('requestId');

    if (id) {
      this.enrollmentId.set(Number(id));
      this.loadEnrollment(this.enrollmentId()!);
    } else if (requestId) {
      this.loadFromRequest(Number(requestId));
    }
  }

  loadFromRequest(requestId: number) {
    this.requestService.getById(requestId).subscribe(request => {
      // Try to find matching company or at least pre-fill the form
      const company = this.companies().find(c => 
        c.name.toLowerCase() === request.companyName.toLowerCase()
      );

      this.form.patchValue({
        companyId: company ? company.id : null,
        technology: request.technology,
        startDate: request.startDate,
        endDate: request.endDate,
        budget: request.budget,
        requestId: request.id,
        status: 'APPROVED'
      });
    });
  }

  loadEnrollment(id: number) {
    this.enrollmentService.getById(id).subscribe(data => {
      this.form.patchValue({
        companyId: data.companyId,
        trainerId: data.trainerId,
        technology: data.technology,
        startDate: data.startDate.split('T')[0], // Ensure date format
        endDate: data.endDate.split('T')[0],
        budget: data.budget,
        requestId: data.requestId || null,
        status: data.status
      });
    });
  }

  save() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const formValue = this.form.value;
    const enrollmentData = {
      ...formValue,
      companyId: Number(formValue.companyId),
      trainerId: Number(formValue.trainerId),
      budget: Number(formValue.budget),
      technology: formValue.technology || undefined,
      startDate: formValue.startDate || undefined,
      endDate: formValue.endDate || undefined,
      requestId: formValue.requestId || undefined,
      status: (formValue.status || 'REQUESTED') as 'REQUESTED' | 'APPROVED' | 'ONGOING' | 'COMPLETED'
    };

    if (this.enrollmentId()) {
      this.enrollmentService.update(this.enrollmentId()!, enrollmentData)
        .subscribe(() => {
          this.router.navigate(['/admin/enrollments']);
        });
    } else {
      this.enrollmentService.create(enrollmentData)
        .subscribe(() => {
          this.router.navigate(['/admin/enrollments']);
        });
    }
  }
}
