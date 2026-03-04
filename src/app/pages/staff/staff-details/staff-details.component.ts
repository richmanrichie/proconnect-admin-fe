import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Staff } from '../../../models/staff.model';
import { StaffService } from '../../../services/staff.service';

@Component({
  selector: 'app-staff-details',
  templateUrl: './staff-details.component.html',
  styleUrls: ['./staff-details.component.scss']
})
export class StaffDetailsComponent implements OnInit {
  staff: Staff | null = null;
  isLoading = false;
  error = '';
  notFound = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private staffService: StaffService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.notFound = true;
      return;
    }

    this.loadStaff(+id);
  }

  loadStaff(id: number): void {
    this.isLoading = true;
    this.error = '';
    this.notFound = false;

    this.staffService.getStaffById(id).subscribe({
      next: (response) => {
        this.isLoading = false;
        this.staff = response.data as Staff;
        if (!this.staff) {
          this.notFound = true;
        }
      },
      error: (error) => {
        this.isLoading = false;
        if (error.status === 404) {
          this.notFound = true;
        } else {
          this.error = 'Failed to load staff details. Please try again later.';
        }
        console.error('Error loading staff details:', error);
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/staff']);
  }

  viewKyc(): void {
    if (this.staff?.kycFolder) {
      window.open(this.staff.kycFolder, '_blank');
    }
  }
}

