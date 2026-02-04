import { Component, inject, OnInit, signal, linkedSignal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../auth/auth-service';
import { PurchaseOrderService, EnrollmentService } from '../../shared/services';
import { Enrollment, PurchaseOrder } from '../../shared/models';
import { forkJoin, map, switchMap } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';

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
    if (!user || user.role.toLowerCase() !== 'trainer' || !user.trainerId) return;

    this.isLoading.set(true);

    // 1. Get Enrollments for this trainer (to get technology names/dates)
    // 2. Get POs for this trainer (Direct filtering)
    forkJoin({
      enrollments: this.enrollmentService.getByTrainerId(user.trainerId),
      purchaseOrders: this.poService.getByTrainerId(user.trainerId)
    }).subscribe({
      next: ({ enrollments, purchaseOrders }) => {
        this.enrollments.set(enrollments);
        enrollments.forEach(e => this.enrollmentMap.set(e.id, e));
        this.purchaseOrders.set(purchaseOrders);
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
