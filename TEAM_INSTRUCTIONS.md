# 👥 Team Member Instructions - Pine App

**Welcome to the Pine App development team!** This guide will help you get started quickly.

---

## 🎯 Your Role & Responsibilities

### Team 2: Admin - Enrollment & PO Owner
**Your folders:**
- `src/app/admin/enrollment/` (create this)
- `src/app/admin/purchase-orders/` (create this)

**Your tasks:**
- Create enrollment management UI (list, create, edit enrollments)
- Create Client PO generation flow
- Create Trainer PO generation flow
- Add routes to `src/app/admin/admin.routes.ts`

---

### Team 3: Admin - Invoice & Dashboard Owner
**Your folders:**
- `src/app/admin/invoices/` (create this)
- `src/app/admin/dashboard/` (create this)

**Your tasks:**
- Create invoice approval UI
- Create admin dashboard with metrics
- Display enrollment/PO/invoice statistics
- Add routes to `src/app/admin/admin.routes.ts`

---

### Team 4: Trainer - Training & PO Owner
**Your folders:**
- `src/app/trainer/trainings/` (create this)
- `src/app/trainer/purchase-orders/` (create this)

**Your tasks:**
- Create assigned trainings list view
- Create trainer PO viewing interface
- Show trainer-specific data only
- Add routes to `src/app/trainer/trainer.routes.ts`

---

### Team 5: Trainer - Invoice & Dashboard Owner
**Your folders:**
- `src/app/trainer/invoices/` (create this)
- `src/app/trainer/dashboard/` (create this)

**Your tasks:**
- Create invoice upload UI for trainers
- Create invoice history view
- Create trainer dashboard
- Add routes to `src/app/trainer/trainer.routes.ts`

---

## 🚀 Getting Started

### 1. Setup Your Environment

```bash
# Install dependencies (if not already done)
npm install

# Start the mock backend in one terminal
npx json-server db.json --port 3000

# Start the dev server in another terminal
npm start
```

### 2. Login to Test

Navigate to `http://localhost:4200`

**Admin credentials:**
- Email: `admin@pine.com`
- Password: `admin123`

**Trainer credentials:**
- Email: `trainer1@pine.com`
- Password: `trainer123`

---

## 📚 How to Use Shared Models

### Import Models

All data models are in `src/app/shared/models/`. Import them like this:

```typescript
import { User, Company, Trainer, Enrollment, PurchaseOrder, Invoice } from '../shared/models';
// Or if deeper: '../../shared/models' or '../../../shared/models'
```

### Available Models

#### **User Model**
```typescript
interface User {
  id: number;
  email: string;
  password: string;
  role: 'admin' | 'trainer';
  trainerId?: number;
}
```

#### **Company Model**
```typescript
interface Company {
  id: number;
  name: string;
  email: string;
  industry: string;
}
```

#### **Trainer Model**
```typescript
interface Trainer {
  id: number;
  name: string;
  email: string;
  technologies: string[];
  paymentType: 'hourly' | 'daily' | 'monthly';
  rate: number;
}
```

#### **Enrollment Model**
```typescript
interface Enrollment {
  id: number;
  companyId: number;
  trainerId: number;
  technology: string;
  startDate: string;
  endDate: string;
  budget: number;
  status: 'REQUESTED' | 'APPROVED' | 'ONGOING' | 'COMPLETED';
}
```

#### **PurchaseOrder Model**
```typescript
interface PurchaseOrder {
  id: number;
  enrollmentId: number;
  type: 'CLIENT' | 'TRAINER';
  paymentType?: 'hourly' | 'daily' | 'monthly';
  rate?: number;
  totalAmount: number;
  paymentTerms?: string;
  status: 'GENERATED' | 'SENT' | 'ACCEPTED' | 'RECEIVED';
}
```

#### **Invoice Model**
```typescript
interface Invoice {
  id: number;
  poId: number;
  issuedBy: 'ADMIN' | 'TRAINER';
  amount: number;
  tax?: number;
  invoiceDate: string;
  status: 'PENDING' | 'APPROVED' | 'SENT' | 'PAID';
}
```

---

## 🌐 API Access (JSON Server)

All API calls go to `http://localhost:3000`

### 🎯 **IMPORTANT: Use Shared Services!**

**Don't write HTTP calls directly!** We've created shared services for you.

All backend services are in `src/app/shared/services/`:
- `CompanyService` - Company/client management
- `TrainerService` - Trainer management  
- `EnrollmentService` - Enrollment management
- `PurchaseOrderService` - PO management
- `InvoiceService` - Invoice management

### Importing Services

```typescript
// Import all services
import { CompanyService, EnrollmentService, InvoiceService } from '../../shared/services';

// Or import individual service
import { EnrollmentService } from '../../shared/services/enrollment.service';

// Use inject() in your component
import { inject } from '@angular/core';

export class MyComponent {
  private enrollmentService = inject(EnrollmentService);
}
```

### Available Service Methods

#### **CompanyService**
```typescript
getAll(): Observable<Company[]>
getById(id: number): Observable<Company>
create(company: Partial<Company>): Observable<Company>
update(id: number, company: Partial<Company>): Observable<Company>
delete(id: number): Observable<void>
searchByIndustry(industry: string): Observable<Company[]>
```

#### **TrainerService**
```typescript
getAll(): Observable<Trainer[]>
getById(id: number): Observable<Trainer>
create(trainer: Partial<Trainer>): Observable<Trainer>
update(id: number, trainer: Partial<Trainer>): Observable<Trainer>
delete(id: number): Observable<void>
searchByTechnology(technology: string): Observable<Trainer[]>
getByPaymentType(paymentType: 'hourly' | 'daily' | 'monthly'): Observable<Trainer[]>
```

#### **EnrollmentService** (Team 2 primary, all teams can view)
```typescript
getAll(): Observable<Enrollment[]>
getById(id: number): Observable<Enrollment>
create(enrollment: Partial<Enrollment>): Observable<Enrollment>
update(id: number, enrollment: Partial<Enrollment>): Observable<Enrollment>
delete(id: number): Observable<void>
getByStatus(status: 'REQUESTED' | 'APPROVED' | 'ONGOING' | 'COMPLETED'): Observable<Enrollment[]>
getByCompanyId(companyId: number): Observable<Enrollment[]>
getByTrainerId(trainerId: number): Observable<Enrollment[]>  // Use this for trainers!
updateStatus(id: number, status: string): Observable<Enrollment>
```

#### **PurchaseOrderService** (Team 2 primary, Team 4 view)
```typescript
getAll(): Observable<PurchaseOrder[]>
getById(id: number): Observable<PurchaseOrder>
create(po: Partial<PurchaseOrder>): Observable<PurchaseOrder>
update(id: number, po: Partial<PurchaseOrder>): Observable<PurchaseOrder>
delete(id: number): Observable<void>
getByType(type: 'CLIENT' | 'TRAINER'): Observable<PurchaseOrder[]>
getByStatus(status: 'GENERATED' | 'SENT' | 'ACCEPTED' | 'RECEIVED'): Observable<PurchaseOrder[]>
getByEnrollmentId(enrollmentId: number): Observable<PurchaseOrder[]>
updateStatus(id: number, status: string): Observable<PurchaseOrder>
getClientPOs(): Observable<PurchaseOrder[]>
getTrainerPOs(): Observable<PurchaseOrder[]>
```

#### **InvoiceService** (Team 3 & Team 5)
```typescript
getAll(): Observable<Invoice[]>
getById(id: number): Observable<Invoice>
create(invoice: Partial<Invoice>): Observable<Invoice>
update(id: number, invoice: Partial<Invoice>): Observable<Invoice>
delete(id: number): Observable<void>
getByIssuedBy(issuedBy: 'ADMIN' | 'TRAINER'): Observable<Invoice[]>
getByStatus(status: 'PENDING' | 'APPROVED' | 'SENT' | 'PAID'): Observable<Invoice[]>
getByPOId(poId: number): Observable<Invoice[]>
updateStatus(id: number, status: string): Observable<Invoice>
approve(id: number): Observable<Invoice>  // Shortcut for Team 3
getAdminInvoices(): Observable<Invoice[]>
getTrainerInvoices(): Observable<Invoice[]>
getPendingInvoices(): Observable<Invoice[]>  // For Team 3
```

### Common Endpoints (if you need direct HTTP calls)

```typescript
// Get all enrollments
GET http://localhost:3000/enrollments

// Get specific enrollment
GET http://localhost:3000/enrollments/1

// Create new enrollment
POST http://localhost:3000/enrollments
Body: { companyId: 1, trainerId: 1, ... }

// Update enrollment
PUT http://localhost:3000/enrollments/1
Body: { ...enrollment data }

// Partial update
PATCH http://localhost:3000/enrollments/1
Body: { status: 'APPROVED' }

// Delete enrollment
DELETE http://localhost:3000/enrollments/1

// Query examples
GET http://localhost:3000/enrollments?status=APPROVED
GET http://localhost:3000/enrollments?trainerId=1
GET http://localhost:3000/purchaseOrders?type=CLIENT
```

Same patterns apply for: `/companies`, `/trainers`, `/purchaseOrders`, `/invoices`

---

## 🎨 Using the Pineapple Theme

### Quick Examples

```html
<!-- Buttons -->
<button class="pine-btn pine-btn-primary">Save Enrollment</button>
<button class="pine-btn pine-btn-secondary">Approve</button>
<button class="pine-btn pine-btn-outline">Cancel</button>

<!-- Cards -->
<div class="pine-card">
  <h3>Enrollment Details</h3>
  <p>Content here...</p>
</div>

<!-- Inputs -->
<input type="text" class="pine-input" placeholder="Client name" />

<!-- Badges for Status -->
<span class="pine-badge pine-badge-success">APPROVED</span>
<span class="pine-badge pine-badge-warning">PENDING</span>
<span class="pine-badge pine-badge-error">REJECTED</span>

<!-- Status Colors -->
<span class="pine-status-approved">APPROVED</span>
<span class="pine-status-requested">REQUESTED</span>
<span class="pine-status-ongoing">ONGOING</span>
<span class="pine-status-completed">COMPLETED</span>
```

See [THEME_GUIDE.md](./THEME_GUIDE.md) for more examples.

---

## 📁 Creating Your Components

### Generate Component

```bash
# Admin teams
ng generate component admin/enrollment/enrollment-list
ng generate component admin/enrollment/enrollment-form
ng generate component admin/dashboard/admin-dashboard

# Trainer teams
ng generate component trainer/trainings/training-list
ng generate component trainer/dashboard/trainer-dashboard
```

### Component Template (Best Practices)

```typescript
import { Component, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-enrollment-list',
  imports: [CommonModule, RouterLink],
  templateUrl: './enrollment-list.component.html',
  styleUrl: './enrollment-list.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EnrollmentListComponent {
  // Use inject() instead of constructor injection
  private enrollmentService = inject(EnrollmentService);
  
  // Use signals for reactive state
  enrollments = signal<Enrollment[]>([]);
  isLoading = signal(false);
  
  ngOnInit() {
    this.loadEnrollments();
  }
  
  loadEnrollments() {
    this.isLoading.set(true);
    this.enrollmentService.getAll().subscribe({
      next: (data) => {
        this.enrollments.set(data);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Error loading enrollments:', err);
        this.isLoading.set(false);
      }
    });
  }
}
```

---

## 🛣️ Adding Your Routes

### Admin Routes (`src/app/admin/admin.routes.ts`)

```typescript
import { Routes } from '@angular/router';
import { EnrollmentListComponent } from './enrollment/enrollment-list.component';
import { AdminDashboardComponent } from './dashboard/admin-dashboard.component';

export const ADMIN_ROUTES: Routes = [
  {
    path: '',
    children: [
      { path: 'dashboard', component: AdminDashboardComponent },
      { path: 'enrollments', component: EnrollmentListComponent },
      { path: 'enrollments/new', component: EnrollmentFormComponent },
      { path: 'purchase-orders', component: POListComponent },
      { path: 'invoices', component: InvoiceListComponent },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    ],
  },
];
```

Access at: `http://localhost:4200/admin/dashboard`

### Trainer Routes (`src/app/trainer/trainer.routes.ts`)

```typescript
import { Routes } from '@angular/router';
import { TrainingListComponent } from './trainings/training-list.component';

export const TRAINER_ROUTES: Routes = [
  {
    path: '',
    children: [
      { path: 'dashboard', component: TrainerDashboardComponent },
      { path: 'trainings', component: TrainingListComponent },
      { path: 'purchase-orders', component: TrainerPOListComponent },
      { path: 'invoices', component: InvoiceUploadComponent },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    ],
  },
];
```

Access at: `http://localhost:4200/trainer/dashboard`

---

## ✅ Best Practices Checklist

- ✅ Always import shared models (never create inline interfaces)
- ✅ Use `inject()` for dependency injection
- ✅ Use signals for reactive state
- ✅ Use `ChangeDetectionStrategy.OnPush`
- ✅ Create services for API logic (not in components)
- ✅ Use Pineapple theme classes (`pine-btn`, `pine-card`, etc.)
- ✅ Make components standalone (no NgModules)
- ✅ Use native control flow (`@if`, `@for` instead of `*ngIf`, `*ngFor`)
- ✅ Test your routes work before PR
- ✅ Only touch files in your ownership area

---

## 🚫 Common Mistakes to Avoid

❌ **Don't** create inline interfaces:
```typescript
// BAD
interface MyEnrollment { id: number; name: string; }

// GOOD
import { Enrollment } from '../../shared/models';
```

❌ **Don't** use constructor injection:
```typescript
// BAD
constructor(private http: HttpClient) {}

// GOOD
private http = inject(HttpClient);
```

❌ **Don't** modify shared models:
```typescript
// BAD - Don't change user.model.ts
// Ask PM/Auth Owner first!

// GOOD - Use models as-is
import { User } from '../../shared/models';
```

❌ **Don't** hardcode colors:
```typescript
// BAD
<button style="background: #ffd93d">Click</button>

// GOOD
<button class="pine-btn pine-btn-primary">Click</button>
```

---

## 🔄 Git Workflow Reminder

```bash
# Always start from develop
git checkout develop
git pull origin develop

# Create your feature branch
git checkout -b feature/enrollment-list

# Work and commit
git add .
git commit -m "feat: add enrollment list component"

# Push and create PR
git push origin feature/enrollment-list
```

**PR Rules:**
- Only modify files in your ownership folders
- Keep PRs small and focused
- Test builds locally: `npm run build`
- PM/Auth Owner will review and merge

---

## 📞 Need Help?

1. Check this guide first
2. Check [README.md](./README.md)
3. Check [THEME_GUIDE.md](./THEME_GUIDE.md)
4. Ask PM/Auth Owner for architectural questions
5. Ask your team lead for feature-specific questions

---

## 🎯 Quick Reference Card

| Need | Import From | Example |
|------|-------------|---------|
| Models | `../../shared/models` | `import { Enrollment } from '../../shared/models'` |
| HttpClient | `@angular/common/http` | `private http = inject(HttpClient)` |
| Router | `@angular/router` | `private router = inject(Router)` |
| CommonModule | `@angular/common` | `imports: [CommonModule]` |
| ReactiveFormsModule | `@angular/forms` | `imports: [ReactiveFormsModule]` |
| AuthService | `../../auth/auth-service` | `private auth = inject(AuthService)` |

---

## 📊 Example: Complete Feature Flow

### Scenario: Admin creates an enrollment

1. **Service** (`enrollment.service.ts`):
```typescript
create(enrollment: Partial<Enrollment>): Observable<Enrollment> {
  return this.http.post<Enrollment>('http://localhost:3000/enrollments', enrollment);
}
```

2. **Component** (`enrollment-form.component.ts`):
```typescript
import { inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { EnrollmentService } from '../enrollment.service';

export class EnrollmentFormComponent {
  private enrollmentService = inject(EnrollmentService);
  private router = inject(Router);
  
  isSubmitting = signal(false);
  
  form = new FormGroup({
    companyId: new FormControl(0),
    trainerId: new FormControl(0),
    technology: new FormControl(''),
    // ... other fields
  });
  
  onSubmit() {
    if (this.form.invalid) return;
    
    this.isSubmitting.set(true);
    this.enrollmentService.create(this.form.value).subscribe({
      next: () => {
        this.router.navigate(['/admin/enrollments']);
      },
      error: (err) => {
        console.error(err);
        this.isSubmitting.set(false);
      }
    });
  }
}
```

3. **Template** (`.html`):
```html
<div class="pine-container pine-section">
  <div class="pine-card">
    <h2 class="pine-text-primary">Create Enrollment</h2>
    
    <form [formGroup]="form" (ngSubmit)="onSubmit()">
      <input formControlName="technology" class="pine-input" placeholder="Technology" />
      
      <button type="submit" class="pine-btn pine-btn-primary" [disabled]="isSubmitting()">
        @if (isSubmitting()) {
          <span>Saving...</span>
        } @else {
          <span>Create Enrollment</span>
        }
      </button>
    </form>
  </div>
</div>
```

4. **Route** (`admin.routes.ts`):
```typescript
{ path: 'enrollments/new', component: EnrollmentFormComponent }
```

---

**Good luck! Build something amazing! 🍍**
