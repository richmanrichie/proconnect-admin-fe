import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  // List of paths that don't require token
  private authRoutes = ['/auth', '/login', '/register'];

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    // Skip adding token for authentication routes
    if (this.isAuthRoute(request.url)) {
      return next.handle(request);
    }

    // Get the auth token from the service
    const authToken = this.authService.getToken();

    // Clone the request and add the authorization header
    const authReq = request.clone({
      setHeaders: {
        Authorization: `Bearer ${authToken}`,
        'Content-Type': 'application/json'
      }
    });

    // Send the request and handle errors
    return next.handle(authReq).pipe(
      catchError((error: HttpErrorResponse) => {
        // Handle 401 Unauthorized responses
        if (error.status === 401) {
          // Clear the token and redirect to login
          this.authService.logout();
          this.router.navigate(['/login'], {
            queryParams: { returnUrl: this.router.routerState.snapshot.url }
          });
        }
        return throwError(() => error);
      })
    );
  }

  // Check if the current request is for an authentication route
  private isAuthRoute(url: string): boolean {
    return this.authRoutes.some(route => url.includes(route));
  }
}
