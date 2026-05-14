import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import {
  QTBStore,
  CreateStoreRequest,
  StoreListResponse,
  StoreDetailResponse,
  OrganisationStore,
  OrganisationStoreListResponse,
  AssignStoreRequest
} from '../models/store.model';

@Injectable({
  providedIn: 'root'
})
export class StoreService {
  private readonly apiUrl = `${environment.apiBaseUrl}/stores`;

  constructor(private http: HttpClient) {}

  // ==================== QTB Store Management ====================

  /**
   * Get all QTB stores
   */
  getAllStores(): Observable<QTBStore[]> {
    return this.http.get<StoreListResponse>(this.apiUrl).pipe(
      map(response => response.data || [])
    );
  }

  /**
   * Get only active stores
   */
  getActiveStores(): Observable<QTBStore[]> {
    return this.http.get<StoreListResponse>(`${this.apiUrl}/active`).pipe(
      map(response => response.data || [])
    );
  }

  /**
   * Get store by ID
   */
  getStoreById(id: number): Observable<QTBStore> {
    return this.http.get<StoreDetailResponse>(`${this.apiUrl}/${id}`).pipe(
      map(response => response.data)
    );
  }

  /**
   * Create a new store
   */
  createStore(store: CreateStoreRequest): Observable<QTBStore> {
    return this.http.post<StoreDetailResponse>(this.apiUrl, store).pipe(
      map(response => response.data)
    );
  }

  /**
   * Update a store
   */
  updateStore(id: number, store: CreateStoreRequest): Observable<QTBStore> {
    return this.http.put<StoreDetailResponse>(`${this.apiUrl}/${id}`, store).pipe(
      map(response => response.data)
    );
  }

  /**
   * Delete a store
   */
  deleteStore(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  // ==================== Organisation-Store Assignment ====================

  /**
   * Get stores assigned to an organisation
   */
  getOrganisationStores(orgId: number): Observable<OrganisationStore[]> {
    return this.http.get<OrganisationStoreListResponse>(
      `${environment.apiBaseUrl}/organisations/${orgId}/stores`
    ).pipe(
      map(response => response.data || [])
    );
  }

  /**
   * Assign a store to an organisation
   */
  assignStoreToOrganisation(orgId: number, request: AssignStoreRequest): Observable<any> {
    return this.http.post(
      `${environment.apiBaseUrl}/organisations/${orgId}/stores`,
      request
    );
  }

  /**
   * Remove store from organisation
   */
  removeStoreFromOrganisation(orgId: number, storeId: number): Observable<any> {
    return this.http.delete(
      `${environment.apiBaseUrl}/organisations/${orgId}/stores/${storeId}`
    );
  }

  /**
   * Set store as default for organisation
   */
  setDefaultStore(orgId: number, storeId: number): Observable<any> {
    return this.http.put(
      `${environment.apiBaseUrl}/organisations/${orgId}/stores/${storeId}/default`,
      {}
    );
  }
}
