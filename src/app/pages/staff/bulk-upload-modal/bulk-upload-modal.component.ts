import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { StaffService } from '../../../services/staff.service';

@Component({
  selector: 'app-bulk-upload-modal',
  templateUrl: './bulk-upload-modal.component.html'
})
export class BulkUploadModalComponent {
  selectedFile: File | null = null;
  error = '';
  loading = false;
  uploadMessage = '';

  constructor(
    public activeModal: NgbActiveModal,
    private staffService: StaffService
  ) {}

  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) {
      this.selectedFile = null;
      return;
    }

    const file = input.files[0];
    const allowedTypes = [
      'text/csv',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    ];

    if (!allowedTypes.includes(file.type) && !file.name.match(/\.(csv|xls|xlsx)$/i)) {
      this.error = 'Invalid file type. Please upload a CSV or Excel file.';
      this.selectedFile = null;
      return;
    }

    this.error = '';
    this.selectedFile = file;
  }

  onUpload(): void {
    if (!this.selectedFile) {
      this.error = 'Please select a file to upload.';
      return;
    }

    this.loading = true;
    this.error = '';
    this.uploadMessage = '';

    this.staffService.bulkUpload(this.selectedFile).subscribe({
      next: (response) => {
        this.loading = false;
        // Assume message contains info about number of records uploaded
        this.uploadMessage = response.message || 'Bulk upload completed successfully.';
        this.activeModal.close('uploaded');
      },
      error: (error) => {
        const backendMessage =
          error?.error?.error ||
          error?.error?.message ||
          error?.message;

        this.error = backendMessage || 'Failed to upload staff file. Please try again.';
        this.loading = false;
        console.error('Bulk upload error:', error);
      }
    });
  }
}

