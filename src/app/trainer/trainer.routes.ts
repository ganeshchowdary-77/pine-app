import { Routes } from '@angular/router';

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

export const TRAINER_ROUTES: Routes = [
    {
        path: '',
        children: [
            // TODO (Team 4 - Training & PO): Add training routes here
            // Example: { path: 'trainings', component: TrainingListComponent }
            // Example: { path: 'trainings/:id', component: TrainingDetailComponent }
            // Use: EnrollmentService.getByTrainerId(user.trainerId!)

            // TODO (Team 4 - Training & PO): Add trainer PO routes here
            // Example: { path: 'purchase-orders', component: TrainerPOListComponent }
            // Example: { path: 'purchase-orders/:id', component: TrainerPODetailComponent }
            // Use: PurchaseOrderService.getByType('TRAINER') then filter by trainer

            // TODO (Team 5 - Invoice & Dashboard): Add dashboard route here
            // Example: { path: 'dashboard', component: TrainerDashboardComponent }
            // Use: EnrollmentService.getByTrainerId(), InvoiceService.getTrainerInvoices()

            // TODO (Team 5 - Invoice & Dashboard): Add invoice routes here
            // Example: { path: 'invoices', component: InvoiceListComponent }
            // Example: { path: 'invoices/upload', component: InvoiceUploadComponent }
            // Example: { path: 'invoices/history', component: InvoiceHistoryComponent }
            // Use: InvoiceService.getTrainerInvoices(), create(invoice)

            // TODO: After adding dashboard component, set it as default:
            // { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
        ],
    },
];
