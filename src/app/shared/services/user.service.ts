import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../models';
import { generateId } from '../utils/id-generator.util';

/**
 * USER SERVICE
 * 
 * Handles user authentication and account management.
 * Users are linked to trainers via trainerId field.
 * 
 * Example usage:
 * private userService = inject(UserService);
 * this.userService.create(userData).subscribe(user => {...});
 */
@Injectable({
    providedIn: 'root',
})
export class UserService {
    private http = inject(HttpClient);
    private apiUrl = 'http://localhost:3000/users';

    /**
     * Get all users
     */
    getAll(): Observable<User[]> {
        return this.http.get<User[]>(this.apiUrl);
    }

    /**
     * Get user by ID
     */
    getById(id: string): Observable<User> {
        return this.http.get<User>(`${this.apiUrl}/${id}`);
    }

    /**
     * Get user by email
     */
    getByEmail(email: string): Observable<User[]> {
        return this.http.get<User[]>(`${this.apiUrl}?email=${email}`);
    }

    /**
     * Get user by trainerId
     */
    getByTrainerId(trainerId: string): Observable<User[]> {
        return this.http.get<User[]>(`${this.apiUrl}?trainerId=${trainerId}`);
    }

    /**
     * Create new user
     */
    create(user: Partial<User>): Observable<User> {
        const newUser = { ...user, id: generateId() };
        return this.http.post<User>(this.apiUrl, newUser);
    }

    /**
     * Update existing user
     */
    update(id: string, user: Partial<User>): Observable<User> {
        return this.http.put<User>(`${this.apiUrl}/${id}`, user);
    }

    /**
     * Delete user
     */
    delete(id: string): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }
}
