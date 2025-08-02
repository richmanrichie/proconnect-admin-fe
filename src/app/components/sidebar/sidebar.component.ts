import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { AdminService } from '../../services/admin.service';
import { MenuItem } from '../../models/admin.model';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

export interface RouteInfo {
  path: string;
  title: string;
  icon: string;
  class: string;
  image?: string;
}

// Default routes in case API fails
export const DEFAULT_ROUTES: RouteInfo[] = [
  { path: '/dashboard', title: 'Dashboard', icon: 'ni-tv-2 text-primary', class: '' },
  { path: '/organizations', title: 'Organizations', icon: 'ni-building text-blue', class: '' },
  { path: '/user-profile', title: 'User Profile', icon: 'ni-single-02 text-yellow', class: '' }
];

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit, OnDestroy {
  public menuItems: RouteInfo[] = [];
  public isCollapsed = true;
  private destroy$ = new Subject<void>();

  constructor(
    private router: Router,
    private adminService: AdminService
  ) {}

  ngOnInit() {
    this.loadMenu();
    this.router.events.subscribe(() => {
      this.isCollapsed = true;
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadMenu() {
    // First set default menu items
    this.menuItems = [...DEFAULT_ROUTES];
    
    // Then try to load dynamic menu
    this.adminService.getMenu()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (menuItems) => {
          if (menuItems && menuItems.length > 0) {
            this.menuItems = menuItems.map(item => ({
              path: item.alt_route,
              title: item.label,
              icon: this.getIconClassFromPath(item.icon),
              class: '',
              image: item.icon
            }));
          }
        },
        error: (error) => {
          console.error('Failed to load menu:', error);
          // Keep default menu items if API fails
          this.menuItems = [...DEFAULT_ROUTES];
        }
      });
  }

  private getIconClassFromPath(iconPath: string): string {
    // Map icon paths to existing icon classes
    if (iconPath.includes('Home')) return 'ni-tv-2 text-primary';
    if (iconPath.includes('orders')) return 'ni-basket text-primary';
    if (iconPath.includes('loan')) return 'ni-money-coins ttext-primary';
    // Default icon if no match
    return 'ni-app text-primary';
  }
}
