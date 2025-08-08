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
  
  // Table data
  dataSource: MatTableDataSource<Tenure>;
  displayedColumns: string[] = ['tenureMonths', 'minAmount', 'maxAmount', 'status', 'actions'];
  
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  // Mock data for testing
  private tenures: Tenure[] = [
    { id: 1, tenureMonths: 3, minAmount: 10000, maxAmount: 500000, isActive: true },
    { id: 2, tenureMonths: 6, minAmount: 10000, maxAmount: 1000000, isActive: true },
    { id: 3, tenureMonths: 12, minAmount: 10000, maxAmount: 2000000, isActive: true },
    { id: 4, tenureMonths: 24, minAmount: 10000, maxAmount: 5000000, isActive: false },
  ];

  // Mock interest rate
  currentInterestRate = 8.5;

  constructor(
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private settingsService: SettingsService
  ) {
    this.initializeForms();
  }

  ngOnInit(): void {
    this.loadLoanSettings();
  }

  ngAfterViewInit(): void {
    if (this.dataSource) {
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }
  }

  private initializeForms(): void {
    this.interestRateForm = this.fb.group({
      rate: [this.currentInterestRate, [Validators.required, Validators.min(0.1), Validators.max(100)]]
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
        next: (response: ApiResponse<Tenure[]>) => {
          if (response.status === 'SUCCESS') {
            const tenures = response.data.map((tenure: Tenure) => ({
              ...tenure,
              months: this.getMonthsText(tenure.tenureMonths)
            }));

            if (!this.dataSource) {
              this.dataSource = new MatTableDataSource<Tenure>(tenures);
              if (this.paginator) {
                this.dataSource.paginator = this.paginator;
              }
              if (this.sort) {
                this.dataSource.sort = this.sort;
              }
            } else {
              this.dataSource.data = tenures;
            }
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
    
    // TODO: Implement API call to update interest rate
    setTimeout(() => {
      this.isSubmitting = false;
      this.snackBar.open('Interest rate updated successfully', 'Close', {
        duration: 3000,
        panelClass: ['success-snackbar']
      });
    }, 1000);
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

    const newTenure = {
      tenureMonths: Number(formValue.tenureMonths),
      minAmount: Number(formValue.minAmount),
      maxAmount: Number(formValue.maxAmount)
    };

    this.isSubmitting = true;
    
    this.settingsService.createTenure(newTenure)
      .pipe(
        finalize(() => this.isSubmitting = false)
      )
      .subscribe({
        next: (response) => {
          if (response.status === 'SUCCESS') {
            this.tenureForm.reset();
            this.loadLoanSettings(); // Refresh the list
            this.snackBar.open('Tenure added successfully', 'Close', {
              duration: 3000,
              panelClass: ['success-snackbar']
            });
          } else {
            throw new Error(response.message || 'Failed to add tenure');
          }
        },
        error: (error) => {
          console.error('Error adding tenure:', error);
          this.snackBar.open(error.message || 'Failed to add tenure', 'Close', {
            duration: 5000,
            panelClass: ['error-snackbar']
          });
        }
      });
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
        next: (response) => {
          if (response.status === 'SUCCESS') {
            this.loadLoanSettings(); // Refresh the list
            this.snackBar.open('Tenure deleted successfully', 'Close', {
              duration: 3000,
              panelClass: ['success-snackbar']
            });
          } else {
            throw new Error(response.message || 'Failed to delete tenure');
          }
        },
        error: (error) => {
          console.error('Error deleting tenure:', error);
          this.snackBar.open(error.message || 'Failed to delete tenure', 'Close', {
            duration: 5000,
            panelClass: ['error-snackbar']
          });
        }
      });
  }
}
