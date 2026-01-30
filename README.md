
# 🍍 Pine App - Financial & Training Management System

> **Enterprise Angular 21 application with team-based modular architecture**

Pine App is a comprehensive financial and training management system built for an EdTech company. The application follows strict role-based access control, modular architecture, and Git-based team workflows.

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm 11+
- Angular CLI 21.1.0
- Git

### Installation

```bash
# Clone the repository
cd pine-app

# Install dependencies
npm install

# Start JSON Server (mock backend) in one terminal
npx json-server db.json --port 3000

# Start Angular dev server in another terminal
npm start

# Navigate to http://localhost:4200
```

### Demo Credentials

**Admin Account:**
- Email: `admin@pine.com`
- Password: `admin123`
- Redirects to: `/admin`

**Trainer Account 1:**
- Email: `trainer1@pine.com`
- Password: `trainer123`
- Redirects to: `/trainer`

---

## 🎨 Pineapple Theme

Pine App uses a custom **Pineapple Design System** with vibrant tropical colors:
- **Pine Yellow** (#ffd93d) - Primary brand color
- **Pine Green** (#6bcf63) - Secondary color
- **Pine Orange** (#ff9f40) - Accent color

See [THEME_GUIDE.md](./THEME_GUIDE.md) for complete usage documentation.

---

## 👥 Team Structure & Ownership

###  1. **Project Manager / Auth Owner** (YOU)
- ✅ Authentication & Authorization
- ✅ Core guards and interceptors
- ✅ Shared models and contracts
- ✅ Mock backend (db.json)
- ✅ App-level routing
- ✅ PR reviews and merges

### 2. **Admin - Enrollment & PO Owner**
- 📂 Works in: `src/app/admin/enrollment/`, `src/app/admin/purchase-orders/`
- 🎯 Features: Enrollment management, Client PO creation, Trainer PO creation

### 3. **Admin - Invoice & Dashboard Owner**
- 📂 Works in: `src/app/admin/invoices/`, `src/app/admin/dashboard/`
- 🎯 Features: Invoice approval, Admin dashboard metrics

### 4. **Trainer - Training & PO Owner**
- 📂 Works in: `src/app/trainer/trainings/`, `src/app/trainer/purchase-orders/`
- 🎯 Features: Assigned trainings, Trainer PO views

### 5. **Trainer - Invoice & Dashboard Owner**
- 📂 Works in: `src/app/trainer/invoices/`, `src/app/trainer/dashboard/`
- 🎯 Features: Invoice upload, Trainer dashboard

---

## 🏗️ Architecture

### Technology Stack
- **Framework**: Angular 21.1.0 (Standalone Components)
- **State Management**: Signals
- **Styling**: TailwindCSS 4 + Custom Pineapple Theme
- **Testing**: Vitest 4.0.8
- **TypeScript**: 5.9.2
- **Mock Backend**: JSON Server

### Key Features
✅ Standalone components (no NgModules)  
✅ Functional route guards (`CanActivateFn`)  
✅ `inject()` based dependency injection  
✅ JWT token authentication with HTTP interceptors  
✅ Lazy-loaded feature modules  
✅ Signal-based reactive state  
✅ Custom Pineapple design system  

###  Project Structure

```
pine-app/
├── src/
│   ├── app/
│   │   ├── admin/              # Admin module
│   │   │   └── admin.routes.ts  # Admin routes (teams add features here)
│   │   ├── auth/                # Authentication module
│   │   │   ├── auth-service.ts  # JWT auth service
│   │   │   ├── auth.routes.ts
│   │   │   └── login-component/ # Standalone login
│   │   ├── core/                # Core functionality
│   │   │   ├── guards/          # Route guards
│   │   │   │   ├── auth-guard.ts
│   │   │   │   ├── admin-guard.ts
│   │   │   │   └── trainer-guard.ts
│   │   │   └── interceptors/    # HTTP interceptors
│   │   │       ├── auth.interceptor.ts    # JWT token injection
│   │   │       └── error.interceptor.ts   # Error handling
│   │   ├── shared/              # Shared resources
│   │   │   └── models/          # Data contracts
│   │   │       ├── user.model.ts
│   │   │       ├── company.model.ts
│   │   │       ├── trainer.model.ts
│   │   │       ├── enrollment.model.ts
│   │   │       ├── purchase-order.model.ts
│   │   │       ├── invoice.model.ts
│   │   │       └── index.ts     # Barrel export
│   │   ├── trainer/             # Trainer module
│   │   │   └── trainer.routes.ts # Trainer routes (teams add features here)
│   │   ├── app.routes.ts        # Main routing
│   │   ├── app.config.ts        # App configuration + interceptors
│   │   └── app.html             # App shell
│   ├── styles.css               # 🍍 Pineapple Theme System
│   └── index.html
├── db.json                      # JSON Server database
├── THEME_GUIDE.md               # Theme documentation
└── package.json
```

---

## 📦 Shared Models & Services

All teams must use shared models and services from `src/app/shared/`:

### **Models** (`src/app/shared/models/`)
```typescript
import { User, Company, Trainer, Enrollment, PurchaseOrder, Invoice } from '@app/shared/models';
```

| Model | Description | Owner |
|-------|-------------|-------|
| `User` | User accounts (admin/trainer) | PM/Auth |
| `Company` | Client organizations | Admin teams |
| `Trainer` | Trainer profiles | Admin & Trainer teams |
| `Enrollment` | Training enrollments | Admin - Enrollment team |
| `PurchaseOrder` | Client & Trainer POs | Both Admin teams |
| `Invoice` | Admin & Trainer invoices | Both teams |

### **Services** (`src/app/shared/services/`)
```typescript
import { CompanyService, EnrollmentService, InvoiceService } from '@app/shared/services';
```

**✅ All backend services are pre-built for you!**

| Service | Primary Owner | Description |
|---------|--------------|-------------|
| `CompanyService` | Team 2 (Admin) | Company/client CRUD & search |
| `TrainerService` | Team 2 (Admin) | Trainer CRUD & search |
| `EnrollmentService` | Team 2 (Admin) | Enrollment CRUD, filtering, status management |
| `PurchaseOrderService` | Team 2 (Admin) | PO CRUD, type/status filtering |
| `InvoiceService` | Team 3 & 5 | Invoice CRUD, approval workflow |

**Key Service Methods:**
- All services have: `getAll()`, `getById()`, `create()`, `update()`, `delete()`
- Filtering: `getByStatus()`, `getByType()`, `getByTrainerId()`, etc.
- Actions: `updateStatus()`, `approve()` (invoices only)

See [TEAM_INSTRUCTIONS.md](./TEAM_INSTRUCTIONS.md) for complete API documentation.

---

## 🔐 Authentication & Security

### JWT Token Flow

1. User logs in with email/password
2. AuthService validates credentials against `db.json`
3. Mock JWT token generated and stored in localStorage
4. `authInterceptor` automatically adds token to all HTTP requests
5. `errorInterceptor` handles 401 errors and redirects to login

### Guards

- **authGuard**: Checks if user is logged in
- **adminGuard**: Requires `role === 'admin'`
- **trainerGuard**: Requires `role === 'trainer'`

### Usage Example

```typescript
// In your component
import { inject } from '@angular/core';
import { AuthService } from '@app/auth/auth-service';

export class MyComponent {
  private authService = inject(AuthService);
  
  currentUser = this.authService.currentUser; // Signal
  isLoggedIn = this.authService.isAuthenticated; // Signal
  
  logout() {
    this.authService.logout();
  }
}
```

---

## 🌊 Git Workflow

### Branch Strategy
```
main (protected)
  └── develop (integration)
       ├── feature/admin-enrollment
       ├── feature/admin-invoices
       ├── feature/trainer-dashboard
       └── feature/trainer-po-view
```

### Creating a Feature

```bash
# Create feature branch from develop
git checkout develop
git pull origin develop
git checkout -b feature/my-feature

# Work on your feature...
# Commit with meaningful messages
git add .
git commit -m "feat: add enrollment list component"

# Push and create PR
git push origin feature/my-feature
```

### PR Rules
✅ Must touch only your owned folders  
✅ Must be small and focused  
✅ Must pass `npm run build` locally  
✅ Reviewed and merged by PM/Auth Owner  

---

## 🎯 Team Guidelines

### Do's ✅
- Use `inject()` for dependency injection
- Use signals for reactive state
- Import shared models: `import { User } from '@app/shared/models'`
- Use Pineapple theme utilities: `class="pine-btn pine-btn-primary"`
- Create standalone components
- Keep components focused and single-responsibility
- Use services for API logic

### Don'ts ❌
- Don't use NgModules
- Don't create inline interfaces (use shared models)
- Don't modify files outside your ownership
- Don't use `@HostBinding`/`@HostListener` (use `host` object)
- Don't use `ngClass`/`ngStyle` (use property bindings)
- Don't commit to `main` or `develop` directly

---

## 📚 API Endpoints (JSON Server)

```
GET    /users              # All users
GET    /users?email=x      # Login query
GET    /companies          # All companies
GET    /trainers           # All trainers
GET    /enrollments        # All enrollments
POST   /enrollments        # Create enrollment
GET    /purchaseOrders     # All POs
POST   /purchaseOrders     # Create PO
GET    /invoices           # All invoices
POST   /invoices           # Create invoice
```

Full REST API available at `http://localhost:3000`

---

## 🧪 Testing

```bash
# Run unit tests
npm test

# Build for production
npm run build

# Check for linting issues
ng lint
```

---

## 📖 Additional Documentation

- [THEME_GUIDE.md](./THEME_GUIDE.md) - Complete Pineapple theme system
- [Angular Best Practices](https://angular.dev/best-practices)
- [Standalone Components Guide](https://angular.dev/guide/components)

---

## 🤝 Communication Rules

- **Breaking changes** to shared models require team alignment
- **Changes to db.json** must be announced
- **New global styles** must be approved by PM/Auth Owner
- Ask questions in team chat, not in PRs

---

## 📞 Support

For architecture questions or PR reviews, contact the **Project Manager / Auth Owner**.

---

**Built with 🍍 and Angular 21**
