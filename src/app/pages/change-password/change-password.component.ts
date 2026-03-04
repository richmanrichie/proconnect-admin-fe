import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit {
  changePasswordForm: FormGroup;
  loading = false;
  submitted = false;
  error = '';

  private readonly API_URL = `${environment.apiBaseUrl}/admins/change-password`;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.changePasswordForm = this.fb.group(
      {
        oldPassword: ['', Validators.required],
        newPassword: ['', Validators.required],
        repeatPassword: ['', Validators.required]
      },
      { validators: this.passwordsMatchValidator }
    );
  }

  get f(): { [key: string]: AbstractControl } {
    return this.changePasswordForm.controls;
  }

  private passwordsMatchValidator(group: AbstractControl): { [key: string]: any } | null {
    const newPassword = group.get('newPassword')?.value;
    const repeatPassword = group.get('repeatPassword')?.value;
    if (newPassword && repeatPassword && newPassword !== repeatPassword) {
      return { passwordsMismatch: true };
    }
    return null;
  }

  onSubmit(): void {
    this.submitted = true;
    this.error = '';

    if (this.changePasswordForm.invalid) {
      return;
    }

    this.loading = true;

    const payload = {
      oldPassword: this.f['oldPassword'].value,
      newPassword: this.f['newPassword'].value,
      repeatPassword: this.f['repeatPassword'].value
    };

    this.http.put<{ token?: string; message?: string; error?: string }>(this.API_URL, payload).subscribe({
      next: (response) => {
        // If API returns a new token, store it
        if (response && response.token) {
          this.authService.setToken(response.token);
        }

        // First-login flow is now complete
        this.authService.clearFirstLoginFlag();

        // Redirect to dashboard (or next required step)
        this.router.navigate(['/dashboard']);
      },
      error: (error) => {
        const backendMessage =
          error?.error?.error ||
          error?.error?.message ||
          error?.message;

        this.error = backendMessage || 'Failed to change password. Please try again.';
        this.loading = false;
        // Stay on page; do not navigate away
        // console.error handled for debugging
        console.error('Change password error:', error);
      }
    });
  }
}

