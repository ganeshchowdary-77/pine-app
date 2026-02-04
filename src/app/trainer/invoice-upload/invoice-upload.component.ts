import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { toSignal } from '@angular/core/rxjs-interop';
import { AuthService } from '../../auth/auth-service';
import { PurchaseOrderService, InvoiceService, EnrollmentService } from '../../shared/services';
import { PurchaseOrder } from '../../shared/models';
import { map, switchMap, startWith, forkJoin } from 'rxjs';

@Component({
  selector: 'app-invoice-upload',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule],
  templateUrl: './invoice-upload.component.html',
  styleUrls: ['./invoice-upload.component.css']
})
export class InvoiceUploadComponent implements OnInit {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private poService = inject(PurchaseOrderService);
  private invoiceService = inject(InvoiceService);
  private enrollmentService = inject(EnrollmentService);

  purchaseOrders = signal<(PurchaseOrder & { startDate?: string; endDate?: string })[]>([]);
  isSubmitting = false;
  submitSuccess = false;
  validationError = signal<string | null>(null);

  invoiceForm = this.fb.group({
    poId: ['', Validators.required],
    amount: ['', [Validators.required, Validators.min(0)]],
    tax: [0],
    invoiceDate: ['', Validators.required],
    notes: ['']
  });

  // Convert form value changes to a signal
  private formValue = toSignal(this.invoiceForm.valueChanges.pipe(
    startWith(this.invoiceForm.value)
  ));

  // Computed total for the template
  totalAmount = computed(() => {
    const val = this.formValue();
    const amount = Number(val?.amount) || 0;
    const tax = Number(val?.tax) || 0;
    return amount + tax;
  });

  ngOnInit() {
    this.statusFilterListener();
    this.loadPOs();
  }

  private statusFilterListener() {
    this.invoiceForm.get('poId')?.valueChanges.subscribe(val => {
      this.checkDateValidation(val);
    });
  }

  private checkDateValidation(poId: string | null | undefined) {
    if (!poId) {
      this.validationError.set(null);
      return;
    }

    const selectedPO = this.purchaseOrders().find(p => p.id === poId);
    if (!selectedPO) return;

    const today = new Date().toISOString().split('T')[0];
    const isDaily = selectedPO.paymentType === 'daily';

    if (isDaily) {
      // For daily, training must have started
      if (selectedPO.startDate && today < selectedPO.startDate) {
        this.validationError.set("you can't uplaod before training starts");
      } else {
        this.validationError.set(null);
      }
    } else {
      // For others, training must have ended
      if (selectedPO.endDate && today < selectedPO.endDate) {
        this.validationError.set("you can't uplaod before training is completed");
      } else {
        this.validationError.set(null);
      }
    }
  }

  private loadPOs() {
    const user = this.authService.getUser();
    if (!user || user.role !== 'trainer' || !user.trainerId) return;

    // Load POs for this trainer and join with Enrollments to get dates
    forkJoin({
      enrollments: this.enrollmentService.getByTrainerId(user.trainerId),
      pos: this.poService.getByTrainerId(user.trainerId)
    }).pipe(
      map(({ enrollments, pos }) => {
        // IDs in db.json can be strings, so we convert to numbers for mapping
        const enrollmentMap = new Map(enrollments.map(e => [String(e.id), e]));
        return pos
          .filter(po => po.enrollmentId != null && enrollmentMap.has(String(po.enrollmentId)))
          .map(po => ({
            ...po,
            startDate: enrollmentMap.get(String(po.enrollmentId!))?.startDate,
            endDate: enrollmentMap.get(String(po.enrollmentId!))?.endDate
          }));
      })
    ).subscribe({
      next: (data) => this.purchaseOrders.set(data),
      error: (err) => console.error('Error loading POs', err)
    });
  }

  onSubmit() {
    if (this.invoiceForm.invalid) return;

    this.isSubmitting = true;

    // cast form values
    const formVal = this.invoiceForm.value;
    const invoiceData = {
      poId: String(formVal.poId),
      amount: Number(formVal.amount),
      tax: Number(formVal.tax) || 0,
      invoiceDate: formVal.invoiceDate!,
      status: 'PENDING',
      issuedBy: 'TRAINER' as const
      // Note: Backend might expect 'notes' or other fields, assuming model matches.
    };

    this.invoiceService.create(invoiceData as any).subscribe({
      next: (res) => {
        this.submitSuccess = true;
        this.isSubmitting = false;
        this.invoiceForm.reset();

        setTimeout(() => {
          this.submitSuccess = false;
        }, 3000);
      },
      error: (err) => {
        console.error('Error submitting invoice', err);
        this.isSubmitting = false;
      }
    });
  }
}
