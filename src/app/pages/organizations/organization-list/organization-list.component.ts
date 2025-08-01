import { Component, OnInit } from '@angular/core';
declare var Math: any;
import { Router } from '@angular/router';
import { Organization, OrganizationResponse, PagedResponse } from '../../../models/organization.model';
import { OrganizationService } from '../../../services/organization.service';
import { NgbModal, NgbPaginationConfig } from '@ng-bootstrap/ng-bootstrap';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-organization-list',
  templateUrl: './organization-list.component.html',
  styles: []
})
export class OrganizationListComponent implements OnInit {
  organizations: Organization[] = [];
  isLoading = true;
  error = '';
  page = 0; // 0-based for API
  pageSize = 10;
  totalElements = 0;
  totalPages = 0;
  hasNext = false;
  hasPrevious = false;

  constructor(
    private organizationService: OrganizationService,
    private router: Router,
    private modalService: NgbModal,
    private paginationConfig: NgbPaginationConfig
  ) {
    // Customize default pagination values
    paginationConfig.size = 'sm';
    paginationConfig.boundaryLinks = true;
    paginationConfig.maxSize = 5;
    paginationConfig.rotate = true;
  }

  ngOnInit() {
    this.loadOrganizations();
  }

  loadOrganizations() {
    this.isLoading = true;
    this.organizationService.getOrganizations(this.page, this.pageSize)
      .pipe(
        finalize(() => this.isLoading = false)
      )
      .subscribe({
        next: (response) => {
          const pagedData = response.data as PagedResponse<Organization>;
          this.organizations = pagedData.content;
          this.page = pagedData.page;
          this.pageSize = pagedData.size;
          this.totalElements = pagedData.totalElements;
          this.totalPages = pagedData.totalPages;
          this.hasNext = pagedData.hasNext;
          this.hasPrevious = pagedData.hasPrevious;
        },
        error: (error) => {
          this.error = 'Failed to load organizations. Please try again later.';
          console.error('Error loading organizations:', error);
        }
      });
  }

  onCreate() {
    this.router.navigate(['/organizations/new']);
  }

  onView(organization: Organization) {
    this.router.navigate(['/organizations', organization.id]);
  }

  onEdit(organization: Organization) {
    this.router.navigate(['/organizations/edit', organization.id]);
  }

  onDelete(organization: Organization, deleteModal: any) {
    this.modalService.open(deleteModal, { centered: true }).result.then(
      (result) => {
        if (result === 'delete') {
          this.deleteOrganization(organization.id);
        }
      },
      () => {}
    );
  }

  private deleteOrganization(id: number) {
    this.organizationService.deleteOrganization(id).subscribe({
      next: () => {
        this.organizations = this.organizations.filter(org => org.id !== id);
      },
      error: (error) => {
        console.error('Error deleting organization:', error);
      }
    });
  }

  // Handle page change event
  onPageChange(page: number) {
    // Convert from 1-based to 0-based for API
    this.page = page - 1;
    // this.loadOrganizations();
  }

  // Update page size and reset to first page
  onPageSizeChange() {
    this.page = 0; // Reset to first page when changing page size
    // this.loadOrganizations();
  }
}
