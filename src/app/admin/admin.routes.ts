import { Routes } from '@angular/router';
import { EnrollmentList } from './enrollment/enrollment-list/enrollment-list';
import { EnrollmentForm } from './enrollment/enrollment-form/enrollment-form';
import { ClientPo } from './purchase-order/client-po/client-po';
import { TrainerPo } from './purchase-order/trainer-po/trainer-po';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { AdminLayoutComponent } from './admin-layout/admin-layout.component';

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
        component: AdminLayoutComponent,
        children: [
            // TEAM 3 - INVOICE & DASHBOARD
            { path: 'dashboard', component: AdminDashboardComponent },

            // TEAM 2 - Enrollment & PO Management
            /* Enrollment Management */
            { path: 'enrollments', component: EnrollmentList },
            { path: 'enrollments/new', component: EnrollmentForm },
            { path: 'enrollments/edit/:id', component: EnrollmentForm },

            /* Purchase Order Management */
            { path: 'purchase-orders/client/new', component: ClientPo },
            { path: 'purchase-orders/trainer/new', component: TrainerPo },

            // Default route
            { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
        ],
    },
];
