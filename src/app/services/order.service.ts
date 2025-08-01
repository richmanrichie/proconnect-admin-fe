import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { Order, OrderListResponse, OrderDetailResponse } from '../models/order.model';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private apiUrl = `${environment.apiBaseUrl}/orders`;

  constructor(private http: HttpClient) {}

  /**
   * Get all orders
   */
  getOrders(): Observable<Order[]> {
    return this.http.get<OrderListResponse>(this.apiUrl).pipe(
      map(response => response.data || [])
    );
  }

  /**
   * Get order details by order number
   */
  getOrderDetails(orderNumber: number): Observable<Order> {
    return this.http.get<OrderDetailResponse>(`${this.apiUrl}/${orderNumber}`).pipe(
      map(response => {
        if (!response.data) {
          throw new Error('Order not found');
        }
        return response.data;
      })
    );
  }

  /**
   * Approve an order
   */
  approveOrder(orderId: number, notes: string = 'Loan approved by lender'): Observable<any> {
    return this.http.put(`${this.apiUrl}/${orderId}/approve`, { notes });
  }

  /**
   * Reject an order
   */
  rejectOrder(orderId: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/${orderId}/decline`, {});
  }
}
