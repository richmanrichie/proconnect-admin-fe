import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Organisation {
  id: number;
  name: string;
  organisationId: string;
  cacRegNumber: string;
  industry: string;
  address: string;
  taxId: string;
  logoUrl: string | null;
  isLender: boolean;
  emailDomain: string;
  staffCount: number;
  adminCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface UserProfile {
  id: number;
  name: string;
  email: string;
  isFirstLogin: boolean;
  role: string;
  organisation: Organisation | null;
}

export interface ChangePasswordRequest {
  oldPassword: string;
  newPassword: string;
  repeatPassword: string;
}

export interface ApiResponse<T = any> {
  status: string;
  data: T;
  message: string;
}

export interface ProfileResponse extends ApiResponse<{
  user: UserProfile;
  organisation: Organisation;
}> {}

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  private apiUrl = `${environment.apiBaseUrl}/profile`;
  private changePasswordUrl = `${environment.apiBaseUrl}/admins`;

  constructor(private http: HttpClient) {}

  getProfile(): Observable<ProfileResponse> {
    return this.http.get<ProfileResponse>(this.apiUrl);
  }

  changePassword(data: ChangePasswordRequest): Observable<ApiResponse> {
    return this.http.put<ApiResponse>(`${this.changePasswordUrl}/change-password`, data);
  }
}
