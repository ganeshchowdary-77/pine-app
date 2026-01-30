import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-po-details',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './po-details.component.html',
  styleUrls: ['./po-details.component.css']
})
export class PoDetailsComponent implements OnInit {
  purchaseOrders = signal<any[]>([]);
  enrollments = signal<any[]>([]);

  ngOnInit() {
    // Mock data for demo - in real app, this would come from services
    this.loadTrainerPOs();
    this.loadEnrollments();
  }

  private loadTrainerPOs() {
    // Mock PO data
    const mockPOs = [
      {
        id: 2,
        enrollmentId: 1,
        type: 'TRAINER',
        paymentType: 'daily',
        rate: 800,
        totalAmount: 4000,
        paymentTerms: 'Upon completion',
        status: 'ACCEPTED'
      }
    ];

    this.purchaseOrders.set(mockPOs);
  }

  private loadEnrollments() {
    // Mock enrollment data
    const mockEnrollments = [
      {
        id: 1,
        companyId: 1,
        trainerId: 1,
        technology: 'Angular',
        startDate: '2026-02-15',
        endDate: '2026-02-19',
        budget: 20000,
        status: 'APPROVED'
      }
    ];

    this.enrollments.set(mockEnrollments);
  }

  getTrainingDetails(enrollmentId: number): string {
    const enrollment = this.enrollments().find(e => e.id === enrollmentId);
    return enrollment ? `${enrollment.technology} (${enrollment.startDate})` : 'Unknown Training';
  }
}
