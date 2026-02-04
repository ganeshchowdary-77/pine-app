import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../auth/auth-service';
import { PurchaseOrderService, EnrollmentService } from '../../shared/services';
import { Enrollment, PurchaseOrder } from '../../shared/models';
import { forkJoin, map, switchMap } from 'rxjs';

@Component({
  selector: 'app-po-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './po-details.component.html',
  styleUrls: ['./po-details.component.css']
})
export class PoDetailsComponent implements OnInit {
  private authService = inject(AuthService);
  private poService = inject(PurchaseOrderService);
  private enrollmentService = inject(EnrollmentService);

  purchaseOrders = signal<PurchaseOrder[]>([]);
  enrollments = signal<Enrollment[]>([]);
  isLoading = signal(false);

  // Map for quick lookup of training details
  private enrollmentMap = new Map<number, Enrollment>();

  ngOnInit() {
    this.loadData();
  }

  private loadData() {
    const user = this.authService.getUser();
    if (!user || user.role !== 'trainer' || !user.trainerId) return;

    this.isLoading.set(true);

    // 1. Get Enrollments for this trainer
    // 2. Get All Trainer POs (Service limitation) and filter by enrollments
    this.enrollmentService.getByTrainerId(user.trainerId).pipe(
      switchMap(enrollments => {
        this.enrollments.set(enrollments);

        // Create map for easy lookup
        enrollments.forEach(e => this.enrollmentMap.set(e.id, e));

        // Get all trainer POs and filter
        return this.poService.getTrainerPOs().pipe(
          map(pos => pos.filter(po => po.enrollmentId != null && this.enrollmentMap.has(po.enrollmentId)))
        );
      })
    ).subscribe({
      next: (filteredPOs) => {
        this.purchaseOrders.set(filteredPOs);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Error loading PO data', err);
        this.isLoading.set(false);
      }
    });
  }

  getTrainingDetails(enrollmentId: number): string {
    const enrollment = this.enrollmentMap.get(enrollmentId);
    return enrollment ? `${enrollment.technology} (${enrollment.startDate})` : 'Unknown Training';
  }

  acceptPO(id: number) {
    this.isLoading.set(true);
    this.poService.updateStatus(id, 'ACCEPTED').subscribe({
      next: (updatedPO) => {
        this.purchaseOrders.update(current => 
          current.map(po => po.id === id ? updatedPO : po)
        );
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Error accepting PO', err);
        this.isLoading.set(false);
      }
    });
  }
}
