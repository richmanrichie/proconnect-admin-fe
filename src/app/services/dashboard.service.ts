import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { OrgDashboardResponse } from '../models/org-dashboard.model';
import {
  DashboardApiResponse,
  SuperAdminSummary,
  SuperAdminOrderStats,
  SuperAdminLoanStats,
  SuperAdminPaymentStats,
  SuperAdminStaffStats,
  SuperAdminLenderStats,
  SuperAdminOrgStats,
  SuperAdminFinancials,
  SuperAdminRepayments,
  ChartPoint,
  LoanDistPoint,
  SuperAdminComparison
} from '../models/super-admin-dashboard.model';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private base = `${environment.apiBaseUrl}/dashboard`;

  constructor(private http: HttpClient) {}

  getOrgDashboard(): Observable<OrgDashboardResponse> {
    return this.http.get<OrgDashboardResponse>(`${this.base}/organisation`);
  }

  // ── Super Admin endpoints ──────────────────────────────────────────────────

  getSummary(): Observable<SuperAdminSummary> {
    return this.http.get<DashboardApiResponse<SuperAdminSummary>>(`${this.base}/summary`)
      .pipe(map(r => r.data));
  }

  getOrderStats(): Observable<SuperAdminOrderStats> {
    return this.http.get<DashboardApiResponse<SuperAdminOrderStats>>(`${this.base}/orders`)
      .pipe(map(r => r.data));
  }

  getLoanStats(): Observable<SuperAdminLoanStats> {
    return this.http.get<DashboardApiResponse<SuperAdminLoanStats>>(`${this.base}/loans`)
      .pipe(map(r => r.data));
  }

  getPaymentStats(): Observable<SuperAdminPaymentStats> {
    return this.http.get<DashboardApiResponse<SuperAdminPaymentStats>>(`${this.base}/payments`)
      .pipe(map(r => r.data));
  }

  getStaffStats(): Observable<SuperAdminStaffStats> {
    return this.http.get<DashboardApiResponse<SuperAdminStaffStats>>(`${this.base}/staff`)
      .pipe(map(r => r.data));
  }

  getLenderStats(): Observable<SuperAdminLenderStats> {
    return this.http.get<DashboardApiResponse<SuperAdminLenderStats>>(`${this.base}/lenders`)
      .pipe(map(r => r.data));
  }

  getOrgStats(): Observable<SuperAdminOrgStats> {
    return this.http.get<DashboardApiResponse<SuperAdminOrgStats>>(`${this.base}/organisations`)
      .pipe(map(r => r.data));
  }

  getFinancials(months = 12): Observable<SuperAdminFinancials> {
    return this.http.get<DashboardApiResponse<SuperAdminFinancials>>(`${this.base}/financials`, {
      params: { months: months.toString() }
    }).pipe(map(r => r.data));
  }

  getRepayments(): Observable<SuperAdminRepayments> {
    return this.http.get<DashboardApiResponse<SuperAdminRepayments>>(`${this.base}/repayments`)
      .pipe(map(r => r.data));
  }

  getOrderTrend(months = 6): Observable<ChartPoint[]> {
    return this.http.get<DashboardApiResponse<ChartPoint[]>>(`${this.base}/charts/orders`, {
      params: { months: months.toString() }
    }).pipe(map(r => r.data));
  }

  getLoanDistribution(): Observable<LoanDistPoint[]> {
    return this.http.get<DashboardApiResponse<LoanDistPoint[]>>(`${this.base}/charts/loan-distribution`)
      .pipe(map(r => r.data));
  }

  getComparison(): Observable<SuperAdminComparison> {
    return this.http.get<DashboardApiResponse<SuperAdminComparison>>(`${this.base}/charts/comparison`)
      .pipe(map(r => r.data));
  }
}
