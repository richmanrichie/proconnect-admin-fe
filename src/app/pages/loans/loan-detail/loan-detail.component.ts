import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Loan, LoanSchedule } from '../../../models/loan.model';
import { LoanService } from '../../../services/loan.service';
import { PaymentService } from '../../../services/payment.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-loan-detail',
  templateUrl: './loan-detail.component.html',
  styleUrls: ['./loan-detail.component.scss']
})
export class LoanDetailComponent implements OnInit {
  loan: Loan | null = null;
  isLoading = false;
  errorMessage = '';
  activeTab = 'details';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private loanService: LoanService,
    private paymentService: PaymentService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.loadLoanDetails();
  }

  loadLoanDetails(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.router.navigate(['/loans']);
      return;
    }

    this.isLoading = true;
    this.loanService.getLoanDetails(+id).subscribe({
      next: (loan) => {
        this.loan = loan;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading loan details:', error);
        this.errorMessage = 'Failed to load loan details. Please try again later.';
        this.isLoading = false;
        this.toastr.error('Failed to load loan details', 'Error');
        this.router.navigate(['/loans']);
      }
    });
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 2
    }).format(amount);
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

  getTotalPayment(schedule: LoanSchedule): number {
    return schedule.principal + schedule.interest;
  }

  makePayment(): void {
    if (!this.loan) {
      this.toastr.error('Unable to process payment. Loan information is missing.');
      return;
    }

    const paymentAmount = this.loan.amount; // Or calculate the payment amount
    const reference = `LOAN-${this.loan.id}-${Date.now()}`;
    const customerEmail = this.loan.staff?.email || '';
    const customerName = this.loan.staffName || 'Customer';

    this.paymentService.initiatePayment({
      amount: paymentAmount,
      reference,
      customerEmail,
      customerName,
      onComplete: (response) => {
        console.log('Payment response:', response);
        if (response && response.txnref) {
          // Payment was successful
          this.toastr.success('Payment processed successfully!');
          // Optionally refresh loan details to show updated status
          this.loadLoanDetails();
        } else {
          // Payment failed or was cancelled
          this.toastr.error('Payment was not completed. Please try again.');
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

  goBack(): void {
    this.router.navigate(['/loans']);
  }
}
