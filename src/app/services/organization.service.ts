import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Organization, OrganizationResponse } from '../models/organization.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OrganizationService {
  private apiUrl = `${environment.apiBaseUrl}/organisations`;

  constructor(private http: HttpClient) {}

  /**
   * Get paginated list of organizations
   * @param page Page number (0-based)
   * @param size Number of items per page
   */
  getOrganizations(page: number = 0, size: number = 10): Observable<OrganizationResponse> {
    const params = {
      page: page.toString(),
      size: size.toString()
    };
    return this.http.get<OrganizationResponse>(`${this.apiUrl}/paged`, { params });
  }

  /**
   * Get organization by ID
   */
  getOrganization(id: number): Observable<OrganizationResponse> {
    return this.http.get<OrganizationResponse>(`${this.apiUrl}/${id}`).pipe(
      map(response => ({
        ...response,
        data: response.data as Organization // Ensure proper typing
      }))
    );
  }

  /**
   * Create a new organization
   */
  createOrganization(organization: Partial<Organization>): Observable<OrganizationResponse> {
    return this.http.post<OrganizationResponse>(this.apiUrl, organization);
  }

  /**
   * Update an existing organization
   */
  updateOrganization(id: number, organization: Partial<Organization>): Observable<OrganizationResponse> {
    return this.http.put<OrganizationResponse>(`${this.apiUrl}/${id}`, organization);
  }

  /**
   * Delete an organization
   */
  deleteOrganization(id: number): Observable<OrganizationResponse> {
    return this.http.delete<OrganizationResponse>(`${this.apiUrl}/${id}`);
  }
}
