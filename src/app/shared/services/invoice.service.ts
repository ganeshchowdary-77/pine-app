import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Invoice } from '../models';

/**
 * INVOICE SERVICE
 * 
 * Used by:
 * - Admin - Invoice & Dashboard Owner (Team 3) for approval and management
 * - Trainer - Invoice & Dashboard Owner (Team 5) for upload and viewing
 * 
 * This service handles all Invoice-related API calls.
 * 
 * Invoice Types:
 * - ADMIN: Invoice sent to client for payment
 * - TRAINER: Invoice submitted by trainer for compensation
 * 
 * Status Flow:
 * PENDING → APPROVED → SENT → PAID
 * 
 * Example usage:
 * private invoiceService = inject(InvoiceService);
 * this.invoiceService.getAll().subscribe(invoices => {...});
 */
@Injectable({
    providedIn: 'root',
})
export class InvoiceService {
    private http = inject(HttpClient);
    private apiUrl = 'http://localhost:3000/invoices';

    /**
     * Get all invoices
     */
    getAll(): Observable<Invoice[]> {
        return this.http.get<Invoice[]>(this.apiUrl);
    }

    /**
     * Get invoice by ID
     */
    getById(id: number): Observable<Invoice> {
        return this.http.get<Invoice>(`${this.apiUrl}/${id}`);
    }

    /**
     * Create new invoice
     * Used by: Admin (Team 3) or Trainer (Team 5)
     */
    create(invoice: Partial<Invoice>): Observable<Invoice> {
        return this.http.post<Invoice>(this.apiUrl, invoice);
    }

    /**
     * Update existing invoice
     * Used by: Admin (Team 3) or Trainer (Team 5)
     */
    update(id: number, invoice: Partial<Invoice>): Observable<Invoice> {
        return this.http.put<Invoice>(`${this.apiUrl}/${id}`, invoice);
    }

    /**
     * Delete invoice
     * Used by: Admin (Team 3)
     */
    delete(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }

    /**
     * Get invoices by issuer (ADMIN or TRAINER)
     */
    getByIssuedBy(issuedBy: 'ADMIN' | 'TRAINER'): Observable<Invoice[]> {
        return this.http.get<Invoice[]>(`${this.apiUrl}?issuedBy=${issuedBy}`);
    }

    /**
     * Get invoices by status
     */
    getByStatus(status: 'PENDING' | 'APPROVED' | 'SENT' | 'PAID'): Observable<Invoice[]> {
        return this.http.get<Invoice[]>(`${this.apiUrl}?status=${status}`);
    }

    /**
     * Get invoices for a specific Purchase Order
     */
    getByPOId(poId: number): Observable<Invoice[]> {
        return this.http.get<Invoice[]>(`${this.apiUrl}?poId=${poId}`);
    }

    /**
     * Update invoice status
     * Used by: Admin - Invoice & Dashboard Owner (Team 3)
     */
    updateStatus(id: number, status: 'PENDING' | 'APPROVED' | 'SENT' | 'PAID'): Observable<Invoice> {
        return this.http.patch<Invoice>(`${this.apiUrl}/${id}`, { status });
    }

    /**
     * Approve invoice (change status from PENDING to APPROVED)
     * Used by: Admin - Invoice & Dashboard Owner (Team 3)
     */
    approve(id: number): Observable<Invoice> {
        return this.updateStatus(id, 'APPROVED');
    }

    /**
     * Get admin invoices (sent to clients)
     */
    getAdminInvoices(): Observable<Invoice[]> {
        return this.getByIssuedBy('ADMIN');
    }

    /**
     * Get trainer invoices (submitted by trainers)
     */
    getTrainerInvoices(): Observable<Invoice[]> {
        return this.getByIssuedBy('TRAINER');
    }

    /**
     * Get pending invoices (awaiting approval)
     * Used by: Admin - Invoice & Dashboard Owner (Team 3)
     */
    getPendingInvoices(): Observable<Invoice[]> {
        return this.getByStatus('PENDING');
    }
}
