import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-company-profile',
  templateUrl: './company-profile.component.html',
  styleUrls: ['./company-profile.component.scss']
})
export class CompanyProfileComponent implements OnInit {
  companyForm: FormGroup;
  isLoading = false;
  countries = ['Nigeria', 'Ghana', 'South Africa', 'Kenya'];
  states = ['Lagos', 'Abuja', 'Rivers', 'Ogun'];

  constructor(
    private fb: FormBuilder,
    private snackBar: MatSnackBar
  ) {
    this.companyForm = this.fb.group({
      companyName: ['', [Validators.required]],
      registrationNumber: [''],
      taxId: [''],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required]],
      address: [''],
      city: [''],
      state: [''],
      country: ['Nigeria'],
      postalCode: [''],
      website: ['', [Validators.pattern('https?://.+')]],
      description: ['', [Validators.maxLength(500)]]
    });
  }

  ngOnInit(): void {
    // TODO: Load company data from API
    this.loadCompanyData();
  }

  loadCompanyData(): void {
    // Simulate API call
    this.isLoading = true;
    setTimeout(() => {
      // Mock data - replace with actual API call
      this.companyForm.patchValue({
        companyName: 'Acme Inc.',
        registrationNumber: 'RC12345678',
        taxId: '123-45-6789',
        email: 'contact@acme.com',
        phone: '+2348012345678',
        address: '123 Business Street',
        city: 'Lagos',
        state: 'Lagos',
        country: 'Nigeria',
        postalCode: '100001',
        website: 'https://acme.com',
        description: 'A leading provider of innovative solutions'
      });
      this.isLoading = false;
    }, 1000);
  }

  onSubmit(): void {
    if (this.companyForm.invalid) {
      return;
    }

    this.isLoading = true;
    
    // TODO: Implement API call to update company profile
    setTimeout(() => {
      this.isLoading = false;
      this.snackBar.open('Company profile updated successfully', 'Close', {
        duration: 3000,
        panelClass: ['success-snackbar']
      });
    }, 1000);
  }

  getErrorMessage(controlName: string): string {
    const control = this.companyForm.get(controlName);
    
    if (control?.hasError('required')) {
      return 'This field is required';
    } else if (control?.hasError('email')) {
      return 'Please enter a valid email address';
    } else if (control?.hasError('pattern')) {
      return controlName === 'website' ? 'Please enter a valid URL (e.g., https://example.com)' : 'Invalid format';
    } else if (control?.hasError('maxlength')) {
      return 'Description is too long';
    }
    
    return '';
  }
}
