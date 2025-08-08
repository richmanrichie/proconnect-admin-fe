import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { finalize } from 'rxjs/operators';
import { ProfileService } from '../../../services/profile.service';

@Component({
  selector: 'app-security',
  templateUrl: './security.component.html',
  styleUrls: ['./security.component.scss']
})
export class SecurityComponent implements OnInit {
  passwordForm: FormGroup;
  isLoading = false;
  hideCurrentPassword = true;
  hideNewPassword = true;
  hideConfirmPassword = true;

  @ViewChild('confirmModal') confirmModal!: TemplateRef<any>;
  modalRef: any;

  constructor(
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private profileService: ProfileService,
    private modalService: NgbModal
  ) {
    this.passwordForm = this.fb.group({
      currentPassword: ['', [Validators.required, Validators.minLength(6)]],
      newPassword: ['', [Validators.required, Validators.minLength(6), Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$')]],
      confirmPassword: ['', Validators.required]
    }, { validator: this.passwordsMatchValidator });
  }

  ngOnInit(): void {}

  passwordsMatchValidator(form: FormGroup) {
    const newPassword = form.get('newPassword')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;
    
    if (newPassword !== confirmPassword) {
      form.get('confirmPassword')?.setErrors({ passwordsNotMatch: true });
    } else {
      form.get('confirmPassword')?.setErrors(null);
    }
  }

  onSubmit(): void {
    if (this.passwordForm.invalid) {
      return;
    }

    this.modalRef = this.modalService.open(this.confirmModal, { 
      centered: true,
      backdrop: 'static',
      keyboard: false,
      windowClass: 'security-modal',
      backdropClass: 'security-modal-backdrop',
      size: 'md'
    });
  }

  private changePassword(): void {
    if (this.passwordForm.invalid) {
      return;
    }

    this.isLoading = true;
    
    const passwordData = {
      oldPassword: this.passwordForm.get('currentPassword')?.value,
      newPassword: this.passwordForm.get('newPassword')?.value,
      repeatPassword: this.passwordForm.get('confirmPassword')?.value
    };

    this.profileService.changePassword(passwordData)
      .pipe(
        finalize(() => this.isLoading = false)
      )
      .subscribe({
        next: (response) => {
          if (response.status === 'SUCCESS') {
            this.snackBar.open('Password changed successfully', 'Close', {
              duration: 5000,
              panelClass: ['success-snackbar']
            });
            this.passwordForm.reset();
          } else {
            throw new Error(response.message || 'Failed to change password');
          }
        },
        error: (error) => {
          console.error('Error changing password:', error);
          const errorMessage = error?.error?.message || error.message || 'Failed to change password';
          this.snackBar.open(errorMessage, 'Close', {
            duration: 5000,
            panelClass: ['error-snackbar']
          });
        }
      });
  }

  getPasswordError(field: string): string {
    const control = this.passwordForm.get(field);
    
    if (control?.hasError('required')) {
      return 'This field is required';
    } else if (control?.hasError('minlength')) {
      return 'Password must be at least 8 characters long';
    } else if (control?.hasError('pattern')) {
      return 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character';
    } else if (control?.hasError('passwordsNotMatch')) {
      return 'Passwords do not match';
    }
    
    return '';
  }

  togglePasswordVisibility(field: 'currentPassword' | 'newPassword' | 'confirmPassword'): void {
    if (field === 'currentPassword') {
      this.hideCurrentPassword = !this.hideCurrentPassword;
    } else if (field === 'newPassword') {
      this.hideNewPassword = !this.hideNewPassword;
    } else if (field === 'confirmPassword') {
      this.hideConfirmPassword = !this.hideConfirmPassword;
    }
  }

  onConfirmChangePassword(): void {
    if (this.modalRef) {
      this.modalRef.close();
    }
    this.changePassword();
  }

  onCancelChangePassword(): void {
    if (this.modalRef) {
      this.modalRef.dismiss();
    }
  }
}
