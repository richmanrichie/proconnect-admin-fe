import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { finalize } from 'rxjs/operators';

import { Staff, StaffStatus } from '../../../models/staff.model';
import { StaffService } from '../../../services/staff.service';
import { AddStaffModalComponent } from '../add-staff-modal/add-staff-modal.component';
import { BulkUploadModalComponent } from '../bulk-upload-modal/bulk-upload-modal.component';

@Component({
  selector: 'app-staff-list',
  templateUrl: './staff-list.component.html',
  styleUrls: ['./staff-list.component.scss']
})
export class StaffListComponent implements OnInit {
  staff: Staff[] = [];
  filteredStaff: Staff[] = [];
  isLoading = false;
  error = '';

  searchTerm = '';
  statusFilter: StaffStatus | '' = '';

  constructor(
    private staffService: StaffService,
    private router: Router,
    private modalService: NgbModal
  ) {}

  ngOnInit(): void {
    this.loadStaff();
  }

  loadStaff(): void {
    this.isLoading = true;
    this.error = '';

    this.staffService.getStaff()
      .pipe(finalize(() => this.isLoading = false))
      .subscribe({
        next: (response) => {
          const data = Array.isArray(response.data) ? response.data : [response.data];
          this.staff = data;
          this.applyFilters();
        },
        error: (error) => {
          this.error = 'Failed to load staff. Please try again later.';
          console.error('Error loading staff:', error);
        }
      });
  }

  applyFilters(): void {
    this.filteredStaff = this.staff.filter(member => {
      const matchesSearch = this.matchesSearch(member);
      const matchesStatus = this.matchesStatus(member);
      return matchesSearch && matchesStatus;
    });
  }

  private matchesSearch(member: Staff): boolean {
    if (!this.searchTerm) {
      return true;
    }
    const term = this.searchTerm.toLowerCase();
    const fullName = `${member.firstName} ${member.lastName}`.toLowerCase();
    return (
      fullName.includes(term) ||
      member.email.toLowerCase().includes(term)
    );
  }

  private matchesStatus(member: Staff): boolean {
    if (!this.statusFilter) {
      return true;
    }
    return member.status === this.statusFilter;
  }

  onSearchChange(): void {
    this.applyFilters();
  }

  onStatusFilterChange(): void {
    this.applyFilters();
  }

  onViewDetails(member: Staff): void {
    this.router.navigate(['/staff', member.id]);
  }

  onToggleStatus(member: Staff): void {
    const newStatus: StaffStatus = member.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
    this.staffService.updateStaffStatus(member.id, newStatus).subscribe({
      next: (response) => {
        const updated = response.data as Staff;
        this.staff = this.staff.map(s => s.id === updated.id ? updated : s);
        this.applyFilters();
      },
      error: (error) => {
        console.error('Failed to update staff status:', error);
      }
    });
  }

  openAddStaffModal(): void {
    const modalRef = this.modalService.open(AddStaffModalComponent, { centered: true, size: 'lg', backdrop: false });
    modalRef.result.then(
      (result) => {
        if (result === 'saved') {
          this.loadStaff();
        }
      },
      () => {}
    );
  }

  openBulkUploadModal(): void {
    const modalRef = this.modalService.open(BulkUploadModalComponent, {
      centered: true,
      backdrop: false
    });
    modalRef.result.then(
      (result) => {
        if (result === 'uploaded') {
          this.loadStaff();
        }
      },
      () => {}
    );
  }
}

