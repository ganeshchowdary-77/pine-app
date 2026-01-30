import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PurchaseOrder } from '../models';

/**
 * PURCHASE ORDER SERVICE
 * 
 * Primary Owner: Admin - Enrollment & PO Owner (Team 2)
 * Also Used By: Trainer - Training & PO Owner (Team 4) for viewing
 * 
 * This service handles all Purchase Order related API calls.
 * 
 * PO Types:
 * - CLIENT: PO sent to client for payment
 * - TRAINER: PO sent to trainer for their compensation
 * 
 * Status Flow:
 * GENERATED → SENT → ACCEPTED → RECEIVED
 * 
 * Example usage:
 * private poService = inject(PurchaseOrderService);
 * this.poService.getAll().subscribe(pos => {...});
 */
@Injectable({
    providedIn: 'root',
})
export class PurchaseOrderService {
    private http = inject(HttpClient);
    private apiUrl = 'http://localhost:3000/purchaseOrders';

    /**
     * Get all purchase orders
     */
    getAll(): Observable<PurchaseOrder[]> {
        return this.http.get<PurchaseOrder[]>(this.apiUrl);
    }

    /**
     * Get purchase order by ID
     */
    getById(id: number): Observable<PurchaseOrder> {
        return this.http.get<PurchaseOrder>(`${this.apiUrl}/${id}`);
    }

    /**
     * Create new purchase order
     * Used by: Admin - Enrollment & PO Owner (Team 2)
     */
    create(po: Partial<PurchaseOrder>): Observable<PurchaseOrder> {
        return this.http.post<PurchaseOrder>(this.apiUrl, po);
    }

    /**
     * Update existing purchase order
     * Used by: Admin - Enrollment & PO Owner (Team 2)
     */
    update(id: number, po: Partial<PurchaseOrder>): Observable<PurchaseOrder> {
        return this.http.put<PurchaseOrder>(`${this.apiUrl}/${id}`, po);
    }

    /**
     * Delete purchase order
     * Used by: Admin - Enrollment & PO Owner (Team 2)
     */
    delete(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }

    /**
     * Get POs by type (CLIENT or TRAINER)
     */
    getByType(type: 'CLIENT' | 'TRAINER'): Observable<PurchaseOrder[]> {
        return this.http.get<PurchaseOrder[]>(`${this.apiUrl}?type=${type}`);
    }

    /**
     * Get POs by status
     */
    getByStatus(status: 'GENERATED' | 'SENT' | 'ACCEPTED' | 'RECEIVED'): Observable<PurchaseOrder[]> {
        return this.http.get<PurchaseOrder[]>(`${this.apiUrl}?status=${status}`);
    }

    /**
     * Get POs for a specific enrollment
     */
    getByEnrollmentId(enrollmentId: number): Observable<PurchaseOrder[]> {
        return this.http.get<PurchaseOrder[]>(`${this.apiUrl}?enrollmentId=${enrollmentId}`);
    }

    /**
     * Update PO status
     * Used by: Admin - Enrollment & PO Owner (Team 2)
     */
    updateStatus(id: number, status: 'GENERATED' | 'SENT' | 'ACCEPTED' | 'RECEIVED'): Observable<PurchaseOrder> {
        return this.http.patch<PurchaseOrder>(`${this.apiUrl}/${id}`, { status });
    }

    /**
     * Get CLIENT POs (sent to clients)
     */
    getClientPOs(): Observable<PurchaseOrder[]> {
        return this.getByType('CLIENT');
    }

    /**
     * Get TRAINER POs (sent to trainers)
     */
    getTrainerPOs(): Observable<PurchaseOrder[]> {
        return this.getByType('TRAINER');
    }
}
