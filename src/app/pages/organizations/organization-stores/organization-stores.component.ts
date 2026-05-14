import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { StoreService } from '../../../services/store.service';
import { QTBStore, OrganisationStore } from '../../../models/store.model';

@Component({
  selector: 'app-organization-stores',
  templateUrl: './organization-stores.component.html',
  styleUrls: ['./organization-stores.component.scss']
})
export class OrganizationStoresComponent implements OnInit, OnChanges {
  @Input() organizationId: number | undefined;

  assignedStores: OrganisationStore[] = [];
  availableStores: QTBStore[] = [];
  isLoading = false;
  isAssigning = false;
  error = '';
  successMessage = '';

  // For assign modal
  selectedStoreId: number | null = null;
  setAsDefault = false;

  // For actions
  storeToRemove: OrganisationStore | null = null;

  constructor(
    private storeService: StoreService,
    private modalService: NgbModal
  ) {}

  ngOnInit(): void {
    if (this.organizationId) {
      this.loadAssignedStores();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['organizationId'] && this.organizationId) {
      this.loadAssignedStores();
    }
  }

  loadAssignedStores(): void {
    if (!this.organizationId) return;

    this.isLoading = true;
    this.error = '';

    this.storeService.getOrganisationStores(this.organizationId).subscribe({
      next: (stores) => {
        this.assignedStores = stores;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading assigned stores:', err);
        this.error = 'Failed to load assigned stores.';
        this.isLoading = false;
      }
    });
  }

  openAssignModal(modal: any): void {
    this.selectedStoreId = null;
    this.setAsDefault = false;
    this.error = '';

    // Load available stores
    this.storeService.getActiveStores().subscribe({
      next: (stores) => {
        // Filter out already assigned stores
        const assignedIds = this.assignedStores.map(as => as.store.id);
        this.availableStores = stores.filter(s => !assignedIds.includes(s.id));
        this.modalService.open(modal, { centered: true });
      },
      error: (err) => {
        console.error('Error loading available stores:', err);
        this.error = 'Failed to load available stores.';
      }
    });
  }

  assignStore(modal: any): void {
    if (!this.organizationId || !this.selectedStoreId) return;

    this.isAssigning = true;
    this.error = '';

    this.storeService.assignStoreToOrganisation(this.organizationId, {
      storeId: this.selectedStoreId,
      isDefault: this.setAsDefault
    }).subscribe({
      next: () => {
        this.isAssigning = false;
        modal.close();
        this.successMessage = 'Store assigned successfully.';
        this.loadAssignedStores();
        setTimeout(() => this.successMessage = '', 3000);
      },
      error: (err) => {
        console.error('Error assigning store:', err);
        this.error = err?.error?.message || 'Failed to assign store.';
        this.isAssigning = false;
      }
    });
  }

  confirmRemove(store: OrganisationStore, modal: any): void {
    this.storeToRemove = store;
    this.modalService.open(modal, { centered: true });
  }

  removeStore(modal: any): void {
    if (!this.organizationId || !this.storeToRemove) return;

    this.storeService.removeStoreFromOrganisation(
      this.organizationId,
      this.storeToRemove.store.id
    ).subscribe({
      next: () => {
        modal.close();
        this.successMessage = 'Store removed successfully.';
        this.storeToRemove = null;
        this.loadAssignedStores();
        setTimeout(() => this.successMessage = '', 3000);
      },
      error: (err) => {
        console.error('Error removing store:', err);
        this.error = err?.error?.message || 'Failed to remove store.';
        modal.close();
      }
    });
  }

  setAsDefaultStore(store: OrganisationStore): void {
    if (!this.organizationId) return;

    this.storeService.setDefaultStore(this.organizationId, store.store.id).subscribe({
      next: () => {
        this.successMessage = `${store.store.name} set as default store.`;
        this.loadAssignedStores();
        setTimeout(() => this.successMessage = '', 3000);
      },
      error: (err) => {
        console.error('Error setting default store:', err);
        this.error = err?.error?.message || 'Failed to set default store.';
      }
    });
  }
}
