import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { TrainingRequest } from '../models';
import { generateId } from '../utils/id-generator.util';
import { CompanyService } from './company.service';
import { Company } from '../models';

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
    private companyService = inject(CompanyService);
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
    getById(id: string): Observable<TrainingRequest> {
        return this.http.get<TrainingRequest>(`${this.apiUrl}/${id}`);
    }

    /**
     * Create new training request
     * Used by: Public landing page form
     */
    create(request: Partial<TrainingRequest>): Observable<TrainingRequest> {
        const newRequest = { ...request, id: generateId() };
        return this.http.post<TrainingRequest>(this.apiUrl, newRequest);
    }

    /**
     * Update existing training request
     * Used by: Admin - Client Request Owner (Team 1)
     */
    update(id: string, request: Partial<TrainingRequest>): Observable<TrainingRequest> {
        return this.http.put<TrainingRequest>(`${this.apiUrl}/${id}`, request);
    }

    /**
     * Delete training request
     * Used by: Admin - Client Request Owner (Team 1)
     */
    delete(id: string): Observable<void> {
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
    updateStatus(id: string, status: 'NEW' | 'CONTACTED' | 'APPROVED' | 'REJECTED'): Observable<TrainingRequest> {
        return this.http.patch<TrainingRequest>(`${this.apiUrl}/${id}`, { status }).pipe(
            switchMap(updatedRequest => {
                if (status === 'APPROVED') {
                    // Check if company already exists
                    return this.companyService.getAll().pipe(
                        switchMap(companies => {
                            const exists = companies.some(c =>
                                c.name.toLowerCase().trim() === updatedRequest.companyName.toLowerCase().trim()
                            );

                            if (!exists) {
                                const newCompany: Partial<Company> = {
                                    name: updatedRequest.companyName,
                                    email: updatedRequest.email,
                                    contactPerson: updatedRequest.contactPerson,
                                    phone: updatedRequest.phone
                                };
                                return this.companyService.create(newCompany).pipe(
                                    map(() => updatedRequest)
                                );
                            }
                            return of(updatedRequest);
                        })
                    );
                }
                return of(updatedRequest);
            })
        );
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
