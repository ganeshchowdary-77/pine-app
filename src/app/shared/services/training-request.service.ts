import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TrainingRequest } from '../models';

/**
 * TRAINING REQUEST SERVICE
 * 
 * Used by: Admin - Client Request Owner (Team 1)
 * 
 * This service handles all TrainingRequest-related API calls.
 * Training requests are submitted by companies through the public landing page.
 * Admins review these requests and convert them into enrollments.
 * 
 * Status Flow:
 * NEW → CONTACTED → APPROVED (converts to Enrollment) / REJECTED
 * 
 * Example usage:
 * private requestService = inject(TrainingRequestService);
 * this.requestService.getAll().subscribe(requests => {...});
 */
@Injectable({
    providedIn: 'root',
})
export class TrainingRequestService {
    private http = inject(HttpClient);
    private apiUrl = 'http://localhost:3000/trainingRequests';

    /**
     * Get all training requests
     */
    getAll(): Observable<TrainingRequest[]> {
        return this.http.get<TrainingRequest[]>(this.apiUrl);
    }

    /**
     * Get training request by ID
     */
    getById(id: number): Observable<TrainingRequest> {
        return this.http.get<TrainingRequest>(`${this.apiUrl}/${id}`);
    }

    /**
     * Create new training request
     * Used by: Public landing page form
     */
    create(request: Partial<TrainingRequest>): Observable<TrainingRequest> {
        return this.http.post<TrainingRequest>(this.apiUrl, request);
    }

    /**
     * Update existing training request
     * Used by: Admin - Client Request Owner (Team 1)
     */
    update(id: number, request: Partial<TrainingRequest>): Observable<TrainingRequest> {
        return this.http.put<TrainingRequest>(`${this.apiUrl}/${id}`, request);
    }

    /**
     * Delete training request
     * Used by: Admin - Client Request Owner (Team 1)
     */
    delete(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }

    /**
     * Get training requests by status
     */
    getByStatus(status: 'NEW' | 'CONTACTED' | 'APPROVED' | 'REJECTED'): Observable<TrainingRequest[]> {
        return this.http.get<TrainingRequest[]>(`${this.apiUrl}?status=${status}`);
    }

    /**
     * Get new/pending training requests
     * Used by: Admin dashboard to show incoming requests
     */
    getNewRequests(): Observable<TrainingRequest[]> {
        return this.getByStatus('NEW');
    }

    /**
     * Update request status
     * Used by: Admin - Client Request Owner (Team 1)
     */
    updateStatus(id: number, status: 'NEW' | 'CONTACTED' | 'APPROVED' | 'REJECTED'): Observable<TrainingRequest> {
        return this.http.patch<TrainingRequest>(`${this.apiUrl}/${id}`, { status });
    }

    /**
     * Search training requests by technology
     */
    searchByTechnology(technology: string): Observable<TrainingRequest[]> {
        return this.http.get<TrainingRequest[]>(`${this.apiUrl}?technology_like=${technology}`);
    }

    /**
     * Search training requests by company name
     */
    searchByCompany(companyName: string): Observable<TrainingRequest[]> {
        return this.http.get<TrainingRequest[]>(`${this.apiUrl}?companyName_like=${companyName}`);
    }
}
