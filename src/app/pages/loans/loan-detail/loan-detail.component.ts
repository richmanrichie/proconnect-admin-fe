import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Loan, LoanSchedule } from '../../../models/loan.model';
import { LoanService } from '../../../services/loan.service';
import { PaymentService } from '../../../services/payment.service';
import { ToastrService } from 'ngx-toastr';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-loan-detail',
  templateUrl: './loan-detail.component.html',
  styleUrls: ['./loan-detail.component.scss']
})
export class LoanDetailComponent implements OnInit {
  @ViewChild('paymentResultModal') paymentResultModal: TemplateRef<any>;

  loan: Loan | null = null;
  isLoading = false;
  isProcessingPayment = false;
  errorMessage = '';
  activeTab = 'details';
  paymentSuccess = false;
  paymentResultMessage = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private loanService: LoanService,
    private paymentService: PaymentService,
    private toastr: ToastrService,
    private modalService: NgbModal
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

    console.log('[makePayment] merchantCode:', this.loan.merchantCode, '| payableCode:', this.loan.payableCode);

    if (!this.loan.merchantCode || !this.loan.payableCode) {
      this.toastr.error('Payment configuration is missing for this loan.');
      return;
    }

    const paymentAmount = this.loan.amount;
    const reference = this.loan.order?.externalOrderNumber || `${this.loan.order?.orderNumber || this.loan.id}-${Date.now()}`;
    const customerEmail = this.loan.staff?.email || '';
    const customerName = this.loan.staffName || 'Customer';
    const payItemName = this.loan.order?.items?.[0]?.productTitle || 'Loan Repayment';

    this.paymentService.initiatePayment({
      amount: paymentAmount,
      reference,
      merchantCode: this.loan.merchantCode,
      payItemId: this.loan.payableCode,
      payItemName,
      customerEmail,
      customerName,
      onComplete: (response) => {
        console.log('Payment response:', response);
        if (response && response.txnref) {
          this.isProcessingPayment = true;
          const orderNumber = this.loan.order?.orderNumber?.toString() || '';
          const transactionRef = response.txnref;
          this.loanService.confirmOrderPayment(orderNumber, transactionRef).subscribe({
            next: (res) => {
              this.isProcessingPayment = false;
              this.paymentSuccess = true;
              this.paymentResultMessage = res.message || 'Payment confirmed successfully';
              this.modalService.open(this.paymentResultModal, { centered: true, backdrop: 'static' });
              this.loadLoanDetails();
            },
            error: (err) => {
              this.isProcessingPayment = false;
              this.paymentSuccess = false;
              this.paymentResultMessage = err?.error?.message || 'Payment was received but confirmation failed. Please contact support.';
              this.modalService.open(this.paymentResultModal, { centered: true, backdrop: 'static' });
            }
          });
        } else {
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
