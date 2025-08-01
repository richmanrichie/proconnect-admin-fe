import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Loan, LoanListResponse, LoanDetailResponse } from '../models/loan.model';

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

  /**
   * Process payment for a loan
   */
  processPayment(loanId: number, amount: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/${loanId}/pay`, { amount });
  }
}

// Add this import at the top of the file if not already present
import { map } from 'rxjs/operators';import { environment } from 'src/environments/environment';

