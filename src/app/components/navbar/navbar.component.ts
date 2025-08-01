import { Component, OnInit, ElementRef, OnDestroy } from '@angular/core';
import { DEFAULT_ROUTES } from '../sidebar/sidebar.component';
import { Location, LocationStrategy, PathLocationStrategy } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { AdminService } from '../../services/admin.service';
import { User } from '../../models/admin.model';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit, OnDestroy {
  public focus;
  public listTitles: any[];
  public location: Location;
  public user: User | null = null;
  private destroy$ = new Subject<void>();
  constructor(
    location: Location,
    private element: ElementRef,
    private router: Router,
    private authService: AuthService,
    private adminService: AdminService
  ) {
    this.location = location;
  }

  ngOnInit() {
    // Use default routes for now, they'll be updated when the menu loads
    this.listTitles = [...DEFAULT_ROUTES];
    this.loadUserData();
    
    // Subscribe to menu changes from the sidebar
    this.adminService.getMenu()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (menuItems) => {
          if (menuItems && menuItems.length > 0) {
            this.listTitles = menuItems.map(item => ({
              path: item.alt_route,
              title: item.label,
              icon: '',
              class: ''
            }));
          }
        },
        error: (error) => {
          console.error('Failed to load menu in navbar:', error);
          // Keep default menu items if API fails
          this.listTitles = [...DEFAULT_ROUTES];
        }
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadUserData() {
    this.adminService.getUser()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (user) => {
          this.user = user;
        },
        error: (error) => {
          console.error('Failed to load user data:', error);
        }
      });
  }
  getTitle(){
    var titlee = this.location.prepareExternalUrl(this.location.path());
    if(titlee.charAt(0) === '#'){
        titlee = titlee.slice( 1 );
    }

    for(var item = 0; item < this.listTitles.length; item++){
        if(this.listTitles[item].path === titlee){
            return this.listTitles[item].title;
        }
    }
    return 'Dashboard';
  }

  /**
   * Logout the current user
   */
  logout() {
    this.authService.logout();
  }

}
