import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule, NgbPaginationModule, NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';

import { OrganizationListComponent } from './organization-list/organization-list.component';
import { OrganizationFormComponent } from './organization-form/organization-form.component';
import { OrganizationDetailComponent } from './organization-detail/organization-detail.component';

const routes: Routes = [
  {
    path: '',
    component: OrganizationListComponent,
    data: { title: 'Organizations' }
  },
  {
    path: 'new',
    component: OrganizationFormComponent,
    data: { title: 'New Organization' }
  },
  {
    path: ':id',
    component: OrganizationDetailComponent,
    data: { title: 'Organization Details' }
  },
  {
    path: 'edit/:id',
    component: OrganizationFormComponent,
    data: { title: 'Edit Organization' }
  }
];

@NgModule({
  declarations: [
    OrganizationListComponent,
    OrganizationFormComponent,
    OrganizationDetailComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    NgbPaginationModule,
    NgbDropdownModule,
    RouterModule.forChild(routes)
  ]
})
export class OrganizationsModule { }
