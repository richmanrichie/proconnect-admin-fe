import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Staff, StaffResponse, StaffStatus } from '../models/staff.model';

@Injectable({
  providedIn: 'root'
})
export class StaffService {
  private readonly apiUrl = `${environment.apiBaseUrl}/staff`;

  constructor(private http: HttpClient) {}

  getStaff(filter?: { search?: string; status?: StaffStatus }): Observable<StaffResponse> {
    let params = new HttpParams();

    if (filter?.search) {
      params = params.set('search', filter.search);
    }
    if (filter?.status) {
      params = params.set('status', filter.status);
    }

    return this.http.get<StaffResponse>(this.apiUrl, { params });
  }

  getStaffById(id: number): Observable<StaffResponse> {
    return this.http.get<StaffResponse>(`${this.apiUrl}/${id}`);
  }

  addStaff(payload: Omit<Staff, 'id' | 'status' | 'address' | 'kycFolder'>): Observable<StaffResponse> {
    return this.http.post<StaffResponse>(this.apiUrl, payload);
  }

  bulkUpload(file: File): Observable<StaffResponse> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<StaffResponse>(`${this.apiUrl}/bulk-upload`, formData);
  }

  updateStaffStatus(id: number, status: StaffStatus): Observable<StaffResponse> {
    return this.http.put<StaffResponse>(`${this.apiUrl}/${id}/status`, { status });
  }
}

