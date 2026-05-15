import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html'
})
export class ForgotPasswordComponent {
  step: 1 | 2 = 1;

  // Step 1
  emailForm: FormGroup;
  emailLoading = false;
  emailError = '';
  emailSubmitted = false;

  // Step 2
  resetForm: FormGroup;
  resetLoading = false;
  resetError = '';
  resetSubmitted = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.emailForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });

    this.resetForm = this.fb.group({
      otp: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(6)]],
      newPassword: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', Validators.required]
    }, { validators: this.passwordMatchValidator });
  }

  private passwordMatchValidator(group: FormGroup) {
    const pw  = group.get('newPassword')?.value;
    const cpw = group.get('confirmPassword')?.value;
    return pw === cpw ? null : { mismatch: true };
  }

  get ef() { return this.emailForm.controls; }
  get rf() { return this.resetForm.controls; }

  requestOtp(): void {
    this.emailSubmitted = true;
    if (this.emailForm.invalid) return;

    this.emailLoading = true;
    this.emailError = '';
    this.authService.forgotPassword(this.ef['email'].value).subscribe({
      next: () => {
        this.emailLoading = false;
        this.step = 2;
      },
      error: (err) => {
        this.emailLoading = false;
        this.emailError = err?.error?.message || 'Failed to send OTP. Please try again.';
      }
    });
  }

  resetPassword(): void {
    this.resetSubmitted = true;
    if (this.resetForm.invalid) return;

    this.resetLoading = true;
    this.resetError = '';
    this.authService.resetPassword(
      this.ef['email'].value,
      this.rf['otp'].value,
      this.rf['newPassword'].value
    ).subscribe({
      next: () => {
        this.resetLoading = false;
        this.router.navigate(['/login'], { queryParams: { passwordReset: 'true' } });
      },
      error: (err) => {
        this.resetLoading = false;
        this.resetError = err?.error?.message || 'Failed to reset password. Please try again.';
      }
    });
  }
}
