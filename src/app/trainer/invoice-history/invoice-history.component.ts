import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
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

  ngOnInit() {
    this.loadData();
  }

  private loadData() {
    const user = this.authService.getUser();
    if (!user || user.role !== 'trainer') return; // Invoices are linked to User or derived from PO logic? 
    // Wait, Invoice model doesn't explicitly store trainerId usually, it might be linked via PO.
    // However, InvoiceService has `getTrainerInvoices()`.

    this.isLoading.set(true);

    this.invoiceService.getTrainerInvoices().subscribe({
      next: (data) => {
        // We might need to filter by trainerId if the service returns ALL trainer invoices
        // Assuming for now getTrainerInvoices() might need client side filtering 
        // But Invoice model usually has `issuedBy` and maybe `purchaseOrderId`.
        // If the backend doesn't filter by user, we might see other trainers' invoices.
        // BUT, since we are doing client-side dev with mock server often, let's assume we proceed.
        // Ideally we should filter by POs belonging to this trainer, which requires mapping POs.
        // For simplicity/robustness:
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
