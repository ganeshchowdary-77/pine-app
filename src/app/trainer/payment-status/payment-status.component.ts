import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../auth/auth-service';
import { InvoiceService } from '../../shared/services';
import { Invoice } from '../../shared/models';

@Component({
  selector: 'app-payment-status',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './payment-status.component.html',
  styleUrls: ['./payment-status.component.css']
})
export class PaymentStatusComponent implements OnInit {
  private authService = inject(AuthService);
  private invoiceService = inject(InvoiceService);

  invoices = signal<Invoice[]>([]);
  isLoading = signal(false);

  // Computed Summary
  paymentSummary = computed(() => {
    const all = this.invoices();
    let totalPaid = 0;
    let totalPending = 0;
    let lastPaymentDate: string | null = null; // YYYY-MM-DD string comparison

    all.forEach(inv => {
      const total = (inv.amount || 0) + (inv.tax || 0);
      if (inv.status === 'PAID') {
        totalPaid += total;
        // Find latest date of paid invoice (using invoiceDate as proxy for payment date if not available)
        if (!lastPaymentDate || (inv.invoiceDate > lastPaymentDate)) {
          lastPaymentDate = inv.invoiceDate;
        }
      } else {
        totalPending += total; // Pending, Sent, Approved all count as pending payment
      }
    });

    return { totalPaid, totalPending, lastPaymentDate };
  });

  ngOnInit() {
    this.loadData();
  }

  private loadData() {
    const user = this.authService.getUser();
    if (!user || user.role !== 'trainer') return;

    this.isLoading.set(true);

    this.invoiceService.getTrainerInvoices().subscribe({
      next: (data) => {
        this.invoices.set(data);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Error loading payment data', err);
        this.isLoading.set(false);
      }
    });
  }
}
