import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { SettingsService, Tenure, ApiResponse } from '../../../services/settings.service';
import { finalize } from 'rxjs/operators';
import { ConfirmDialogComponent } from '../../../components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-loan-settings',
  templateUrl: './loan-settings.component.html',
  styleUrls: ['./loan-settings.component.scss']
})
export class LoanSettingsComponent implements OnInit, AfterViewInit {
  // Forms
  interestRateForm: FormGroup;
  tenureForm: FormGroup;
  
  // Loading states
  isLoading = false;
  isSubmitting = false;
  isUpdatingStatus: number | null = null;

  // Edit mode
  isEditMode = false;
  editingTenureId: number | null = null;
  
  // Table data
  dataSource: MatTableDataSource<Tenure>;
  displayedColumns: string[] = ['tenureMonths', 'minAmount', 'maxAmount', 'actions'];
  
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;


  currentInterestRate: number | null = null;

  constructor(
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private settingsService: SettingsService
  ) {
    this.initializeForms();
  }

  ngOnInit(): void {
    this.loadFixedInterestRate();
    this.loadLoanSettings();
  }

  ngAfterViewInit(): void {
    if (this.dataSource) {
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }
  }

  private loadFixedInterestRate(): void {
    this.settingsService.getFixedInterestRate().subscribe({
      next: (response) => {
        if (response.status === 'SUCCESS') {
          this.interestRateForm.patchValue({ rate: response.data.interestRate });
        }
      },
      error: (error) => {
        console.error('Error loading interest rate:', error);
      }
    });
  }

  private initializeForms(): void {
    this.interestRateForm = this.fb.group({
      rate: [null, [Validators.required, Validators.min(0.1), Validators.max(100)]]
    });

    this.tenureForm = this.fb.group({
      tenureMonths: ['', [Validators.required, Validators.min(1), Validators.max(360)]],
      minAmount: ['', [Validators.required, Validators.min(0)]],
      maxAmount: ['', [Validators.required, Validators.min(0)]]
    });
  }

  loadLoanSettings(): void {
    this.isLoading = true;

    this.settingsService.getTenures()
      .pipe(
        finalize(() => this.isLoading = false)
      )
      .subscribe({
        next: (response: any) => {
          if (response.status === 'SUCCESS' || response.success || response.data) {
            const tenures = (response.data || []).map((tenure: Tenure) => ({
              ...tenure,
              months: this.getMonthsText(tenure.tenureMonths)
            }));

            // Always create a new data source to ensure refresh
            this.dataSource = new MatTableDataSource<Tenure>(tenures);
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
          } else {
            throw new Error(response.message || 'Failed to load tenures');
          }
        },
        error: (error) => {
          console.error('Error loading loan settings:', error);
          const errorMessage = error?.error?.message || error.message || 'Failed to load loan settings';
          this.snackBar.open(errorMessage, 'Close', {
            duration: 5000,
            panelClass: ['error-snackbar']
          });
        }
      });
  }

  // Helper method to convert months to readable text (e.g., 12 -> "1 Year")
  getMonthsText(months: number): string {
    const years = Math.floor(months / 12);
    const remainingMonths = months % 12;
    
    if (years > 0 && remainingMonths > 0) {
      return `${years} Year${years > 1 ? 's' : ''} ${remainingMonths} Month${remainingMonths > 1 ? 's' : ''}`;
    } else if (years > 0) {
      return `${years} Year${years > 1 ? 's' : ''}`;
    } else {
      return `${months} Month${months > 1 ? 's' : ''}`;
    }
  }

  onUpdateRate(): void {
    if (this.interestRateForm.invalid) {
      return;
    }

    this.isSubmitting = true;

    this.settingsService.updateFixedInterestRate(this.interestRateForm.value.rate)
      .pipe(
        finalize(() => this.isSubmitting = false)
      )
      .subscribe({
        next: (response) => {
          if (response.status === 'SUCCESS') {
            this.snackBar.open('Interest rate updated successfully', 'Close', {
              duration: 3000,
              panelClass: ['success-snackbar']
            });
          } else {
            throw new Error(response.message || 'Failed to update interest rate');
          }
        },
        error: (error) => {
          console.error('Error updating interest rate:', error);
          const errorMessage = error?.error?.message || error.message || 'Failed to update interest rate';
          this.snackBar.open(errorMessage, 'Close', {
            duration: 5000,
            panelClass: ['error-snackbar']
          });
        }
      });
  }

  onAddTenure(): void {
    if (this.tenureForm.invalid) {
      return;
    }

    const formValue = this.tenureForm.value;

    // Validate minAmount is less than maxAmount
    if (Number(formValue.minAmount) >= Number(formValue.maxAmount)) {
      this.snackBar.open('Minimum amount must be less than maximum amount', 'Close', {
        duration: 3000,
        panelClass: ['error-snackbar']
      });
      return;
    }

    const tenureData = {
      tenureMonths: Number(formValue.tenureMonths),
      minAmount: Number(formValue.minAmount),
      maxAmount: Number(formValue.maxAmount)
    };

    this.isSubmitting = true;
    const wasEditMode = this.isEditMode;

    // Check if we're editing or creating
    const request = this.isEditMode && this.editingTenureId
      ? this.settingsService.updateTenure(this.editingTenureId, tenureData)
      : this.settingsService.createTenure(tenureData);

    request
      .pipe(
        finalize(() => this.isSubmitting = false)
      )
      .subscribe({
        next: (response) => {
          if (response.status === 'SUCCESS' || response.data) {
            const message = wasEditMode ? 'Tenure updated successfully' : 'Tenure added successfully';
            this.cancelEdit();
            this.loadLoanSettings(); // Refresh the list
            this.snackBar.open(message, 'Close', { duration: 3000, panelClass: ['success-snackbar'] });
          } else {
            throw new Error(response.message || (wasEditMode ? 'Failed to update tenure' : 'Failed to add tenure'));
          }
        },
        error: (error) => {
          console.error('Error saving tenure:', error);
          this.snackBar.open(error.message || 'Failed to save tenure', 'Close', {
            duration: 5000,
            panelClass: ['error-snackbar']
          });
        }
      });
  }

  onEditTenure(tenure: Tenure): void {
    this.isEditMode = true;
    this.editingTenureId = tenure.id || null;
    this.tenureForm.patchValue({
      tenureMonths: tenure.tenureMonths,
      minAmount: tenure.minAmount,
      maxAmount: tenure.maxAmount
    });
    // Scroll to form
    document.querySelector('.heading-small')?.scrollIntoView({ behavior: 'smooth' });
  }

  cancelEdit(): void {
    this.isEditMode = false;
    this.editingTenureId = null;
    this.tenureForm.reset();
  }

  onToggleTenureStatus(tenure: Tenure): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        title: 'Confirm Status Change',
        message: `Are you sure you want to ${tenure.isActive ? 'deactivate' : 'activate'} the ${this.getMonthsText(tenure.tenureMonths)} tenure?`
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.updateTenureStatus(tenure);
      }
    });
  }

  onDeleteTenure(tenure: Tenure): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        title: 'Delete Tenure',
        message: `Are you sure you want to delete the ${this.getMonthsText(tenure.tenureMonths)} tenure?`,
        confirmText: 'Delete',
        confirmColor: 'warn'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.deleteTenure(tenure);
      }
    });
  }

  private updateTenureStatus(tenure: Tenure): void {
    if (!tenure.id) return;
    
    this.isUpdatingStatus = tenure.id;
    
    this.settingsService.updateTenureStatus(tenure.id, !tenure.isActive)
      .pipe(
        finalize(() => this.isUpdatingStatus = null)
      )
      .subscribe({
        next: (response) => {
          if (response.status === 'SUCCESS') {
            this.loadLoanSettings(); // Refresh the list to get updated data
            this.snackBar.open('Tenure status updated', 'Close', {
              duration: 3000,
              panelClass: ['success-snackbar']
            });
          } else {
            throw new Error(response.message || 'Failed to update tenure status');
          }
        },
        error: (error) => {
          console.error('Error updating tenure status:', error);
          this.snackBar.open(error.message || 'Failed to update tenure status', 'Close', {
            duration: 5000,
            panelClass: ['error-snackbar']
          });
        }
      });
  }

  private deleteTenure(tenure: Tenure): void {
    if (!tenure.id) return;

    this.isLoading = true;

    this.settingsService.deleteTenure(tenure.id)
      .pipe(
        finalize(() => this.isLoading = false)
      )
      .subscribe({
        next: () => {
          this.snackBar.open('Tenure deleted successfully', 'Close', {
            duration: 3000,
            panelClass: ['success-snackbar']
          });
          this.loadLoanSettings(); // Refresh the list
        },
        error: (error) => {
          console.error('Error deleting tenure:', error);
          this.snackBar.open(error?.error?.message || error.message || 'Failed to delete tenure', 'Close', {
            duration: 5000,
            panelClass: ['error-snackbar']
          });
        }
      });
  }
}
