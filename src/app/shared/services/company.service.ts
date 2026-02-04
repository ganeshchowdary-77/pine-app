import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Company } from '../models';

/**
 * COMPANY SERVICE
 * 
 * Used by: Admin - Enrollment & PO Owner (Team 2)
 * 
 * This service handles all Company (client) related API calls.
 * Teams can use this directly or extend it for custom functionality.
 * 
 * Example usage:
 * private companyService = inject(CompanyService);
 * this.companyService.getAll().subscribe(companies => {...});
 */
@Injectable({
    providedIn: 'root',
})
export class CompanyService {
    private http = inject(HttpClient);
    private apiUrl = 'http://localhost:3000/companies';

    /**
     * Get all companies
     */
    getAll(): Observable<Company[]> {
        return this.http.get<Company[]>(this.apiUrl);
    }

    /**
     * Get company by ID
     */
    getById(id: number | string): Observable<Company> {
        return this.http.get<Company>(`${this.apiUrl}/${id}`);
    }

    /**
     * Create new company
     */
    create(company: Partial<Company>): Observable<Company> {
        return this.http.post<Company>(this.apiUrl, company);
    }

    /**
     * Update existing company
     */
    update(id: number | string, company: Partial<Company>): Observable<Company> {
        return this.http.put<Company>(`${this.apiUrl}/${id}`, company);
    }

    /**
     * Delete company
     */
    delete(id: number | string): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }

    /**
     * Search companies by industry
     */
    searchByIndustry(industry: string): Observable<Company[]> {
        return this.http.get<Company[]>(`${this.apiUrl}?industry=${industry}`);
    }
}
