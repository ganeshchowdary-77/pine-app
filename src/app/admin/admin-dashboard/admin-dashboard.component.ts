import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { forkJoin, of } from 'rxjs';
import { catchError, finalize, timeout } from 'rxjs/operators';
import { Invoice, Trainer, PurchaseOrder } from '../../shared/models';
import { InvoiceService, TrainerService, PurchaseOrderService } from '../../shared/services';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit {
  private invoiceService = inject(InvoiceService);
  private trainerService = inject(TrainerService);
  private poService = inject(PurchaseOrderService);
  private cdr = inject(ChangeDetectorRef);

  // Title
  title = 'Admin Dashboard';

  // Data
  invoices: Invoice[] = [];
  trainers: Trainer[] = [];
  purchaseOrders: PurchaseOrder[] = [];

  // Form State
  newAmount: number = 0;
  selectedPoId: number | string = '';

  // Loading & Error states
  invoicesLoading = false;
  invoicesError: string | null = null;
  invoicesSuccess: string | null = null;
  trainersLoading = false;
  trainersError: string | null = null;
  poError: string | null = null;

  // Stats
  totalInvoices = 0;
  totalRevenue = 0;
  pendingInvoices = 0;
  paidInvoices = 0;
  totalTrainers = 0;

  // Global loading state
  isLoading = true;

  // Stars animation
  stars: any[] = [];

  ngOnInit() {
    console.log('🚀 AdminDashboardComponent initialized');
    this.generateStars();
    // Use a small timeout to ensure the component is fully ready before starting load
    setTimeout(() => {
      this.loadData();
    }, 100);
  }

  generateStars() {
    for (let i = 0; i < 80; i++) {
      this.stars.push({
        left: Math.random() * 100 + '%',
        top: Math.random() * 100 + '%',
        duration: Math.random() * 3 + 2 + 's',
        delay: Math.random() * 5 + 's'
      });
    }
  }

  loadData() {
    console.log('📥 loadData() called');
    this.isLoading = true;
    this.invoicesError = null;
    this.trainersError = null;
    this.poError = null;
    this.invoicesLoading = true;
    this.trainersLoading = true;
    this.cdr.detectChanges();

    console.log('📊 Fetching dashboard data (Invoices, Trainers, POs)...');

    forkJoin({
      invoices: this.invoiceService.getAll().pipe(
        timeout(8000),
        catchError((err) => {
          console.error('❌ Invoices load failed:', err);
          this.invoicesError = this.humanizeError(err, 'invoices');
          return of([] as Invoice[]);
        })
      ),
      trainers: this.trainerService.getAll().pipe(
        timeout(8000),
        catchError((err) => {
          console.error('❌ Trainers load failed:', err);
          this.trainersError = this.humanizeError(err, 'trainers');
          return of([] as Trainer[]);
        })
      ),
      pos: this.poService.getAll().pipe(
        timeout(8000),
        catchError((err) => {
          console.error('❌ POs load failed:', err);
          this.poError = 'Failed to load POs';
          return of([] as PurchaseOrder[]);
        })
      )
    })
      .pipe(
        finalize(() => {
          this.isLoading = false;
          this.invoicesLoading = false;
          this.trainersLoading = false;
          this.cdr.detectChanges();
        })
      )
      .subscribe((result) => {
        console.log('✅ Dashboard data received');

        this.invoices = result.invoices || [];
        this.calculateStats();

        this.trainers = result.trainers || [];
        this.totalTrainers = this.trainers.length;

        this.purchaseOrders = result.pos || [];

        console.log('📈 Dashboard ready');
      });
  }

  onPoSelected() {
    const selectedPo = this.purchaseOrders.find(p => p.id === Number(this.selectedPoId));
    if (selectedPo) {
      this.newAmount = selectedPo.totalAmount;
    } else {
      this.newAmount = 0;
    }
  }

  private humanizeError(err: any, domain: string): string {
    if (err?.name === 'TimeoutError') {
      return `Timed out loading ${domain}. Is json-server running?`;
    }
    if (err?.status === 0) return 'Cannot connect to server. Start backend.';
    return `Failed to load ${domain}`;
  }

  calculateStats() {
    this.totalInvoices = this.invoices.length;
    this.totalRevenue = this.invoices.reduce((sum, inv) => sum + (inv.amount || 0), 0);
    this.pendingInvoices = this.invoices.filter(inv => inv.status === 'PENDING').length;
    this.paidInvoices = this.invoices.filter(inv => inv.status === 'PAID').length;
  }

  addInvoice() {
    if (!this.newAmount || !this.selectedPoId) {
      this.invoicesError = 'Please select a PO and specify amount.';
      return;
    }

    const newInvoice: Partial<Invoice> = {
      poId: Number(this.selectedPoId),
      issuedBy: 'ADMIN',
      amount: this.newAmount,
      invoiceDate: new Date().toISOString(),
      status: 'PENDING'
    };

    this.invoiceService.create(newInvoice).subscribe({
      next: () => {
        this.invoicesSuccess = 'Invoice added successfully!';
        this.selectedPoId = '';
        this.newAmount = 0;
        setTimeout(() => this.invoicesSuccess = null, 3000);
        this.loadData();
      },
      error: (err) => {
        this.invoicesError = 'Failed to add invoice: ' + (err?.message || 'Error');
      }
    });
  }

  deleteInvoice(id: number | string) {
    if (!confirm('Delete this invoice?')) return;
    this.invoiceService.delete(id).subscribe({
      next: () => {
        this.invoicesSuccess = 'Invoice deleted!';
        setTimeout(() => this.invoicesSuccess = null, 3000);
        this.loadData();
      }
    });
  }

  approveInvoice(id: number | string) {
    this.invoiceService.approve(id).subscribe({
      next: () => {
        this.invoicesSuccess = 'Invoice approved!';
        setTimeout(() => this.invoicesSuccess = null, 3000);
        this.loadData();
      }
    });
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'PENDING': return 'pine-badge-warning';
      case 'PAID': return 'pine-badge-success';
      case 'APPROVED': return 'pine-badge-info';
      default: return 'pine-badge-primary';
    }
  }
}
