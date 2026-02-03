import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { TrainingRequest } from '../../shared/models';
import { TrainingRequestService } from '../../shared/services';
import { of } from 'rxjs';
import { catchError, finalize, timeout } from 'rxjs/operators';

@Component({
  selector: 'app-training-requests',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './training-requests.html',
  styleUrls: ['./training-requests.css']
})
export class TrainingRequestsComponent implements OnInit {
  private requestService = inject(TrainingRequestService);
  private router = inject(Router);
  
  requests = signal<TrainingRequest[]>([]);
  isLoading = signal(true);
  error = signal<string | null>(null);
  successMessage = signal<string | null>(null);
  
  selectedStatus = signal<string>('');
  filterQuery = signal<string>('');
  
  ngOnInit() {
    this.loadRequests();
  }
  
  loadRequests() {
    this.isLoading.set(true);
    this.error.set(null);
    
    this.requestService.getAll().pipe(
      timeout(8000),
      catchError((err) => {
        console.error('Failed to load training requests:', err);
        this.error.set('Failed to load training requests. Please try again.');
        return of([] as TrainingRequest[]);
      }),
      finalize(() => this.isLoading.set(false))
    ).subscribe({
      next: (data) => this.requests.set(data || [])
    });
  }
  
  get filteredRequests(): TrainingRequest[] {
    let filtered = this.requests();
    
    if (this.selectedStatus()) {
      filtered = filtered.filter(r => r.status === this.selectedStatus());
    }
    
    if (this.filterQuery()) {
      const query = this.filterQuery().toLowerCase();
      filtered = filtered.filter(r => 
        r.companyName?.toLowerCase().includes(query) ||
        r.technology?.toLowerCase().includes(query)
      );
    }
    
    return filtered;
  }

  isStarted(request: TrainingRequest): boolean {
    if (!request.startDate) return false;
    const today = new Date('2026-02-03');
    const start = new Date(request.startDate);
    const end = new Date(request.endDate);
    return start <= today && end >= today;
  }
  
  updateStatus(id: number, newStatus: string) {
    const request = this.requests().find(r => r.id === id);
    if (!request) return;
    
    this.requestService.updateStatus(id, newStatus as any).subscribe({
      next: () => {
        this.successMessage.set(`Request marked as ${newStatus}`);
        setTimeout(() => this.successMessage.set(null), 3000);
        this.loadRequests();
      },
      error: (err) => {
        this.error.set('Failed to update status');
        console.error(err);
      }
    });
  }

  navigateToEnrollment(requestId: number) {
    this.router.navigate(['/admin/enrollments/new'], { 
      queryParams: { requestId: requestId } 
    });
  }

  deleteRequest(id: number) {
    if (!confirm('Are you sure you want to delete this request?')) return;
    
    this.requestService.delete(id).subscribe({
      next: () => {
        this.successMessage.set('Request deleted successfully');
        setTimeout(() => this.successMessage.set(null), 3000);
        this.loadRequests();
      },
      error: (err) => {
        this.error.set('Failed to delete request');
        console.error(err);
      }
    });
  }
  
  getStatusColor(status: string): string {
    switch(status) {
      case 'NEW': return 'status-new';
      case 'CONTACTED': return 'status-contacted';
      case 'APPROVED': return 'status-approved';
      case 'REJECTED': return 'status-rejected';
      default: return 'status-default';
    }
  }
}
