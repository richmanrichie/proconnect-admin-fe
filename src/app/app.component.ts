import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'argon-dashboard-angular';
  isAuthenticated = false;
  currentRoute = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    // Check authentication status on initialization
    this.isAuthenticated = this.authService.isAuthenticated();
    
    // Subscribe to route changes
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      this.currentRoute = event.url;
      this.isAuthenticated = this.authService.isAuthenticated();
    });
  }

  /**
   * Logout the current user
   */
  logout() {
    this.authService.logout();
    this.isAuthenticated = false;
  }

  /**
   * Check if the current route is the login page
   */
  isLoginPage(): boolean {
    return this.currentRoute === '/login';
  }
}
