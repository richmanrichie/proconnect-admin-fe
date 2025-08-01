import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Organization, OrganizationResponse } from '../../../models/organization.model';
import { OrganizationService } from '../../../services/organization.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-organization-form',
  templateUrl: './organization-form.component.html',
  styles: []
})
export class OrganizationFormComponent implements OnInit {
  organizationForm: FormGroup;
  isEditMode = false;
  isLoading = false;
  error = '';
  organizationId: number | null = null;

  // Industry options
  industries = [
    'TECHNOLOGY',
    'HEALTHCARE',
    'FINANCE',
    'EDUCATION',
    'MANUFACTURING',
    'RETAIL',
    'CONSTRUCTION',
    'TRANSPORTATION',
    'ENERGY',
    'OTHER'
  ];

  constructor(
    private fb: FormBuilder,
    private organizationService: OrganizationService,
    private route: ActivatedRoute,
    private router: Router,
    private modalService: NgbModal
  ) {
    this.organizationForm = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(100)]],
      organisationId: ['', [Validators.required, Validators.maxLength(20)]],
      industry: ['', Validators.required],
      address: ['', Validators.maxLength(255)],
      cacRegNumber: ['', Validators.maxLength(50)],
      taxId: ['', Validators.maxLength(50)],
      emailDomain: ['', [Validators.maxLength(100), Validators.pattern('^[^@\s]+$')]],
      logoUrl: ['', Validators.maxLength(255)],
      primaryEmail: ['', [Validators.required, Validators.email, Validators.maxLength(100)]],
      secondEmail: ['', [Validators.email, Validators.maxLength(100)]],
      thirdEmail: ['', [Validators.email, Validators.maxLength(100)]],
      isLender: [false]
    });
  }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.isEditMode = true;
        this.organizationId = +id;
        this.loadOrganization(this.organizationId);
      }
    });
  }

  loadOrganization(id: number) {
    this.isLoading = true;
    this.organizationService.getOrganization(id).subscribe({
      next: (response) => {
        const org = response.data as Organization;
        this.organizationForm.patchValue(org);
        this.isLoading = false;
      },
      error: (error) => {
        this.error = 'Failed to load organization details.';
        this.isLoading = false;
        console.error('Error loading organization:', error);
      }
    });
  }

  onSubmit() {
    if (this.organizationForm.invalid) {
      return;
    }

    this.isLoading = true;
    const organizationData = this.organizationForm.value;

    const request = this.isEditMode && this.organizationId
      ? this.organizationService.updateOrganization(this.organizationId, organizationData)
      : this.organizationService.createOrganization(organizationData);

    request.subscribe({
      next: () => {
        this.router.navigate(['/organizations']);
      },
      error: (error) => {
        this.error = this.isEditMode 
          ? 'Failed to update organization. Please try again.' 
          : 'Failed to create organization. Please try again.';
        this.isLoading = false;
        console.error('Error saving organization:', error);
      }
    });
  }

  onCancel() {
    this.router.navigate(['/organizations']);
  }

  // Helper methods for form controls
  get f() { return this.organizationForm.controls; }

  // Email domain validation
  validateEmailDomain(control: any) {
    const domain = control.value;
    if (domain && domain.includes('@')) {
      return { invalidDomain: true };
    }
    return null;
  }
}
