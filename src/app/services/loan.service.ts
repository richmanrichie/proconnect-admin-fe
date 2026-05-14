import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Loan, LoanListResponse, LoanDetailResponse, ActiveLoan, ActiveLoanListResponse } from '../models/loan.model';

@Injectable({
  providedIn: 'root'
})
export class LoanService {
  private apiUrl = `${environment.apiBaseUrl}/loans`;

  constructor(private http: HttpClient) { }

  /**
   * Get list of approved loans
   */
  getApprovedLoans(): Observable<Loan[]> {
    return this.http.get<LoanListResponse>(`${this.apiUrl}/approved`).pipe(
      map(response => {
        const loans = response.data || [];
        // Add staffName to each loan
        return loans.map(loan => ({
          ...loan,
          staffName: loan.staff ? `${loan.staff.firstName} ${loan.staff.lastName}`.trim() : 'N/A'
        }));
      })
    );
  }

  /**
   * Get loan details by ID
   */
  getLoanDetails(loanId: number): Observable<Loan> {
    return this.http.get<LoanDetailResponse>(`${this.apiUrl}/${loanId}`).pipe(
      map(response => {
        if (!response.data) {
          throw new Error('Loan not found');
        }
        // Add staffName to the loan
        const loan = response.data;
        return {
          ...loan,
          staffName: loan.staff ? `${loan.staff.firstName} ${loan.staff.lastName}`.trim() : 'N/A'
        };
      })
    );
  }

  getActiveLoans(page: number, size: number): Observable<ActiveLoanListResponse> {
    return this.http.get<ActiveLoanListResponse>(`${this.apiUrl}/active`, {
      params: { page: page.toString(), size: size.toString() }
    });
  }

  /**
   * Process payment for a loan
   */
  processPayment(loanId: number, amount: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/${loanId}/pay`, { amount });
  }

  confirmOrderPayment(orderNumber: string, transactionRef: string): Observable<any> {
    return this.http.post(`${environment.apiBaseUrl}/orders/payment`, { orderNumber, transactionRef });
  }

  repayLoan(orderId: number, amount: number): Observable<any> {
    return this.http.post(`${environment.apiBaseUrl}/orders/${orderId}/repay`, { amount });
  }

  /**
   * Initiate payment for an order
   * Must be called before showing the payment UI
   */
  initiatePayment(orderNumber: number, shippingOptionId?: string): Observable<any> {
    const body = shippingOptionId ? { shippingOptionId } : {};
    return this.http.post(`${environment.apiBaseUrl}/orders/${orderNumber}/initiate-payment`, body);
  }
}

// Add this import at the top of the file if not already present
import { map } from 'rxjs/operators';import { environment } from 'src/environments/environment';

