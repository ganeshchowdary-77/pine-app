import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, map, tap, catchError, of } from 'rxjs';
import { User } from '../shared/models';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private apiUrl = 'http://localhost:3000/users';

  // Signals for reactive state
  isAuthenticated = signal(false);
  currentUser = signal<User | null>(null);

  constructor() {
    // Check if user is already logged in on init
    this.loadUserFromStorage();
  }

  private loadUserFromStorage(): void {
    const userJson = localStorage.getItem('user');
    const token = localStorage.getItem('jwt_token');

    if (userJson && token) {
      try {
        const user = JSON.parse(userJson);
        this.currentUser.set(user);
        this.isAuthenticated.set(true);
      } catch {
        this.clearAuth();
      }
    }
  }

  login(email: string, password: string): Observable<User | null> {
    return this.http
      .get<User[]>(`${this.apiUrl}?email=${email}&password=${password}`)
      .pipe(
        map((users) => {
          if (users && users.length > 0) {
            return users[0];
          }
          return null;
        }),
        tap((user) => {
          if (user) {
            // Generate a mock JWT token (in real app, this comes from backend)
            const mockToken = this.generateMockJWT(user);
            this.setUser(user, mockToken);
          }
        }),
        catchError(() => {
          return of(null);
        })
      );
  }

  private generateMockJWT(user: User): string {
    // Mock JWT - in production, this comes from your backend
    const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
    const payload = btoa(
      JSON.stringify({
        sub: user.id,
        email: user.email,
        role: user.role,
        iat: Date.now(),
        exp: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
      })
    );
    const signature = btoa('mock-signature');
    return `${header}.${payload}.${signature}`;
  }

  setUser(user: User, token: string): void {
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('jwt_token', token);
    this.currentUser.set(user);
    this.isAuthenticated.set(true);
  }

  getUser(): User | null {
    return this.currentUser();
  }

  getToken(): string | null {
    return localStorage.getItem('jwt_token');
  }

  private clearAuth(): void {
    localStorage.removeItem('user');
    localStorage.removeItem('jwt_token');
    this.currentUser.set(null);
    this.isAuthenticated.set(false);
  }

  logout(): void {
    this.clearAuth();
    this.router.navigate(['/auth/login']);
  }

  isLoggedIn(): boolean {
    return this.isAuthenticated();
  }

  getUserRole(): 'admin' | 'trainer' | null {
    const user = this.getUser();
    return user?.role || null;
  }
}
