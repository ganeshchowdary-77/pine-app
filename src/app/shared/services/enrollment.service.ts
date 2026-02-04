import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin, of, from } from 'rxjs';
import { switchMap, map, catchError, toArray, concatMap } from 'rxjs/operators';
import { Enrollment } from '../models';
import { generateId } from '../utils/id-generator.util';

/**
 * ENROLLMENT SERVICE
 * 
 * Primary Owner: Admin - Enrollment & PO Owner (Team 2)
 * Also Used By: All other teams for viewing enrollment data
 * 
 * This service handles all Enrollment-related API calls.
 * 
 * Enrollment Status Flow:
 * REQUESTED → APPROVED → ONGOING → COMPLETED
 * 
 * Example usage:
 * private enrollmentService = inject(EnrollmentService);
 * this.enrollmentService.getAll().subscribe(enrollments => {...});
 */
@Injectable({
    providedIn: 'root',
})
export class EnrollmentService {
    private http = inject(HttpClient);
    private apiUrl = 'http://localhost:3000/enrollments';

    /**
     * Get all enrollments
     */
    getAll(): Observable<Enrollment[]> {
        return this.http.get<Enrollment[]>(this.apiUrl);
    }

    /**
     * Get enrollment by ID
     */
    getById(id: string): Observable<Enrollment> {
        return this.http.get<Enrollment>(`${this.apiUrl}/${id}`);
    }

    /**
     * Create new enrollment
     * Used by: Admin - Enrollment & PO Owner (Team 2)
     */
    create(enrollment: Partial<Enrollment>): Observable<Enrollment> {
        const newEnrollment = { ...enrollment, id: generateId() };
        return this.http.post<Enrollment>(this.apiUrl, newEnrollment);
    }

    /**
     * Update existing enrollment
     * Used by: Admin - Enrollment & PO Owner (Team 2)
     */
    update(id: string, enrollment: Partial<Enrollment>): Observable<Enrollment> {
        return this.http.patch<Enrollment>(`${this.apiUrl}/${id}`, enrollment);
    }

    /**
     * Delete enrollment
     * Used by: Admin - Enrollment & PO Owner (Team 2)
     */
    delete(id: string): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }

    /**
     * Get enrollments by status
     */
    getByStatus(status: 'REQUESTED' | 'APPROVED' | 'ONGOING' | 'COMPLETED' | 'REJECTED'): Observable<Enrollment[]> {
        return this.http.get<Enrollment[]>(`${this.apiUrl}?status=${status}`);
    }

    /**
     * Get enrollments for a specific company
     */
    getByCompanyId(companyId: string): Observable<Enrollment[]> {
        return this.http.get<Enrollment[]>(`${this.apiUrl}?companyId=${companyId}`);
    }

    /**
     * Get enrollments for a specific trainer
     * Used by: Trainer teams to see their assigned trainings
     */
    getByTrainerId(trainerId: string): Observable<Enrollment[]> {
        return this.http.get<Enrollment[]>(`${this.apiUrl}?trainerId=${trainerId}`);
    }

    /**
     * Update enrollment status
     * Used by: Admin - Enrollment & PO Owner (Team 2)
     */
    updateStatus(id: string, status: 'REQUESTED' | 'APPROVED' | 'ONGOING' | 'COMPLETED' | 'REJECTED'): Observable<Enrollment> {
        return this.http.patch<Enrollment>(`${this.apiUrl}/${id}`, { status });
    }

    /**
     * Automatically sync and update enrollment statuses based on POs and dates
     */
    syncStatuses(): Observable<any> {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        return forkJoin({
            enrollments: this.getAll(),
            pos: this.http.get<any[]>('http://localhost:3000/purchaseOrders')
        }).pipe(
            switchMap(({ enrollments, pos }) => {
                const updates: Observable<any>[] = [];

                enrollments.forEach(e => {
                    let newStatus = e.status;
                    const start = e.startDate ? new Date(e.startDate) : null;
                    const end = e.endDate ? new Date(e.endDate) : null;
                    if (start) start.setHours(0, 0, 0, 0);
                    if (end) end.setHours(0, 0, 0, 0);

                    if (e.status === 'REQUESTED') {
                        const trainerPO = pos.find(p => p.enrollmentId == e.id && p.type === 'TRAINER' && p.status === 'ACCEPTED');
                        if (trainerPO) {
                            newStatus = 'APPROVED';
                        }
                    }

                    // Once approved (or if already approved/ongoing), check dates
                    if (newStatus === 'APPROVED' && start && today >= start) {
                        newStatus = 'ONGOING';
                    }

                    if (newStatus === 'ONGOING' && end && today > end) {
                        newStatus = 'COMPLETED';
                    }

                    if (newStatus !== e.status) {
                        updates.push(this.updateStatus(e.id, newStatus));
                    }
                });

                if (updates.length === 0) return of([]);
                return forkJoin(updates);
            }),
            catchError(err => {
                console.error('Sync failed', err);
                return of([]);
            })
        );
    }
}
