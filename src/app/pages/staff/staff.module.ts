import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { NgbModule, NgbDropdownModule, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';

import { StaffListComponent } from './staff-list/staff-list.component';
import { StaffDetailsComponent } from './staff-details/staff-details.component';
import { AddStaffModalComponent } from './add-staff-modal/add-staff-modal.component';
import { BulkUploadModalComponent } from './bulk-upload-modal/bulk-upload-modal.component';

const routes: Routes = [
  {
    path: '',
    component: StaffListComponent,
    data: { title: 'Staff Management' }
  },
  {
    path: ':id',
    component: StaffDetailsComponent,
    data: { title: 'Staff Details' }
  }
];

@NgModule({
  declarations: [
    StaffListComponent,
    StaffDetailsComponent,
    AddStaffModalComponent,
    BulkUploadModalComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    NgbDropdownModule,
    NgbPaginationModule,
    RouterModule.forChild(routes)
  ]
})
export class StaffModule {}

