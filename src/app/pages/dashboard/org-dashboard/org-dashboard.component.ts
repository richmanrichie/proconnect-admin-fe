import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DashboardService } from '../../../services/dashboard.service';
import { OrgDashboardData, StatByStatus } from '../../../models/org-dashboard.model';

@Component({
  selector: 'app-org-dashboard',
  templateUrl: './org-dashboard.component.html'
})
export class OrgDashboardComponent implements OnInit {
  data: OrgDashboardData | null = null;
  isLoading = true;
  error = '';

  constructor(
    private dashboardService: DashboardService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.dashboardService.getOrgDashboard().subscribe({
      next: (response) => {
        this.data = response.data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Failed to load dashboard:', err);
        this.error = 'Failed to load dashboard data.';
        this.isLoading = false;
      }
    });
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  }

  getOrderStatusClass(status: string): string {
    switch (status) {
      case 'APPROVED': return 'badge-success';
      case 'PENDING': return 'badge-warning';
      case 'ORDER_PROCESSING': return 'badge-info';
      case 'PAYMENT_INITIATED': return 'badge-primary';
      case 'DECLINED': return 'badge-danger';
      default: return 'badge-secondary';
    }
  }

  getLoanStatusClass(status: string): string {
    switch (status) {
      case 'ACTIVE': return 'badge-success';
      case 'APPROVED_BY_LENDER': return 'badge-info';
      case 'PENDING': return 'badge-warning';
      case 'PAID': return 'badge-primary';
      case 'DECLINED': return 'badge-danger';
      default: return 'badge-secondary';
    }
  }

  getStatusCount(statuses: StatByStatus[], key: string): number {
    return statuses.find(s => s.status === key)?.count || 0;
  }

  navigateTo(path: string): void {
    this.router.navigate([path]);
  }
}
