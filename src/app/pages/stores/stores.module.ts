import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { StoreListComponent } from './store-list/store-list.component';
import { StoreFormComponent } from './store-form/store-form.component';

const routes: Routes = [
  {
    path: '',
    component: StoreListComponent,
    data: { title: 'QTB Stores' }
  },
  {
    path: 'new',
    component: StoreFormComponent,
    data: { title: 'Create Store' }
  },
  {
    path: 'edit/:id',
    component: StoreFormComponent,
    data: { title: 'Edit Store' }
  }
];

@NgModule({
  declarations: [
    StoreListComponent,
    StoreFormComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    RouterModule.forChild(routes)
  ]
})
export class StoresModule { }
