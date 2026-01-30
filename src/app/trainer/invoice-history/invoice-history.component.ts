import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-invoice-history',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './invoice-history.component.html',
  styleUrls: ['./invoice-history.component.css']
})
export class InvoiceHistoryComponent implements OnInit {
  invoices = signal<any[]>([]);
  filteredInvoices = signal<any[]>([]);

  ngOnInit() {
    // Mock data for demo - in real app, this would come from services
    this.loadInvoiceHistory();
  }

  private loadInvoiceHistory() {
    // Mock invoice data
    const mockInvoices = [
      {
        id: 1,
        poId: 1,
        amount: 4000,
        tax: 400,
        invoiceDate: '2026-01-15',
        status: 'PAID'
      },
      {
        id: 2,
        poId: 2,
        amount: 6000,
        tax: 600,
        invoiceDate: '2026-01-20',
        status: 'PENDING'
      },
      {
        id: 3,
        poId: 3,
        amount: 3500,
        tax: 350,
        invoiceDate: '2026-01-25',
        status: 'APPROVED'
      },
      {
        id: 4,
        poId: 4,
        amount: 5000,
        tax: 500,
        invoiceDate: '2026-01-28',
        status: 'SENT'
      },
      {
        id: 5,
        poId: 5,
        amount: 4500,
        tax: 450,
        invoiceDate: '2026-01-30',
        status: 'PAID'
      }
    ];

    this.invoices.set(mockInvoices);
    this.filteredInvoices.set(mockInvoices);
  }

  onStatusFilter(event: Event) {
    const target = event.target as HTMLSelectElement;
    const status = target.value;
    
    if (status) {
      const filtered = this.invoices().filter(invoice => invoice.status === status);
      this.filteredInvoices.set(filtered);
    } else {
      this.filteredInvoices.set(this.invoices());
    }
  }

  totalInvoiceValue(): number {
    return this.filteredInvoices().reduce((sum, invoice) => {
      return sum + (invoice.amount || 0) + (invoice.tax || 0);
    }, 0);
  }
}
