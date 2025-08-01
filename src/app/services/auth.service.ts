import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly SESSION_KEY = 'auth_token';

  private readonly API_URL = `${environment.apiBaseUrl}/admins`;

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  // Check if user is authenticated
  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  // Save session token
  setToken(token: string): void {
    sessionStorage.setItem(this.SESSION_KEY, token);
  }

  // Get session token
  getToken(): string | null {
    return sessionStorage.getItem(this.SESSION_KEY);
  }

  // Remove token and redirect to login
  logout(): void {
    sessionStorage.removeItem(this.SESSION_KEY);
    this.router.navigate(['/login']);
  }

  /**
   * Login user with email and password
   * @param credentials User credentials (email and password)
   * @returns Observable with login result
   */
  login(credentials: {email: string, password: string}): Observable<boolean> {
    return this.http.post<{message: string, token: string, isFirstLogin: boolean}>
      (`${this.API_URL}/login`, credentials)
      .pipe(
        tap(response => {
          if (response && response.token) {
            this.setToken(response.token);
          }
        }),
        map(response => !!response.token),
        catchError(error => {
          console.error('Login error:', error);
          return of(false);
        })
      );
  }
}
