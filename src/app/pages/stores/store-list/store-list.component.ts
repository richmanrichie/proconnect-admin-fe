import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { StoreService } from '../../../services/store.service';
import { QTBStore } from '../../../models/store.model';

@Component({
  selector: 'app-store-list',
  templateUrl: './store-list.component.html',
  styleUrls: ['./store-list.component.scss']
})
export class StoreListComponent implements OnInit {
  stores: QTBStore[] = [];
  filteredStores: QTBStore[] = [];
  isLoading = false;
  error = '';
  searchTerm = '';
  statusFilter = '';
  storeToDelete: QTBStore | null = null;

  constructor(
    private storeService: StoreService,
    private router: Router,
    private modalService: NgbModal
  ) {}

  ngOnInit(): void {
    this.loadStores();
  }

  loadStores(): void {
    this.isLoading = true;
    this.error = '';

    this.storeService.getAllStores().subscribe({
      next: (stores) => {
        this.stores = stores;
        this.applyFilters();
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading stores:', err);
        this.error = 'Failed to load stores. Please try again.';
        this.isLoading = false;
      }
    });
  }

  applyFilters(): void {
    let result = [...this.stores];

    // Search filter
    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      result = result.filter(store =>
        store.name.toLowerCase().includes(term) ||
        store.qtbId.toLowerCase().includes(term) ||
        store.email.toLowerCase().includes(term) ||
        store.city.toLowerCase().includes(term)
      );
    }

    // Status filter
    if (this.statusFilter) {
      const isActive = this.statusFilter === 'ACTIVE';
      result = result.filter(store => store.isActive === isActive);
    }

    this.filteredStores = result;
  }

  onSearchChange(): void {
    this.applyFilters();
  }

  onStatusFilterChange(): void {
    this.applyFilters();
  }

  createStore(): void {
    this.router.navigate(['/stores/new']);
  }

  editStore(store: QTBStore): void {
    this.router.navigate(['/stores/edit', store.id]);
  }

  confirmDelete(store: QTBStore, modal: any): void {
    this.storeToDelete = store;
    this.modalService.open(modal, { centered: true });
  }

  deleteStore(modal: any): void {
    if (!this.storeToDelete) return;

    this.storeService.deleteStore(this.storeToDelete.id).subscribe({
      next: () => {
        this.loadStores();
        modal.close();
        this.storeToDelete = null;
      },
      error: (err) => {
        console.error('Error deleting store:', err);
        this.error = err?.error?.message || 'Failed to delete store.';
        modal.close();
      }
    });
  }

  getStatusBadgeClass(isActive: boolean): string {
    return isActive ? 'badge-success' : 'badge-secondary';
  }
}
