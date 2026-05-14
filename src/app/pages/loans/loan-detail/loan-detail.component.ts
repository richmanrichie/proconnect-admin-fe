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
  @ViewChild('repaymentModal') repaymentModal: TemplateRef<any>;

  loan: Loan | null = null;
  isLoading = false;
  isProcessingPayment = false;
  isProcessingRepayment = false;
  errorMessage = '';
  activeTab = 'details';
  paymentSuccess = false;
  paymentResultMessage = '';
  repaymentAmount: number | null = null;
  repaymentResultMessage = '';
  repaymentSuccess = false;

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

    const orderNumber = this.loan.order?.orderNumber;
    if (!orderNumber) {
      this.toastr.error('Order information is missing for this loan.');
      return;
    }

    if (!this.loan.merchantCode || !this.loan.payableCode) {
      this.toastr.error('Payment configuration is missing for this loan.');
      return;
    }

    // Step 1: Call backend to initiate payment
    this.isProcessingPayment = true;
    this.loanService.initiatePayment(orderNumber).subscribe({
      next: (response) => {
        this.isProcessingPayment = false;

        if (!response?.data?.success && !response?.success) {
          this.toastr.error(response?.data?.message || 'Failed to initiate payment.');
          return;
        }

        const paymentData = response.data;

        // Step 2: Show Interswitch Payment UI with data from backend
        this.paymentService.initiatePayment({
          amount: paymentData.amount,
          reference: paymentData.paymentReference,
          merchantCode: this.loan!.merchantCode,
          payItemId: this.loan!.payableCode,
          customerEmail: paymentData.customerEmail,
          customerPhone: paymentData.customerPhone,
          customerName: paymentData.customerName,
          onComplete: (paymentResponse) => {
            console.log('Payment response:', paymentResponse);
            if (paymentResponse && paymentResponse.txnref) {
              this.isProcessingPayment = true;
              const transactionRef = paymentResponse.txnref;
              this.loanService.confirmOrderPayment(orderNumber.toString(), transactionRef).subscribe({
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
      },
      error: (error) => {
        this.isProcessingPayment = false;
        console.error('Failed to initiate payment:', error);
        this.toastr.error(error?.error?.message || 'Failed to initiate payment. Please try again.');
      }
    });
  }

  openRepaymentModal(): void {
    this.repaymentAmount = null;
    this.repaymentResultMessage = '';
    this.repaymentSuccess = false;
    this.modalService.open(this.repaymentModal, { centered: true, backdrop: 'static' });
  }

  makeRepayment(modal: any): void {
    if (!this.loan?.order?.orderNumber || !this.repaymentAmount || this.repaymentAmount <= 0) {
      this.toastr.error('Please enter a valid repayment amount.');
      return;
    }

    this.isProcessingRepayment = true;
    this.loanService.repayLoan(this.loan.order.orderNumber, this.repaymentAmount).subscribe({
      next: (res) => {
        this.isProcessingRepayment = false;
        this.repaymentSuccess = true;
        this.repaymentResultMessage = res.data?.message || 'Repayment processed successfully';
        modal.close();
        this.modalService.open(this.repaymentModal, { centered: true, backdrop: 'static' });
        this.loadLoanDetails();
      },
      error: (err) => {
        this.isProcessingRepayment = false;
        this.toastr.error(err?.error?.message || 'Repayment failed. Please try again.');
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/loans']);
  }

  getTotalInterest(): number {
    if (!this.loan?.schedules) return 0;
    return this.loan.schedules.reduce((sum, item) => sum + item.interest, 0);
  }

  getTotalRepayment(): number {
    if (!this.loan?.schedules) return 0;
    return this.loan.schedules.reduce((sum, item) => sum + item.totalPayment, 0);
  }

  getMonthlyPayment(): number {
    if (!this.loan?.schedules || this.loan.schedules.length === 0) return 0;
    return this.loan.schedules[0].totalPayment;
  }

  get sortedSchedules(): LoanSchedule[] {
    if (!this.loan?.schedules) return [];
    return [...this.loan.schedules].sort((a, b) =>
      new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
    );
  }

  getScheduleStatusBadgeClass(status: string): string {
    switch (status) {
      case 'PAID': return 'badge-success';
      case 'PARTLY_PAID': return 'badge-info';
      case 'NOT_PAID': return 'badge-danger';
      default: return 'badge-secondary';
    }
  }
}
