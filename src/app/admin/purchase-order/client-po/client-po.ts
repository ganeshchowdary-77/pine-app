import { Component, inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';

import { EnrollmentService } from '../../../shared/services/enrollment.service';
import { PurchaseOrderService } from '../../../shared/services/purchase-order.service';
import { PurchaseOrder } from '../../../shared/models';

@Component({
  selector: 'app-client-po',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './client-po.html',
})
export class ClientPo {

  private fb = inject(FormBuilder);
  private enrollmentService = inject(EnrollmentService);
  private poService = inject(PurchaseOrderService);
  private router = inject(Router);

  enrollments = toSignal(
    this.enrollmentService.getAll(),
    { initialValue: [] }
  );

  form = this.fb.group({
    enrollmentId: [null, Validators.required],
    totalAmount: [null, [Validators.required, Validators.min(0)]],
    paymentTerms: ['', Validators.required]
  });

  save() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const po: Partial<PurchaseOrder> = {
      ...this.form.value,
      enrollmentId: Number(this.form.value.enrollmentId),
      totalAmount: Number(this.form.value.totalAmount),
      paymentTerms: this.form.value.paymentTerms ?? undefined,
      type: 'CLIENT',
      status: 'RECEIVED'
    };

    this.poService.create(po).subscribe({
      next: () => {
        alert('Client PO Saved');
        this.router.navigate(['/admin/enrollments']);
      },
      error: () => alert('Failed to save PO')
    });
  }
}
