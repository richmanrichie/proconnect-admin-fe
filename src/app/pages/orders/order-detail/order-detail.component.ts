import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { OrderService } from '../../../services/order.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Order } from 'src/app/models/order.model';

@Component({
  selector: 'app-order-detail',
  templateUrl: './order-detail.component.html',
  styleUrls: ['./order-detail.component.scss']
})
export class OrderDetailComponent implements OnInit {
  order: Order | null = null;
  isLoading = true;
  errorMessage = '';
  isProcessing = false;
  orderNumber: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private orderService: OrderService,
    private toastr: ToastrService,
    private modalService: NgbModal
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.orderNumber = params.get('id');
      if (this.orderNumber) {
        this.loadOrderDetails(Number(this.orderNumber));
      } else {
        this.errorMessage = 'Invalid order number';
        this.isLoading = false;
      }
    });
  }

  loadOrderDetails(orderNumber: number): void {
    this.isLoading = true;
    this.orderService.getOrderDetails(orderNumber).subscribe({
      next: (order) => {
        this.order = order;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading order details:', error);
        this.errorMessage = 'Failed to load order details. Please try again later.';
        this.isLoading = false;
      }
    });
  }

  approveOrder(): void {
    if (!this.order) return;
    
    this.isProcessing = true;
    this.orderService.approveOrder(this.order.id).subscribe({
      next: () => {
        this.toastr.success('Order approved successfully');
        if (this.order) {
          this.order.status = 'APPROVED';
        }
        this.isProcessing = false;
      },
      error: (error) => {
        console.error('Error approving order:', error);
        this.toastr.error('Failed to approve order. Please try again.');
        this.isProcessing = false;
      }
    });
  }

  rejectOrder(): void {
    if (!this.order) return;
    
    this.isProcessing = true;
    this.orderService.rejectOrder(this.order.id).subscribe({
      next: () => {
        this.toastr.success('Order rejected successfully');
        if (this.order) {
          this.order.status = 'REJECTED';
        }
        this.isProcessing = false;
      },
      error: (error) => {
        console.error('Error rejecting order:', error);
        this.toastr.error('Failed to reject order. Please try again.');
        this.isProcessing = false;
      }
    });
  }

  getStatusBadgeClass(status: string): string {
    switch (status) {
      case 'APPROVED':
        return 'badge-success';
      case 'REJECTED':
        return 'badge-danger';
      case 'PENDING':
        return 'badge-warning';
      default:
        return 'badge-info';
    }
  }

  backToList(): void {
    this.router.navigate(['/orders']);
  }
}
