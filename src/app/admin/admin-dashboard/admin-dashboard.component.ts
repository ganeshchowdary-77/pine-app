import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Invoice, Trainer } from '../../shared/models';
import { InvoiceService, TrainerService } from '../../shared/services';

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
  
  // Title
  title = 'Admin Dashboard';
  
  // Invoices
  invoices: Invoice[] = [];
  invoicesLoading = false;
  invoicesError: string | null = null;
  newAmount: number = 1000;
  newPoId: number = 1;
  invoicesSuccess: string | null = null;
  
  // Trainers
  trainers: Trainer[] = [];
  trainersLoading = false;
  trainersError: string | null = null;
  
  // Stats
  totalInvoices = 0;
  totalRevenue = 0;
  pendingInvoices = 0;
  paidInvoices = 0;
  totalTrainers = 0;
  
  // Global loading state
  isLoading = true;
  
  ngOnInit() {
    console.log('🚀 AdminDashboardComponent initialized');
    console.log('📋 Starting data load...');
    this.loadData();
  }

  loadData() {
    console.log('📥 loadData() called');
    this.isLoading = true;
    this.invoicesError = null;
    this.trainersError = null;
    
    // Load both data sources
    this.fetchInvoices();
    this.fetchTrainers();
  }

  refreshData() {
    console.log('🔄 Refreshing data...');
    this.loadData();
  }

  fetchInvoices() {
    this.invoicesLoading = true;
    this.invoicesError = null;
    console.log('📊 Fetching invoices from service...');
    console.log('🔗 API URL: http://localhost:3000/invoices');
    
    this.invoiceService.getAll().subscribe({
      next: (data) => {
        console.log('✅ Invoices loaded successfully:', data);
        console.log('📈 Total invoices:', data.length);
        this.invoices = data || [];
        this.calculateStats();
        this.invoicesLoading = false;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('❌ Error loading invoices:', err);
        console.error('Status:', err?.status);
        console.error('Status Text:', err?.statusText);
        console.error('Message:', err?.message);
        console.error('Error object:', err);
        
        let errorMsg = 'Failed to load invoices';
        if (err?.status === 0) {
          errorMsg = 'Cannot connect to server. Make sure json-server is running on http://localhost:3000';
        } else if (err?.status === 404) {
          errorMsg = 'Invoices endpoint not found (404)';
        } else if (err?.status === 500) {
          errorMsg = 'Server error (500)';
        }
        
        this.invoicesError = errorMsg;
        this.invoicesLoading = false;
        this.isLoading = false;
        this.invoices = [];
      }
    });
  }

  fetchTrainers() {
    this.trainersLoading = true;
    this.trainersError = null;
    console.log('👥 Fetching trainers from service...');
    console.log('🔗 API URL: http://localhost:3000/trainers');
    
    this.trainerService.getAll().subscribe({
      next: (data) => {
        console.log('✅ Trainers loaded successfully:', data);
        console.log('📈 Total trainers:', data.length);
        this.trainers = data || [];
        this.totalTrainers = this.trainers.length;
        this.trainersLoading = false;
      },
      error: (err) => {
        console.error('❌ Error loading trainers:', err);
        console.error('Status:', err?.status);
        console.error('Status Text:', err?.statusText);
        console.error('Message:', err?.message);
        console.error('Error object:', err);
        
        let errorMsg = 'Failed to load trainers';
        if (err?.status === 0) {
          errorMsg = 'Cannot connect to server. Make sure json-server is running on http://localhost:3000';
        } else if (err?.status === 404) {
          errorMsg = 'Trainers endpoint not found (404)';
        } else if (err?.status === 500) {
          errorMsg = 'Server error (500)';
        }
        
        this.trainersError = errorMsg;
        this.trainersLoading = false;
        this.trainers = [];
      }
    });
  }

  calculateStats() {
    console.log('📊 Calculating stats from invoices...');
    this.totalInvoices = this.invoices.length;
    this.totalRevenue = this.invoices.reduce((sum, inv) => sum + (inv.amount || 0), 0);
    this.pendingInvoices = this.invoices.filter(inv => inv.status === 'PENDING').length;
    this.paidInvoices = this.invoices.filter(inv => inv.status === 'PAID').length;
    console.log('📈 Stats calculated:', {
      total: this.totalInvoices,
      revenue: this.totalRevenue,
      pending: this.pendingInvoices,
      paid: this.paidInvoices
    });
  }

  addInvoice() {
    if (!this.newAmount || !this.newPoId) {
      this.invoicesError = 'Amount and PO ID are required.';
      return;
    }
    console.log('Adding invoice:', { poId: this.newPoId, amount: this.newAmount });
    const newInvoice: Partial<Invoice> = {
      poId: this.newPoId,
      issuedBy: 'ADMIN',
      amount: this.newAmount,
      invoiceDate: new Date().toISOString(),
      status: 'PENDING'
    };
    this.invoiceService.create(newInvoice).subscribe({
      next: (result) => {
        console.log('Invoice added successfully:', result);
        this.invoicesSuccess = 'Invoice added successfully!';
        this.invoicesError = null;
        this.newAmount = 1000;
        this.newPoId = 1;
        setTimeout(() => this.invoicesSuccess = null, 3000);
        this.fetchInvoices();
      },
      error: (err) => {
        console.error('Error adding invoice:', err);
        this.invoicesError = 'Failed to add invoice: ' + (err?.message || 'Unknown error');
      }
    });
  }

  deleteInvoice(id: number) {
    if (!confirm('Delete this invoice?')) return;
    console.log('Deleting invoice:', id);
    this.invoiceService.delete(id).subscribe({
      next: () => {
        console.log('Invoice deleted successfully');
        this.invoicesSuccess = 'Invoice deleted successfully!';
        setTimeout(() => this.invoicesSuccess = null, 3000);
        this.fetchInvoices();
      },
      error: (err) => {
        console.error('Error deleting invoice:', err);
        this.invoicesError = 'Failed to delete invoice: ' + (err?.message || 'Unknown error');
      }
    });
  }

  approveInvoice(id: number) {
    console.log('Approving invoice:', id);
    this.invoiceService.approve(id).subscribe({
      next: (result) => {
        console.log('Invoice approved:', result);
        this.invoicesSuccess = 'Invoice approved!';
        setTimeout(() => this.invoicesSuccess = null, 3000);
        this.fetchInvoices();
      },
      error: (err) => {
        console.error('Error approving invoice:', err);
        this.invoicesError = 'Failed to approve invoice';
      }
    });
  }

  getStatusColor(status: string): string {
    switch(status) {
      case 'PENDING': return 'pine-badge-warning';
      case 'APPROVED': return 'pine-badge-info';
      case 'SENT': return 'pine-badge-success';
      case 'PAID': return 'pine-badge-success';
      default: return 'pine-badge-primary';
    }
  }
}
