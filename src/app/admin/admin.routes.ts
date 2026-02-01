import { Routes } from '@angular/router';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';

/**
 * ADMIN MODULE ROUTES
 * 
 * This file is shared by TWO admin teams:
 * 
 * TEAM 2: Admin - Enrollment & PO Owner
 * - Create components in: src/app/admin/enrollment/
 * - Create components in: src/app/admin/purchase-orders/
 * - Add routes for: enrollment list, enrollment form, PO generation
 * - SERVICES TO USE:
 *   - EnrollmentService (src/app/shared/services/enrollment.service.ts)
 *   - PurchaseOrderService (src/app/shared/services/purchase-order.service.ts)
 *   - CompanyService (src/app/shared/services/company.service.ts)
 *   - TrainerService (src/app/shared/services/trainer.service.ts)
 * 
 * TEAM 3: Admin - Invoice & Dashboard Owner
 * - Create components in: src/app/admin/invoices/
 * - Create components in: src/app/admin/dashboard/
 * - Add routes for: invoice approval, admin dashboard
 * - SERVICES TO USE:
 *   - InvoiceService (src/app/shared/services/invoice.service.ts)
 *   - EnrollmentService (for dashboard stats)
 *   - PurchaseOrderService (for dashboard stats)
 * 
 * INSTRUCTIONS:
 * 1. Generate your components using: ng generate component admin/your-feature/your-component
 * 2. Import your components at the top of this file
 * 3. Import services in your components:
 *    import { EnrollmentService } from '../../shared/services';
 *    private enrollmentService = inject(EnrollmentService);
 * 4. Add routes in the children array below
 * 5. Test by navigating to: http://localhost:4200/admin/your-route
 * 
 * SERVICE USAGE EXAMPLE:
 * ```typescript
 * import { inject, signal } from '@angular/core';
 * import { EnrollmentService } from '../../shared/services';
 * 
 * export class EnrollmentListComponent {
 *   private enrollmentService = inject(EnrollmentService);
 *   enrollments = signal<Enrollment[]>([]);
 * 
 *   ngOnInit() {
 *     this.enrollmentService.getAll().subscribe({
 *       next: (data) => this.enrollments.set(data),
 *       error: (err) => console.error(err)
 *     });
 *   }
 * }
 * ```
 */

export const ADMIN_ROUTES: Routes = [
    {
        path: '',
        children: [
            // TODO (Team 2 - Enrollment & PO): Add enrollment routes here
            // Example: { path: 'enrollments', component: EnrollmentListComponent }
            // Example: { path: 'enrollments/new', component: EnrollmentFormComponent }
            // Example: { path: 'enrollments/:id', component: EnrollmentDetailComponent }
            // Use: EnrollmentService.getAll(), create(), update(), getByStatus()

            // TODO (Team 2 - Enrollment & PO): Add purchase order routes here
            // Example: { path: 'purchase-orders', component: POListComponent }
            // Example: { path: 'purchase-orders/client/new', component: ClientPOFormComponent }
            // Example: { path: 'purchase-orders/trainer/new', component: TrainerPOFormComponent }
            // Use: PurchaseOrderService.getAll(), create(), getByType('CLIENT'), getByType('TRAINER')

            // TODO (Team 3 - Invoice & Dashboard): Add dashboard route here
            { path: 'dashboard', component: AdminDashboardComponent },
            // Use: EnrollmentService.getByStatus(), PurchaseOrderService.getAll(), InvoiceService.getPendingInvoices()

            // TODO (Team 3 - Invoice & Dashboard): Add invoice routes here
            // Example: { path: 'invoices', component: InvoiceListComponent }
            // Example: { path: 'invoices/:id/approve', component: InvoiceApprovalComponent }
            // Use: InvoiceService.getAll(), getPendingInvoices(), approve(id)

            // TODO: After adding dashboard component, set it as default:
            { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
        ],
    },
];
