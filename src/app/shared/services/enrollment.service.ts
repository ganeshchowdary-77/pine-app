import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Enrollment } from '../models';

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
    getById(id: number): Observable<Enrollment> {
        return this.http.get<Enrollment>(`${this.apiUrl}/${id}`);
    }

    /**
     * Create new enrollment
     * Used by: Admin - Enrollment & PO Owner (Team 2)
     */
    create(enrollment: Partial<Enrollment>): Observable<Enrollment> {
        return this.http.post<Enrollment>(this.apiUrl, enrollment);
    }

    /**
     * Update existing enrollment
     * Used by: Admin - Enrollment & PO Owner (Team 2)
     */
    update(id: number, enrollment: Partial<Enrollment>): Observable<Enrollment> {
        return this.http.put<Enrollment>(`${this.apiUrl}/${id}`, enrollment);
    }

    /**
     * Delete enrollment
     * Used by: Admin - Enrollment & PO Owner (Team 2)
     */
    delete(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }

    /**
     * Get enrollments by status
     */
    getByStatus(status: 'REQUESTED' | 'APPROVED' | 'ONGOING' | 'COMPLETED'): Observable<Enrollment[]> {
        return this.http.get<Enrollment[]>(`${this.apiUrl}?status=${status}`);
    }

    /**
     * Get enrollments for a specific company
     */
    getByCompanyId(companyId: number): Observable<Enrollment[]> {
        return this.http.get<Enrollment[]>(`${this.apiUrl}?companyId=${companyId}`);
    }

    /**
     * Get enrollments for a specific trainer
     * Used by: Trainer teams to see their assigned trainings
     */
    getByTrainerId(trainerId: number): Observable<Enrollment[]> {
        return this.http.get<Enrollment[]>(`${this.apiUrl}?trainerId=${trainerId}`);
    }

    /**
     * Update enrollment status
     * Used by: Admin - Enrollment & PO Owner (Team 2)
     */
    updateStatus(id: number, status: 'REQUESTED' | 'APPROVED' | 'ONGOING' | 'COMPLETED'): Observable<Enrollment> {
        return this.http.patch<Enrollment>(`${this.apiUrl}/${id}`, { status });
    }
}
