import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Invoice } from '../../shared/models';
import { InvoiceService } from '../../shared/services';
import { of } from 'rxjs';
import { catchError, finalize, timeout } from 'rxjs/operators';

@Component({
  selector: 'app-trainer-invoices',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './trainer-invoices.html',
  styleUrls: ['./trainer-invoices.css']
})
export class TrainerInvoicesComponent implements OnInit {
  private invoiceService = inject(InvoiceService);

  trainerInvoices = signal<Invoice[]>([]);
  isLoading = signal(true);
  error = signal<string | null>(null);
  successMessage = signal<string | null>(null);

  selectedStatus = signal<string>('');
  searchQuery = signal<string>('');

  ngOnInit() {
    this.loadTrainerInvoices();
  }

  loadTrainerInvoices() {
    this.isLoading.set(true);
    this.error.set(null);

    this.invoiceService.getByIssuedBy('TRAINER').pipe(
      timeout(8000),
      catchError((err) => {
        console.error('Failed to load trainer invoices:', err);
        this.error.set('Failed to load trainer invoices. Please try again.');
        return of([] as Invoice[]);
      }),
      finalize(() => this.isLoading.set(false))
    ).subscribe({
      next: (data) => {
        const invoices = data || [];
        this.trainerInvoices.set(invoices);
      }
    });
  }

  get filteredInvoices(): Invoice[] {
    let filtered = this.trainerInvoices();

    if (this.selectedStatus()) {
      filtered = filtered.filter(i => i.status === this.selectedStatus());
    }

    if (this.searchQuery()) {
      const query = this.searchQuery().toLowerCase();
      filtered = filtered.filter(i =>
        i.id?.toLowerCase().includes(query) ||
        i.poId?.toLowerCase().includes(query)
      );
    }

    return filtered;
  }

  approveInvoice(id: string) {
    this.invoiceService.approve(id).subscribe({
      next: () => {
        this.successMessage.set('Invoice approved successfully!');
        setTimeout(() => this.successMessage.set(null), 3000);
        this.loadTrainerInvoices();
      },
      error: (err) => {
        this.error.set('Failed to approve invoice');
        console.error(err);
      }
    });
  }

  markAsPaid(id: string) {
    this.invoiceService.updateStatus(id, 'PAID').subscribe({
      next: () => {
        this.successMessage.set('Invoice marked as paid!');
        setTimeout(() => this.successMessage.set(null), 3000);
        this.loadTrainerInvoices();
      },
      error: (err) => {
        this.error.set('Failed to update invoice');
        console.error(err);
      }
    });
  }

  rejectInvoice(id: string) {
    if (confirm('Are you sure you want to reject this invoice?')) {
      this.invoiceService.delete(id).subscribe({
        next: () => {
          this.successMessage.set('Invoice rejected!');
          setTimeout(() => this.successMessage.set(null), 3000);
          this.loadTrainerInvoices();
        },
        error: (err) => {
          this.error.set('Failed to reject invoice');
          console.error(err);
        }
      });
    }
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'PENDING': return 'status-pending';
      case 'APPROVED': return 'status-approved';
      case 'SENT': return 'status-sent';
      case 'PAID': return 'status-paid';
      default: return 'status-default';
    }
  }

  getTotalAmount(): number {
    return this.filteredInvoices.reduce((sum, inv) => sum + (inv.amount || 0), 0);
  }

  getPendingAmount(): number {
    return this.filteredInvoices
      .filter(inv => inv.status === 'PENDING' || inv.status === 'APPROVED')
      .reduce((sum, inv) => sum + (inv.amount || 0), 0);
  }
}
