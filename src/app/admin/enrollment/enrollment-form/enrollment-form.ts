import { effect, ChangeDetectionStrategy, ChangeDetectorRef, Component, computed, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { forkJoin, of } from 'rxjs';

import { EnrollmentService } from '../../../shared/services/enrollment.service';
import { PurchaseOrderService } from '../../../shared/services/purchase-order.service';
import { CompanyService } from '../../../shared/services/company.service';
import { TrainerService } from '../../../shared/services/trainer.service';
import { TrainingRequestService } from '../../../shared/services/training-request.service';
import { MailService } from '../../../shared/services/mail.service';
import { Enrollment, PurchaseOrder } from '../../../shared/models';

@Component({
  selector: 'app-enrollment-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './enrollment-form.html',
  styleUrl: './enrollment-form.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EnrollmentForm implements OnInit {

  private enrollmentService = inject(EnrollmentService);
  private poService = inject(PurchaseOrderService);
  private companyService = inject(CompanyService);
  private trainerService = inject(TrainerService);
  private mailService = inject(MailService);
  private requestService = inject(TrainingRequestService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private fb = inject(FormBuilder);
  private cdr = inject(ChangeDetectorRef);

  form = this.fb.group({
    companyId: [null as string | null, Validators.required],
    trainerId: [null as string | null],
    technology: ['', Validators.required],
    startDate: ['', Validators.required],
    endDate: ['', Validators.required],
    budget: [null as number | null, [Validators.required, Validators.min(0)]],
    requestId: [null as string | null],
    status: ['REQUESTED' as string, Validators.required]
  });

  companies = toSignal(this.companyService.getAll(), { initialValue: [] });
  private allTrainers = toSignal(this.trainerService.getAll(), { initialValue: [] });
  private allEnrollments = toSignal(this.enrollmentService.getAll(), { initialValue: [] });

  // Track form values for filtering and fee calculation
  technologyValue = toSignal(this.form.get('technology')!.valueChanges, { initialValue: '' });
  startDateValue = toSignal(this.form.get('startDate')!.valueChanges, { initialValue: '' });
  endDateValue = toSignal(this.form.get('endDate')!.valueChanges, { initialValue: '' });
  trainerIdValue = toSignal(this.form.get('trainerId')!.valueChanges, { initialValue: null as string | null });

  enrollmentId = signal<string | null>(null);

  // Trainer availability & technology filter with fee calculation
  trainers = computed(() => {
    const trainers = this.allTrainers();
    const enrollments = this.allEnrollments();
    const currentId = this.enrollmentId();
    const selectedTech = (this.technologyValue() || this.form.get('technology')?.value || '').toLowerCase().trim();

    // Duration for fee calculation
    const start = this.startDateValue() || this.form.get('startDate')?.value;
    const end = this.endDateValue() || this.form.get('endDate')?.value;
    const { days, months } = this.calculateDuration(start, end);

    // 1. Filter by Availability
    const occupiedTrainerIds = new Set(
      enrollments
        .filter(e =>
          String(e.id) !== (currentId ? String(currentId) : null) &&
          (e.status === 'APPROVED' || e.status === 'ONGOING') &&
          e.trainerId
        )
        .map(e => String(e.trainerId))
    );

    let filtered = trainers.filter(t => !occupiedTrainerIds.has(String(t.id)));

    // 2. Filter by Technology (if specified)
    if (selectedTech) {
      filtered = filtered.filter(t => {
        const trainerTechs = (t.technologies || []).map((s: string) => s.toLowerCase());
        return trainerTechs.some((s: string) => s.includes(selectedTech) || selectedTech.includes(s));
      });
    }

    // 3. Calculate Fee for each trainer
    return filtered.map(t => ({
      ...t,
      calculatedFee: this.getTrainerFee(t, days, months)
    })) as any[];
  });

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    const requestId = this.route.snapshot.queryParamMap.get('requestId');

    if (id) {
      this.enrollmentId.set(id);
      this.loadEnrollment(this.enrollmentId()!);
    } else if (requestId) {
      this.loadFromRequest(requestId);
    }
  }

  // Prefill form from request
  loadFromRequest(requestId: string | null) {
    if (!requestId) return;
    console.log('Loading from request:', requestId);

    forkJoin({
      request: this.requestService.getById(requestId),
      companies: this.companyService.getAll()
    }).subscribe({
      next: ({ request, companies }) => {
        console.log('Found request:', request);

        // Robust matching: Exact match first, then fuzzy
        const company = companies.find(c =>
          c.name.toLowerCase().trim() === request.companyName.toLowerCase().trim()
        ) || companies.find(c =>
          c.name.toLowerCase().includes(request.companyName.toLowerCase()) ||
          request.companyName.toLowerCase().includes(c.name.toLowerCase())
        );

        console.log('Matched company:', company);

        this.form.patchValue({
          companyId: company ? company.id : null,
          technology: request.technology,
          startDate: request.startDate ? request.startDate.split('T')[0] : '',
          endDate: request.endDate ? request.endDate.split('T')[0] : '',
          budget: request.budget != null ? Number(request.budget) : null,
          requestId: request.id,
          status: 'REQUESTED'
        });

        console.log('Form value after patch:', this.form.value);
        this.cdr.detectChanges();
      },
      error: err => console.error('Error loading request for pre-fill:', err)
    });
  }

  // Load enrollment for editing
  loadEnrollment(id: string) {
    console.log('Loading enrollment:', id);
    this.enrollmentService.getById(id).subscribe({
      next: data => {
        if (!data) return;
        console.log('Enrollment data:', data);

        this.form.patchValue({
          companyId: data.companyId,
          trainerId: data.trainerId ?? null,
          technology: data.technology,
          startDate: data.startDate?.split('T')[0] ?? '',
          endDate: data.endDate?.split('T')[0] ?? '',
          budget: data.budget,
          requestId: data.requestId ?? null,
          status: data.status
        });

        console.log('Selected companyId:', this.form.get('companyId')?.value);
        console.log('Available company IDs:', this.companies().map(c => c.id));


        console.log('Form value after enrollment patch:', this.form.value);
        this.cdr.detectChanges();
      },
      error: err => console.error('Error loading enrollment:', err)
    });
  }

  constructor() {
    // Auto-fill budget when trainer is selected
    effect(() => {
      const trainerId = this.trainerIdValue();
      if (trainerId) {
        const selectedTrainer = this.trainers().find(t => String(t.id) === String(trainerId)) as any;
        if (selectedTrainer && selectedTrainer.calculatedFee > 0) {
          this.form.patchValue({ budget: selectedTrainer.calculatedFee });
        }
      }
    });
  }

  private calculateDuration(start: string | null | undefined, end: string | null | undefined): { days: number, months: number } {
    if (!start || !end) return { days: 0, months: 0 };

    const startDate = new Date(start);
    const endDate = new Date(end);

    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) return { days: 0, months: 0 };

    const diffTime = endDate.getTime() - startDate.getTime();
    if (diffTime < 0) return { days: 0, months: 0 };

    const days = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // Inclusive
    const months = (endDate.getFullYear() - startDate.getFullYear()) * 12 + (endDate.getMonth() - startDate.getMonth()) + 1;

    return { days, months };
  }

  private getTrainerFee(trainer: any, days: number, months: number): number {
    const rate = Number(trainer.rate) || 0;
    if (trainer.paymentType === 'daily') {
      return days * rate;
    } else if (trainer.paymentType === 'hourly') {
      return days * 8 * rate;
    } else if (trainer.paymentType === 'monthly') {
      return months * rate;
    }
    return 0;
  }

  save() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const formValue = this.form.getRawValue();

    const isNew = !this.enrollmentId();

    const enrollmentData: any = {
      companyId: formValue.companyId,
      trainerId: formValue.trainerId ?? null,
      budget: formValue.budget != null ? Number(formValue.budget) : null,
      technology: formValue.technology,
      startDate: formValue.startDate,
      endDate: formValue.endDate,
      requestId: formValue.requestId ?? null,
      status: formValue.status
    };

    console.log('Saving Enrollment:', enrollmentData);

    if (!isNew) {
      this.enrollmentService.update(this.enrollmentId()!, enrollmentData)
        .subscribe({
          next: () => this.router.navigate(['/admin/enrollments']),
          error: err => console.error('Update error:', err)
        });
    } else {
      this.enrollmentService.create(enrollmentData)
        .subscribe({
          next: (newEnrollment) => {
            const enrollmentId = newEnrollment.id;
            const poRequests = [];

            // 1. Create Client PO
            const clientPO: Partial<PurchaseOrder> = {
              enrollmentId: enrollmentId,
              type: 'CLIENT',
              totalAmount: enrollmentData.budget || 0,
              status: 'GENERATED',
              paymentTerms: 'Net 30'
            };
            poRequests.push(this.poService.create(clientPO));

            // 2. Create Trainer PO (if trainer assigned)
            if (enrollmentData.trainerId) {
              const trainer = this.trainers().find(t => t.id == enrollmentData.trainerId);
              if (trainer) {
                const { days, months } = this.calculateDuration(enrollmentData.startDate, enrollmentData.endDate);
                const trainerPO: Partial<PurchaseOrder> = {
                  enrollmentId: enrollmentId,
                  type: 'TRAINER',
                  paymentType: trainer.paymentType,
                  rate: trainer.rate,
                  totalAmount: this.getTrainerFee(trainer, days, months),
                  status: 'GENERATED',
                  paymentTerms: 'Upon completion'
                };
                poRequests.push(this.poService.create(trainerPO));
              }
            }

            if (poRequests.length > 0) {
              console.log('Sending PO requests...', poRequests.length);
              forkJoin(poRequests).subscribe({
                next: () => {
                  console.log('POs created successfully, checking for email notification...');
                  // 3. Send Email Notification
                  if (enrollmentData.trainerId) {
                    const trainer = this.allTrainers().find((t: any) => String(t.id) === String(enrollmentData.trainerId));
                    const company = this.companies().find((c: any) => String(c.id) === String(enrollmentData.companyId));

                    console.log('[FORM] Email Lookup Result:', {
                      foundTrainer: !!trainer,
                      foundCompany: !!company,
                      trainerId: enrollmentData.trainerId,
                      companyId: enrollmentData.companyId
                    });

                    if (trainer && company) {
                      console.log('[FORM] Calling MailService.sendTrainerEnrollmentNotification...');
                      this.mailService.sendTrainerEnrollmentNotification(trainer, enrollmentData, company.name);
                    } else {
                      console.warn('[FORM] Could not send email: Trainer or Company not found in local lists.');
                    }
                  }

                  // 4. Cleanup Training Request if exists
                  if (enrollmentData.requestId) {
                    console.log('[FORM] Cleaning up training request:', enrollmentData.requestId);
                    this.requestService.delete(enrollmentData.requestId).subscribe({
                      next: () => console.log('[FORM] Request deleted successfully'),
                      error: err => console.warn('[FORM] Cleanup error:', err)
                    });
                  }

                  this.router.navigate(['/admin/enrollments']);
                },
                error: (err) => console.error('Error creating POs:', err)
              });
            } else {
              this.router.navigate(['/admin/enrollments']);
            }
          },
          error: err => console.error('Create error:', err)
        });
    }
  }
}
