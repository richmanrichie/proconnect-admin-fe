import { Component, OnInit, AfterViewChecked } from '@angular/core';
import { forkJoin } from 'rxjs';
import Chart from 'chart.js';
import { DashboardService } from '../../../services/dashboard.service';
import { SuperAdminDashboardData } from '../../../models/super-admin-dashboard.model';

@Component({
  selector: 'app-super-admin-dashboard',
  templateUrl: './super-admin-dashboard.component.html'
})
export class SuperAdminDashboardComponent implements OnInit, AfterViewChecked {
  data: SuperAdminDashboardData | null = null;
  isLoading = true;
  error = '';

  private chartsInitialized = false;

  constructor(private dashboardService: DashboardService) {}

  ngOnInit(): void {
    forkJoin({
      summary:          this.dashboardService.getSummary(),
      orders:           this.dashboardService.getOrderStats(),
      loans:            this.dashboardService.getLoanStats(),
      payments:         this.dashboardService.getPaymentStats(),
      staff:            this.dashboardService.getStaffStats(),
      lenders:          this.dashboardService.getLenderStats(),
      orgs:             this.dashboardService.getOrgStats(),
      financials:       this.dashboardService.getFinancials(),
      repayments:       this.dashboardService.getRepayments(),
      orderTrend:       this.dashboardService.getOrderTrend(),
      loanDistribution: this.dashboardService.getLoanDistribution(),
      comparison:       this.dashboardService.getComparison()
    }).subscribe({
      next: (results) => {
        this.data = results;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Failed to load super admin dashboard:', err);
        this.error = 'Failed to load dashboard data.';
        this.isLoading = false;
      }
    });
  }

  ngAfterViewChecked(): void {
    if (this.data && !this.chartsInitialized) {
      const orderCanvas  = document.getElementById('sa-chart-orders');
      const loanCanvas   = document.getElementById('sa-chart-loans');
      if (orderCanvas && loanCanvas) {
        this.chartsInitialized = true;
        this.initCharts();
      }
    }
  }

  private initCharts(): void {
    // Order trend – line chart
    const orderCtx = document.getElementById('sa-chart-orders') as HTMLCanvasElement;
    new Chart(orderCtx, {
      type: 'line',
      data: {
        labels: this.data.orderTrend.map(p => p.label),
        datasets: [{
          label: 'Order Value (₦)',
          data: this.data.orderTrend.map(p => p.value),
          borderColor: '#5e72e4',
          backgroundColor: 'rgba(94,114,228,0.1)',
          borderWidth: 2,
          pointRadius: 4,
          fill: true
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        legend: { display: false },
        scales: {
          yAxes: [{ ticks: { callback: (v: number) => '₦' + (v / 1000000).toFixed(1) + 'M' } }]
        },
        tooltips: {
          callbacks: {
            label: (item: any) => '₦' + Number(item.yLabel).toLocaleString()
          }
        }
      }
    });

    // Loan distribution – doughnut chart
    const loanCtx = document.getElementById('sa-chart-loans') as HTMLCanvasElement;
    new Chart(loanCtx, {
      type: 'doughnut',
      data: {
        labels: this.data.loanDistribution.map(p => p.label),
        datasets: [{
          data: this.data.loanDistribution.map(p => p.value),
          backgroundColor: this.data.loanDistribution.map(p => p.color),
          borderWidth: 2
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        legend: { position: 'right' },
        tooltips: {
          callbacks: {
            label: (item: any, chartData: any) => {
              const label = chartData.labels[item.index];
              const val   = chartData.datasets[0].data[item.index];
              return ` ${label}: ${val}%`;
            }
          }
        }
      }
    });
  }

  formatCurrency(amount: number): string {
    if (amount >= 1_000_000) {
      return '₦' + (amount / 1_000_000).toFixed(1) + 'M';
    }
    if (amount >= 1_000) {
      return '₦' + (amount / 1_000).toFixed(1) + 'K';
    }
    return new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', minimumFractionDigits: 0 }).format(amount);
  }

  formatCurrencyFull(amount: number): string {
    return new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', minimumFractionDigits: 0 }).format(amount);
  }

  growthClass(val: number): string {
    return val >= 0 ? 'text-success' : 'text-danger';
  }

  growthIcon(val: number): string {
    return val >= 0 ? 'fa fa-arrow-up' : 'fa fa-arrow-down';
  }

  getOrderStatusClass(status: string): string {
    switch (status) {
      case 'DELIVERED':          return 'badge-success';
      case 'APPROVED':           return 'badge-info';
      case 'ORDER_PROCESSING':   return 'badge-primary';
      case 'PENDING':            return 'badge-warning';
      case 'PAYMENT_INITIATED':  return 'badge-info';
      case 'CANCELLED':          return 'badge-danger';
      default:                   return 'badge-secondary';
    }
  }

  getLoanStatusClass(status: string): string {
    switch (status) {
      case 'ACTIVE':             return 'badge-success';
      case 'COMPLETED':          return 'badge-primary';
      case 'APPROVED_BY_LENDER': return 'badge-info';
      case 'DISBURSED':          return 'badge-info';
      case 'PENDING':            return 'badge-warning';
      case 'DEFAULTED':          return 'badge-danger';
      case 'REJECTED':           return 'badge-danger';
      default:                   return 'badge-secondary';
    }
  }
}
