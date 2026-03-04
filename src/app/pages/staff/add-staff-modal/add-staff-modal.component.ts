import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { StaffIdType } from '../../../models/staff.model';
import { StaffService } from '../../../services/staff.service';

@Component({
  selector: 'app-add-staff-modal',
  templateUrl: './add-staff-modal.component.html'
})
export class AddStaffModalComponent {
  form: FormGroup;
  loading = false;
  submitted = false;
  error = '';

  idTypes: StaffIdType[] = ['NATIONAL_ID', 'PASSPORT', 'DRIVERS_LICENSE'];

  constructor(
    private fb: FormBuilder,
    public activeModal: NgbActiveModal,
    private staffService: StaffService
  ) {
    this.form = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', Validators.required],
      idNumber: ['', Validators.required],
      idType: ['NATIONAL_ID', Validators.required],
      organisationId: ['', Validators.required]
    });
  }

  get f() {
    return this.form.controls;
  }

  onSubmit(): void {
    this.submitted = true;
    this.error = '';

    if (this.form.invalid) {
      return;
    }

    this.loading = true;

    this.staffService.addStaff(this.form.value).subscribe({
      next: () => {
        this.loading = false;
        this.activeModal.close('saved');
      },
      error: (error) => {
        const backendMessage =
          error?.error?.error ||
          error?.error?.message ||
          error?.message;

        this.error = backendMessage || 'Failed to add staff. Please try again.';
        this.loading = false;
        console.error('Add staff error:', error);
      }
    });
  }
}

