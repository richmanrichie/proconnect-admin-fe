import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Loan, ActiveLoan } from '../../../models/loan.model';
import { LoanService } from '../../../services/loan.service';
import { PaymentService } from '../../../services/payment.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-loan-list',
  templateUrl: './loan-list.component.html',
  styleUrls: ['./loan-list.component.scss']
})
export class LoanListComponent implements OnInit {
  activeTab = 'approved';

  // Approved loans
  loans: Loan[] = [];
  paginatedLoans: Loan[] = [];
  isLoading = false;
  errorMessage = '';
  page = 1;
  pageSize = 10;
  collectionSize = 0;

  // Active loans
  activeLoans: ActiveLoan[] = [];
  isLoadingActive = false;
  activeLoansError = '';
  activePage = 0; // 0-based for API
  activePageSize = 20;
  activeTotalElements = 0;
  activeLoansLoaded = false;

  constructor(
    private loanService: LoanService,
    private paymentService: PaymentService,
    private router: Router,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.loadLoans();
  }

  loadLoans(): void {
    this.isLoading = true;
    this.errorMessage = '';
    
    this.loanService.getApprovedLoans().subscribe({
      next: (loans: Loan[]) => {
        this.loans = loans;
        this.collectionSize = loans.length;
        this.updatePagination();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading loans:', error);
        this.errorMessage = 'Failed to load loans. Please try again later.';
        this.isLoading = false;
        this.toastr.error('Failed to load loans', 'Error');
      }
    });
  }

  onPageChange(): void {
    this.updatePagination();
  }

  onPageSizeChange(): void {
    this.page = 1; // Reset to first page when changing page size
    this.updatePagination();
  }

  private updatePagination(): void {
    const startIndex = (this.page - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    // Update the paginated loans array
    this.paginatedLoans = this.loans.slice(startIndex, endIndex);
  }

  viewLoanDetails(loanId: number): void {
    this.router.navigate(['/loans', loanId]);
  }

  switchTab(tab: string): void {
    this.activeTab = tab;
    if (tab === 'active' && !this.activeLoansLoaded) {
      this.loadActiveLoans();
    }
  }

  loadActiveLoans(): void {
    this.isLoadingActive = true;
    this.activeLoansError = '';
    this.loanService.getActiveLoans(this.activePage, this.activePageSize).subscribe({
      next: (response) => {
        const data = response.data;
        this.activeLoans = data.content;
        this.activeTotalElements = data.totalElements;
        this.activeLoansLoaded = true;
        this.isLoadingActive = false;
      },
      error: (error) => {
        console.error('Error loading active loans:', error);
        this.activeLoansError = 'Failed to load active loans. Please try again later.';
        this.isLoadingActive = false;
        this.toastr.error('Failed to load active loans', 'Error');
      }
    });
  }

  onActivePageChange(page: number): void {
    this.activePage = page - 1; // ngb-pagination is 1-based, API is 0-based
    this.loadActiveLoans();
  }

  onActivePageSizeChange(): void {
    this.activePage = 0;
    this.loadActiveLoans();
  }



  getStatusBadgeClass(status: string): string {
    switch (status) {
      case 'APPROVED_BY_LENDER':
        return 'badge-success';
      case 'PAID':
        return 'badge-info';
      case 'DECLINED':
        return 'badge-danger';
      default:
        return 'badge-secondary';
    }
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 2
    }).format(amount);
  }

  payLoan(loan: Loan, event: Event): void {
    if (event) {
      event.stopPropagation();
    }

    if (!loan.merchantCode || !loan.payableCode) {
      this.toastr.error('Payment configuration is missing for this loan.');
      return;
    }

    const paymentAmount = loan.amount;
    const customerEmail = loan.staff?.email || '';
    const customerPhone = loan.staff?.phoneNumber || '';
    const customerName = loan.staffName || 'Customer';

    this.paymentService.initiatePayment({
      amount: paymentAmount,
      reference: this.paymentService.generateReference(),
      merchantCode: loan.merchantCode,
      payItemId: loan.payableCode,
      customerEmail,
      customerPhone,
      customerName,
      onComplete: (response) => {
        console.log('Payment response:', response);
        if (response && response.txnref) {
          // Payment was successful
          this.toastr.success('Payment processed successfully!');
          // Refresh the loans list to show updated status
          this.loadLoans();
        } else {
          // Payment failed or was cancelled
          this.toastr.warning('Payment was not completed. Please try again.');
        }
      },
      onClose: () => {
        console.log('Payment window was closed');
      }
    }).catch(error => {
      console.error('Payment error:', error);
      this.toastr.error('Failed to initialize payment. Please try again.');
    });
  }
}
