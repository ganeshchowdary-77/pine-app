import { Routes } from '@angular/router';
import { TrainerLayoutComponent } from './trainer-layout/trainer-layout.component';
import { TrainerDashboardComponent } from './dashboard/dashboard.component';
import { AssignedTrainingsComponent } from './assigned-trainings/assigned-trainings.component';
import { PoDetailsComponent } from './po-details/po-details.component';
import { InvoiceUploadComponent } from './invoice-upload/invoice-upload.component';
import { PaymentStatusComponent } from './payment-status/payment-status.component';
import { InvoiceHistoryComponent } from './invoice-history/invoice-history.component';

export const TRAINER_ROUTES: Routes = [
    {
        path: '',
        component: TrainerLayoutComponent,
        children: [
            // Trainer Dashboard (Team 5 - Invoice & Dashboard)
            { path: 'dashboard', component: TrainerDashboardComponent },

            // Training & PO Routes (Team 4 - Training & PO)
            { path: 'assigned-trainings', component: AssignedTrainingsComponent },
            { path: 'po-details', component: PoDetailsComponent },

            // Invoice Routes (Team 5 - Invoice & Dashboard)
            { path: 'invoice-upload', component: InvoiceUploadComponent },
            { path: 'payment-status', component: PaymentStatusComponent },
            { path: 'invoice-history', component: InvoiceHistoryComponent },

            // Default route redirects to dashboard
            { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
        ],
    },
];

/**
 * TRAINER MODULE ROUTES
 * 
 * This file is shared by TWO trainer teams:
 * 
 * TEAM 4: Trainer - Training & PO Owner
 * - Create components in: src/app/trainer/trainings/
 * - Create components in: src/app/trainer/purchase-orders/
 * - Add routes for: assigned trainings list, trainer PO views
 * - SERVICES TO USE:
 *   - EnrollmentService (src/app/shared/services/enrollment.service.ts)
 *   - PurchaseOrderService (src/app/shared/services/purchase-order.service.ts)
 *   - TrainerService (src/app/shared/services/trainer.service.ts)
 * 
 * TEAM 5: Trainer - Invoice & Dashboard Owner
 * - Create components in: src/app/trainer/invoices/
 * - Create components in: src/app/trainer/dashboard/
 * - Add routes for: invoice upload, invoice history, trainer dashboard
 * - SERVICES TO USE:
 *   - InvoiceService (src/app/shared/services/invoice.service.ts)
 *   - EnrollmentService (for dashboard stats)
 *   - PurchaseOrderService (for dashboard stats)
 * 
 * INSTRUCTIONS:
 * 1. Generate your components using: ng generate component trainer/your-feature/your-component
 * 2. Import your components at the top of this file
 * 3. Import services in your components:
 *    import { EnrollmentService, AuthService } from '../../shared/services';
 *    private enrollmentService = inject(EnrollmentService);
 *    private authService = inject(AuthService);
 * 4. Add routes in the children array below
 * 5. Test by navigating to: http://localhost:4200/trainer/your-route
 * 
 * IMPORTANT: Only show data for the logged-in trainer!
 * - Get current user: const user = inject(AuthService).currentUser();
 * - Filter by trainerId: enrollmentService.getByTrainerId(user.trainerId!)
 * 
 * SERVICE USAGE EXAMPLE:
 * ```typescript
 * import { inject, signal } from '@angular/core';
 * import { EnrollmentService } from '../../shared/services';
 * import { AuthService } from '../../auth/auth-service';
 * 
 * export class TrainingListComponent {
 *   private enrollmentService = inject(EnrollmentService);
 *   private authService = inject(AuthService);
 *   trainings = signal<Enrollment[]>([]);
 * 
 *   ngOnInit() {
 *     const currentUser = this.authService.currentUser();
 *     if (currentUser?.trainerId) {
 *       this.enrollmentService.getByTrainerId(currentUser.trainerId).subscribe({
 *         next: (data) => this.trainings.set(data),
 *         error: (err) => console.error(err)
 *       });
 *     }
 *   }
 * }
 * ```
 */
