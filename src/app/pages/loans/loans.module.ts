import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule, NgbPaginationModule, NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { ToastrModule } from 'ngx-toastr';

// Components
import { LoanListComponent } from './loan-list/loan-list.component';
import { LoanDetailComponent } from './loan-detail/loan-detail.component';

const routes: Routes = [
  {
    path: '',
    component: LoanListComponent
  },
  {
    path: ':id',
    component: LoanDetailComponent
  }
];

@NgModule({
  declarations: [
    LoanListComponent,
    LoanDetailComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    NgbPaginationModule,
    NgbDropdownModule,
    ToastrModule
  ],
  providers: [
    // Add any services if needed
  ]
})
export class LoansModule { }
