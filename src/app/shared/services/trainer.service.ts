import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Trainer } from '../models';
import { generateId } from '../utils/id-generator.util';

/**
 * TRAINER SERVICE
 * 
 * Used by: All teams (Admin and Trainer teams)
 * 
 * This service handles all Trainer-related API calls.
 * Admin teams use it to manage trainers.
 * Trainer teams use it to view their own profile.
 * 
 * Example usage:
 * private trainerService = inject(TrainerService);
 * this.trainerService.getAll().subscribe(trainers => {...});
 */
@Injectable({
    providedIn: 'root',
})
export class TrainerService {
    private http = inject(HttpClient);
    private apiUrl = 'http://localhost:3000/trainers';

    /**
     * Get all trainers
     */
    getAll(): Observable<Trainer[]> {
        return this.http.get<Trainer[]>(this.apiUrl);
    }

    /**
     * Get trainer by ID
     */
    getById(id: string): Observable<Trainer> {
        return this.http.get<Trainer>(`${this.apiUrl}/${id}`);
    }

    /**
     * Create new trainer
     */
    create(trainer: Partial<Trainer>): Observable<Trainer> {
        const newTrainer = { ...trainer, id: generateId() };
        return this.http.post<Trainer>(this.apiUrl, newTrainer);
    }

    /**
     * Update existing trainer
     */
    update(id: string, trainer: Partial<Trainer>): Observable<Trainer> {
        return this.http.put<Trainer>(`${this.apiUrl}/${id}`, trainer);
    }

    /**
     * Delete trainer
     */
    delete(id: string): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }

    /**
     * Search trainers by technology
     */
    searchByTechnology(technology: string): Observable<Trainer[]> {
        return this.http.get<Trainer[]>(`${this.apiUrl}?technologies_like=${technology}`);
    }

    /**
     * Get trainers by payment type
     */
    getByPaymentType(paymentType: 'hourly' | 'daily' | 'monthly'): Observable<Trainer[]> {
        return this.http.get<Trainer[]>(`${this.apiUrl}?paymentType=${paymentType}`);
    }
}
