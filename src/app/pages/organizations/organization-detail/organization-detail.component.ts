import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Organization, OrganizationResponse } from '../../../models/organization.model';
import { OrganizationService } from '../../../services/organization.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-organization-detail',
  templateUrl: './organization-detail.component.html'
})
export class OrganizationDetailComponent implements OnInit {
  organization: Organization | null = null;
  isLoading = true;
  error = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private organizationService: OrganizationService,
    private modalService: NgbModal
  ) {}

  ngOnInit(): void {
    this.loadOrganization();
  }

  loadOrganization(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.error = 'No organization ID provided';
      this.isLoading = false;
      return;
    }

    this.isLoading = true;
    this.organizationService.getOrganization(+id).subscribe({
      next: (response) => {
        this.organization = response.data as Organization;
        this.isLoading = false;
      },
      error: (error) => {
        this.error = 'Failed to load organization details. Please try again later.';
        this.isLoading = false;
        console.error('Error loading organization:', error);
      }
    });
  }

  onEdit(): void {
    if (this.organization) {
      this.router.navigate(['/organizations/edit', this.organization.id]);
    }
  }

  onBack(): void {
    this.router.navigate(['/organizations']);
  }
}
