import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-payment-status',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './payment-status.component.html',
  styleUrls: ['./payment-status.component.css']
})
export class PaymentStatusComponent implements OnInit {
  invoices = signal<any[]>([]);
  paymentSummary = signal({
    totalPaid: 0,
    totalPending: 0,
    lastPaymentDate: null as string | null
  });

  ngOnInit() {
    // Mock data for demo - in real app, this would come from services
    this.loadPaymentData();
  }

  private loadPaymentData() {
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
      }
    ];

    this.invoices.set(mockInvoices);
    this.calculatePaymentSummary(mockInvoices);
  }

  private calculatePaymentSummary(invoices: any[]) {
    const totalPaid = invoices
      .filter(inv => inv.status === 'PAID')
      .reduce((sum, inv) => sum + (inv.amount || 0), 0);
    
    const totalPending = invoices
      .filter(inv => inv.status === 'PENDING' || inv.status === 'APPROVED' || inv.status === 'SENT')
      .reduce((sum, inv) => sum + (inv.amount || 0), 0);

    const paidInvoices = invoices.filter(inv => inv.status === 'PAID');
    const lastPaymentDate = paidInvoices.length > 0 
      ? paidInvoices.sort((a, b) => new Date(b.invoiceDate).getTime() - new Date(a.invoiceDate).getTime())[0].invoiceDate
      : null;

    this.paymentSummary.set({
      totalPaid,
      totalPending,
      lastPaymentDate
    });
  }
}
