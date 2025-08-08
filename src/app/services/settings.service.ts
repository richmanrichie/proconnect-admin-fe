import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Tenure {
  id?: number;
  minAmount: number;
  maxAmount: number;
  tenureMonths: number;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface ApiResponse<T> {
  status: string;
  data: T;
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class SettingsService {
  private readonly apiUrl = `${environment.apiBaseUrl}/lender`;

  constructor(private http: HttpClient) { }

  getTenures(): Observable<ApiResponse<Tenure[]>> {
    return this.http.get<ApiResponse<Tenure[]>>(`${this.apiUrl}/tenure`);
  }

  createTenure(tenure: Omit<Tenure, 'id' | 'createdAt' | 'updatedAt'>): Observable<ApiResponse<Tenure>> {
    return this.http.post<ApiResponse<Tenure>>(`${this.apiUrl}/tenure`, tenure);
  }

  updateTenureStatus(id: number, isActive: boolean): Observable<ApiResponse<Tenure>> {
    return this.http.patch<ApiResponse<Tenure>>(
      `${this.apiUrl}/tenure/${id}/status`,
      { isActive }
    );
  }

  deleteTenure(id: number): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.apiUrl}/tenure/${id}`);
  }
}
