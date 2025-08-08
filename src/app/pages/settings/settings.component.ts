import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { finalize } from 'rxjs/operators';
import { ProfileService, UserProfile, Organisation, ChangePasswordRequest } from '../../services/profile.service';
import { ConfirmDialogComponent } from '../../components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {
  selectedTabIndex = 0;
  isLoading = true;
  
  // Profile data
  user: UserProfile | null = null;
  organisation: Organisation | null = null;
  
  // Change password form
  changePasswordForm: FormGroup;
  isChangingPassword = false;
  showChangePasswordForm = false;
  
  constructor(
    private profileService: ProfileService,
    private snackBar: MatSnackBar,
    private fb: FormBuilder,
    private dialog: MatDialog
  ) { 
    this.initializeForms();
  }

  ngOnInit(): void {
    this.loadProfileData();
  }

  private initializeForms(): void {
    this.changePasswordForm = this.fb.group({
      oldPassword: ['', [Validators.required, Validators.minLength(6)]],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      repeatPassword: ['', [Validators.required]]
    }, { validator: this.passwordMatchValidator });
  }

  private passwordMatchValidator(g: FormGroup) {
    return g.get('newPassword')?.value === g.get('repeatPassword')?.value
      ? null : { mismatch: true };
  }

  onTabChanged(event: any): void {
    this.selectedTabIndex = event.index;
  }

  private loadProfileData(): void {
    this.isLoading = true;
    this.profileService.getProfile()
      .pipe(
        finalize(() => this.isLoading = false)
      )
      .subscribe({
        next: (response) => {
          if (response.status === 'SUCCESS') {
            this.user = response.data.user;
            this.organisation = response.data.organisation;
          } else {
            throw new Error(response.message || 'Failed to load profile data');
          }
        },
        error: (error) => {
          console.error('Error loading profile:', error);
          const errorMessage = error?.error?.message || error.message || 'Failed to load profile data';
          this.snackBar.open(errorMessage, 'Close', {
            duration: 5000,
            panelClass: ['error-snackbar']
          });
        }
      });
  }
  
  getIndustryDisplayName(industry: string): string {
    // Convert snake_case or UPPERCASE to Title Case
    return industry
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  }
  
  formatDate(dateString: string): string {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  toggleChangePasswordForm(): void {
    this.showChangePasswordForm = !this.showChangePasswordForm;
    if (this.showChangePasswordForm) {
      this.changePasswordForm.reset();
    }
  }

  onSubmitChangePassword(): void {
    if (this.changePasswordForm.invalid) {
      return;
    }

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        title: 'Confirm Password Change',
        message: 'Are you sure you want to change your password?',
        confirmText: 'Change Password',
        cancelText: 'Cancel'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.changePassword();
      }
    });
  }

  private changePassword(): void {
    if (this.changePasswordForm.invalid) {
      return;
    }

    this.isChangingPassword = true;
    const passwordData: ChangePasswordRequest = {
      oldPassword: this.changePasswordForm.get('oldPassword')?.value,
      newPassword: this.changePasswordForm.get('newPassword')?.value,
      repeatPassword: this.changePasswordForm.get('repeatPassword')?.value
    };

    this.profileService.changePassword(passwordData)
      .pipe(
        finalize(() => this.isChangingPassword = false)
      )
      .subscribe({
        next: (response) => {
          if (response.status === 'SUCCESS') {
            this.snackBar.open('Password changed successfully', 'Close', {
              duration: 5000,
              panelClass: ['success-snackbar']
            });
            this.showChangePasswordForm = false;
            this.changePasswordForm.reset();
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

  get changePasswordFormControls() {
    return this.changePasswordForm.controls;
  }
}
