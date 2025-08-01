import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { OrderService } from '../../../services/order.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Order } from 'src/app/models/order.model';

@Component({
  selector: 'app-order-list',
  templateUrl: './order-list.component.html',
  styleUrls: ['./order-list.component.scss']
})
export class OrderListComponent implements OnInit {
  orders: Order[] = [];
  isLoading = true;
  errorMessage = '';
  page = 1;
  pageSize = 10;
  collectionSize = 0;

  constructor(
    private orderService: OrderService,
    private router: Router,
    private modalService: NgbModal
  ) {}

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {
    this.isLoading = true;
    this.orderService.getOrders().subscribe({
      next: (orders) => {
        // Map the orders to include backward-compatible properties
        this.orders = orders.map(order => ({
          ...order,
          // For backward compatibility with the template
          itemsCount: order.items?.length || 0,
          imageUrl: order.items?.[0]?.imageUrl || 'assets/img/theme/no-image.png',
          orderName: order.items?.[0]?.productTitle || 'Order #' + order.orderNumber,
          staffName: order.staff ? `${order.staff.firstName} ${order.staff.lastName}` : 'N/A'
        }));
        this.collectionSize = this.orders.length;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading orders:', error);
        this.errorMessage = 'Failed to load orders. Please try again later.';
        this.isLoading = false;
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

  viewOrderDetails(orderNumber: number): void {
    this.router.navigate(['/orders', orderNumber]);
  }

  get paginatedOrders(): Order[] {
    return this.orders.slice(
      (this.page - 1) * this.pageSize,
      (this.page - 1) * this.pageSize + this.pageSize
    );
  }
}
