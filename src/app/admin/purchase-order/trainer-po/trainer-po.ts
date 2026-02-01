import { Component, inject, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';

import { EnrollmentService } from '../../../shared/services/enrollment.service';
import { PurchaseOrderService } from '../../../shared/services/purchase-order.service';
import { PurchaseOrder } from '../../../shared/models';

@Component({
  selector: 'app-trainer-po',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './trainer-po.html',
})
export class TrainerPo {

  private fb = inject(FormBuilder);
  private enrollmentService = inject(EnrollmentService);
  private poService = inject(PurchaseOrderService);
  private router = inject(Router);

  // Load enrollments
  enrollments = toSignal(
    this.enrollmentService.getAll(),
    { initialValue: [] }
  );

  // Commission percentage (default 20%)
  commissionPercent = signal(20);

  // Amounts
  clientAmount = signal<number | null>(null);
  trainerAmount = signal<number | null>(null);

  // Form
  form = this.fb.group({
    enrollmentId: [null, Validators.required],
    paymentType: ['hourly', Validators.required],
    rate: [null, Validators.required]
  });

  /**
   * Update commission and recalculate
   */
  updateCommission(percent: number) {
    this.commissionPercent.set(percent);
    const enrollmentId = this.form.value.enrollmentId;

    if (enrollmentId) {
      this.loadClientPO(Number(enrollmentId));
    }
  }

  /**
   * Load client PO and compute trainer amount
   */
  loadClientPO(enrollmentId: number) {
    if (!enrollmentId) return;

    this.poService.getByEnrollmentId(Number(enrollmentId))
      .subscribe(pos => {
        const clientPO = pos.find(p => p.type === 'CLIENT');

        if (!clientPO) {
          this.clientAmount.set(null);
          this.trainerAmount.set(null);
          return;
        }

        const commission =
          clientPO.totalAmount * this.commissionPercent() / 100;

        const trainerPay =
          clientPO.totalAmount - commission;

        this.clientAmount.set(clientPO.totalAmount);
        this.trainerAmount.set(trainerPay);
      });
  }

  /**
   * Save trainer PO
   */
  save() {
    if (this.form.invalid || !this.trainerAmount()) {
      this.form.markAllAsTouched();
      return;
    }

    const po: Partial<PurchaseOrder> = {
      enrollmentId: Number(this.form.value.enrollmentId),
      type: 'TRAINER',
      paymentType: this.form.value.paymentType as PurchaseOrder['paymentType'],
      rate: Number(this.form.value.rate),
      totalAmount: this.trainerAmount()!,
      status: 'GENERATED'
    };

    this.poService.create(po).subscribe({
      next: () => {
        alert('Trainer PO Generated');
        this.router.navigate(['/admin/enrollments']);
      },
      error: () => alert('Failed to create Trainer PO')
    });
  }
}
