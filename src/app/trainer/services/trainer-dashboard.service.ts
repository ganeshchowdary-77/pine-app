import { inject, Injectable } from '@angular/core';
import { Observable, combineLatest, map } from 'rxjs';
import { TrainerService, EnrollmentService, InvoiceService, PurchaseOrderService } from '../../shared/services';

@Injectable({
  providedIn: 'root',
})
export class TrainerDashboardService {
  private trainerService = inject(TrainerService);
  private enrollmentService = inject(EnrollmentService);
  private invoiceService = inject(InvoiceService);
  private purchaseOrderService = inject(PurchaseOrderService);

  /**
   * Get comprehensive dashboard data for a trainer
   * Uses existing TrainerService methods
   */
  getDashboardData(trainerId: number): Observable<{
    trainer: any;
    stats: {
      totalTrainings: number;
      ongoingTrainings: number;
      completedTrainings: number;
      totalEarnings: number;
      pendingInvoices: number;
    };
    recentTrainings: any[];
    recentInvoices: any[];
    paymentStatus: {
      totalPaid: number;
      totalPending: number;
      lastPaymentDate?: string;
    };
  }> {
    // Use existing TrainerService and other services
    const trainerData$ = this.trainerService.getById(trainerId);
    const enrollments$ = this.enrollmentService.getByTrainerId(trainerId);
    const invoices$ = this.invoiceService.getTrainerInvoices();
    const pos$ = this.purchaseOrderService.getTrainerPOs();

    return combineLatest([trainerData$, enrollments$, invoices$, pos$]).pipe(
      map(([trainer, enrollments, invoices, pos]) => {
        // Calculate stats using existing service data
        const totalTrainings = enrollments.length;
        const ongoingTrainings = enrollments.filter(e => e.status === 'ONGOING').length;
        const completedTrainings = enrollments.filter(e => e.status === 'COMPLETED').length;

        // Filter POs for this trainer's enrollments
        const myEnrollmentIds = enrollments.map(e => e.id);
        const myPOs = pos.filter(po => myEnrollmentIds.includes(po.enrollmentId));
        const myPOIds = myPOs.map(po => po.id);

        // Filter invoices for this trainer's POs
        const trainerInvoices = invoices.filter(invoice =>
          myPOIds.includes(invoice.poId)
        );

        const totalEarnings = trainerInvoices
          .filter(inv => inv.status === 'PAID')
          .reduce((sum, inv) => sum + (inv.amount || 0), 0);

        const pendingInvoices = trainerInvoices
          .filter(inv => inv.status === 'PENDING').length;

        const totalPaid = trainerInvoices
          .filter(inv => inv.status === 'PAID')
          .reduce((sum, inv) => sum + (inv.amount || 0), 0);

        const totalPending = trainerInvoices
          .filter(inv => inv.status === 'PENDING' || inv.status === 'APPROVED' || inv.status === 'SENT')
          .reduce((sum, inv) => sum + (inv.amount || 0), 0);

        const paidInvoices = trainerInvoices.filter(inv => inv.status === 'PAID');
        const lastPaymentDate = paidInvoices.length > 0
          ? paidInvoices.sort((a, b) => new Date(b.invoiceDate).getTime() - new Date(a.invoiceDate).getTime())[0].invoiceDate
          : undefined;

        return {
          trainer,
          stats: {
            totalTrainings,
            ongoingTrainings,
            completedTrainings,
            totalEarnings,
            pendingInvoices
          },
          recentTrainings: enrollments.slice(0, 5), // Last 5 trainings
          recentInvoices: trainerInvoices.slice(0, 5), // Last 5 invoices
          paymentStatus: {
            totalPaid,
            totalPending,
            lastPaymentDate
          }
        };
      })
    );
  }

  /**
   * Get trainer's assigned trainings with enhanced data
   * Uses existing EnrollmentService methods
   */
  getAssignedTrainings(trainerId: number): Observable<{
    trainings: any[];
    summary: {
      total: number;
      byStatus: Record<string, number>;
      byTechnology: Record<string, number>;
    };
  }> {
    return this.enrollmentService.getByTrainerId(trainerId).pipe(
      map(trainings => {
        const byStatus = trainings.reduce((acc, training) => {
          acc[training.status] = (acc[training.status] || 0) + 1;
          return acc;
        }, {} as Record<string, number>);

        const byTechnology = trainings.reduce((acc, training) => {
          acc[training.technology] = (acc[training.technology] || 0) + 1;
          return acc;
        }, {} as Record<string, number>);

        return {
          trainings,
          summary: {
            total: trainings.length,
            byStatus,
            byTechnology
          }
        };
      })
    );
  }

  /**
   * Get trainer's PO details with enhanced information
   * Uses existing PurchaseOrderService methods
   */
  getTrainerPODetails(trainerId: number): Observable<{
    purchaseOrders: any[];
    summary: {
      total: number;
      totalValue: number;
      byStatus: Record<string, number>;
    };
  }> {
    return combineLatest([
      this.purchaseOrderService.getTrainerPOs(),
      this.enrollmentService.getByTrainerId(trainerId)
    ]).pipe(
      map(([pos, enrollments]) => {
        // Filter POs related to this trainer's enrollments
        const trainerEnrollmentIds = enrollments.map(e => e.id);
        const trainerPOs = pos.filter(po => trainerEnrollmentIds.includes(po.enrollmentId));

        const byStatus = trainerPOs.reduce((acc, po) => {
          acc[po.status] = (acc[po.status] || 0) + 1;
          return acc;
        }, {} as Record<string, number>);

        const totalValue = trainerPOs.reduce((sum, po) => sum + (po.totalAmount || 0), 0);

        return {
          purchaseOrders: trainerPOs,
          summary: {
            total: trainerPOs.length,
            totalValue,
            byStatus
          }
        };
      })
    );
  }

  /**
   * Get trainer's payment status with comprehensive data
   * Uses existing InvoiceService methods
   */
  getPaymentStatus(trainerId: number): Observable<{
    invoices: any[];
    summary: {
      totalPaid: number;
      totalPending: number;
      totalInvoices: number;
      lastPaymentDate?: string;
      averagePaymentAmount: number;
    };
  }> {
    return combineLatest([
      this.invoiceService.getTrainerInvoices(),
      this.purchaseOrderService.getTrainerPOs(),
      this.enrollmentService.getByTrainerId(trainerId)
    ]).pipe(
      map(([invoices, pos, enrollments]) => {
        // Filter invoices for this trainer
        const trainerPOIds = pos.filter(po =>
          enrollments.some(e => e.id === po.enrollmentId)
        ).map(po => po.id);

        const trainerInvoices = invoices.filter(invoice =>
          trainerPOIds.includes(invoice.poId)
        );

        const totalPaid = trainerInvoices
          .filter(inv => inv.status === 'PAID')
          .reduce((sum, inv) => sum + (inv.amount || 0), 0);

        const totalPending = trainerInvoices
          .filter(inv => inv.status === 'PENDING' || inv.status === 'APPROVED' || inv.status === 'SENT')
          .reduce((sum, inv) => sum + (inv.amount || 0), 0);

        const paidInvoices = trainerInvoices.filter(inv => inv.status === 'PAID');
        const lastPaymentDate = paidInvoices.length > 0
          ? paidInvoices.sort((a, b) => new Date(b.invoiceDate).getTime() - new Date(a.invoiceDate).getTime())[0].invoiceDate
          : undefined;

        const averagePaymentAmount = paidInvoices.length > 0
          ? totalPaid / paidInvoices.length
          : 0;

        return {
          invoices: trainerInvoices,
          summary: {
            totalPaid,
            totalPending,
            totalInvoices: trainerInvoices.length,
            lastPaymentDate,
            averagePaymentAmount
          }
        };
      })
    );
  }

  /**
   * Get trainer's invoice history with filtering options
   * Uses existing InvoiceService methods
   */
  getInvoiceHistory(trainerId: number, filters?: {
    status?: string;
    dateFrom?: string;
    dateTo?: string;
  }): Observable<{
    invoices: any[];
    summary: {
      totalValue: number;
      totalInvoices: number;
      averageAmount: number;
    };
  }> {
    return combineLatest([
      this.invoiceService.getTrainerInvoices(),
      this.purchaseOrderService.getTrainerPOs(),
      this.enrollmentService.getByTrainerId(trainerId)
    ]).pipe(
      map(([invoices, pos, enrollments]) => {
        // Filter invoices for this trainer
        const trainerPOIds = pos.filter(po =>
          enrollments.some(e => e.id === po.enrollmentId)
        ).map(po => po.id);

        let trainerInvoices = invoices.filter(invoice =>
          trainerPOIds.includes(invoice.poId)
        );

        // Apply filters
        if (filters?.status) {
          trainerInvoices = trainerInvoices.filter(inv => inv.status === filters.status);
        }

        if (filters?.dateFrom) {
          trainerInvoices = trainerInvoices.filter(inv =>
            new Date(inv.invoiceDate) >= new Date(filters.dateFrom!)
          );
        }

        if (filters?.dateTo) {
          trainerInvoices = trainerInvoices.filter(inv =>
            new Date(inv.invoiceDate) <= new Date(filters.dateTo!)
          );
        }

        const totalValue = trainerInvoices.reduce((sum, inv) =>
          sum + (inv.amount || 0) + (inv.tax || 0), 0
        );

        const averageAmount = trainerInvoices.length > 0
          ? totalValue / trainerInvoices.length
          : 0;

        return {
          invoices: trainerInvoices,
          summary: {
            totalValue,
            totalInvoices: trainerInvoices.length,
            averageAmount
          }
        };
      })
    );
  }

  /**
   * Get trainer profile data
   * Uses existing TrainerService methods
   */
  getTrainerProfile(trainerId: number): Observable<{
    trainer: any;
    stats: {
      totalTrainings: number;
      totalEarnings: number;
      averageRating?: number;
    };
  }> {
    return combineLatest([
      this.trainerService.getById(trainerId),
      this.enrollmentService.getByTrainerId(trainerId),
      this.invoiceService.getTrainerInvoices()
    ]).pipe(
      map(([trainer, enrollments, invoices]) => {
        const totalTrainings = enrollments.length;

        // Calculate earnings from paid invoices
        const totalEarnings = invoices
          .filter(inv => inv.status === 'PAID')
          .reduce((sum, inv) => sum + (inv.amount || 0), 0);

        return {
          trainer,
          stats: {
            totalTrainings,
            totalEarnings,
            averageRating: 0 // Trainer model doesn't have rating property
          }
        };
      })
    );
  }
}
