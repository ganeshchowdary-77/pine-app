import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../auth/auth-service';
import { InvoiceService } from '../../shared/services';
import { Invoice } from '../../shared/models';

@Component({
  selector: 'app-invoice-history',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './invoice-history.component.html',
  styleUrls: ['./invoice-history.component.css']
})
export class InvoiceHistoryComponent implements OnInit {
  private authService = inject(AuthService);
  private invoiceService = inject(InvoiceService);

  invoices = signal<Invoice[]>([]);
  statusFilter = signal<string>('');
  isLoading = signal(false);

  // Computed filtered list
  filteredInvoices = computed(() => {
    const filter = this.statusFilter();
    const all = this.invoices();
    if (!filter) return all;
    return all.filter(inv => inv.status === filter);
  });

  // Computed total value for displayed invoices
  totalInvoiceValue = computed(() => {
    return this.filteredInvoices().reduce((sum, inv) => sum + (inv.amount || 0) + (inv.tax || 0), 0);
  });

  // Computed Payment Summary (from PaymentStatus logic)
  paymentSummary = computed(() => {
    const all = this.invoices();
    let totalPaid = 0;
    let totalPending = 0;
    let lastPaymentDate: string | null = null;

    all.forEach(inv => {
      const total = (inv.amount || 0) + (inv.tax || 0);
      if (inv.status === 'PAID') {
        totalPaid += total;
        if (!lastPaymentDate || (inv.invoiceDate > lastPaymentDate)) {
          lastPaymentDate = inv.invoiceDate;
        }
      } else {
        // Pending, Sent, Approved all count as pending payment or future revenue
        // If status is APPROVED or SENT or PENDING, it's pending MONEY
        if (['PENDING', 'APPROVED', 'SENT'].includes(inv.status)) {
          totalPending += total;
        }
      }
    });

    return { totalPaid, totalPending, lastPaymentDate };
  });

  ngOnInit() {
    this.loadData();
  }

  private loadData() {
    const user = this.authService.getUser();
    if (!user || user.role !== 'trainer' || !user.trainerId) return;

    this.isLoading.set(true);

    this.invoiceService.getByTrainerId(user.trainerId).subscribe({
      next: (data) => {
        this.invoices.set(data);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Error loading invoices', err);
        this.isLoading.set(false);
      }
    });
  }

  onStatusFilter(event: Event) {
    const select = event.target as HTMLSelectElement;
    this.statusFilter.set(select.value);
  }
}
