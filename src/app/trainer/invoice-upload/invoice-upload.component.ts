import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../auth/auth-service';
import { PurchaseOrderService, InvoiceService, EnrollmentService } from '../../shared/services';
import { PurchaseOrder } from '../../shared/models';
import { map, switchMap } from 'rxjs';

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

  purchaseOrders = signal<PurchaseOrder[]>([]);
  isSubmitting = false;
  submitSuccess = false;

  invoiceForm = this.fb.group({
    poId: ['', Validators.required],
    amount: ['', [Validators.required, Validators.min(0)]],
    tax: [0],
    invoiceDate: ['', Validators.required],
    notes: ['']
  });

  ngOnInit() {
    this.loadPOs();
  }

  private loadPOs() {
    const user = this.authService.getUser();
    if (!user || user.role !== 'trainer' || !user.trainerId) return;

    // Load POs available for invoicing (sent to trainer, maybe check status too?)
    // For now, get all trainer POs and filter by enrollment like in PO Details
    this.enrollmentService.getByTrainerId(user.trainerId).pipe(
      switchMap(enrollments => {
        const enrollmentIds = new Set(enrollments.map(e => e.id));
        return this.poService.getTrainerPOs().pipe(
          map(pos => pos.filter(po => enrollmentIds.has(po.enrollmentId))) // And maybe check status?
        );
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
      poId: Number(formVal.poId),
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
