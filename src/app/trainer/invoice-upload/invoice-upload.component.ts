import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-invoice-upload',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule],
  templateUrl: './invoice-upload.component.html',
  styleUrls: ['./invoice-upload.component.css']
})
export class InvoiceUploadComponent {
  private fb = inject(FormBuilder);

  purchaseOrders = signal<any[]>([]);
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
    // Mock data for demo - in real app, this would come from services
    this.purchaseOrders.set([
      { id: 1, totalAmount: 4000 },
      { id: 2, totalAmount: 6000 }
    ]);
  }

  onSubmit() {
    if (this.invoiceForm.invalid) return;

    this.isSubmitting = true;
    
    const invoiceData = {
      ...this.invoiceForm.value,
      issuedBy: 'TRAINER',
      status: 'PENDING'
    };

    // Mock API call - in real app, this would use InvoiceService
    setTimeout(() => {
      this.submitSuccess = true;
      this.isSubmitting = false;
      this.invoiceForm.reset();
      
      // Reset success message after 3 seconds
      setTimeout(() => {
        this.submitSuccess = false;
      }, 3000);
    }, 1500);
  }
}
