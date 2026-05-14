import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { StoreService } from '../../../services/store.service';
import { QTBStore } from '../../../models/store.model';

@Component({
  selector: 'app-store-form',
  templateUrl: './store-form.component.html',
  styleUrls: ['./store-form.component.scss']
})
export class StoreFormComponent implements OnInit {
  storeForm: FormGroup;
  isEditMode = false;
  isLoading = false;
  isSaving = false;
  error = '';
  storeId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private storeService: StoreService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.storeForm = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(100)]],
      qtbId: ['', [Validators.required, Validators.maxLength(50)]],
      merchantCode: ['', [Validators.required, Validators.maxLength(50)]],
      payableCode: ['', [Validators.required, Validators.maxLength(100)]],
      email: ['', [Validators.required, Validators.email, Validators.maxLength(100)]],
      phoneNumber: ['', [Validators.required, Validators.maxLength(20)]],
      address: ['', [Validators.required, Validators.maxLength(255)]],
      city: ['', [Validators.required, Validators.maxLength(100)]],
      state: ['', [Validators.required, Validators.maxLength(100)]],
      country: ['Nigeria', [Validators.required, Validators.maxLength(100)]],
      isActive: [true]
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.storeId = +id;
      this.loadStore(this.storeId);
    }
  }

  loadStore(id: number): void {
    this.isLoading = true;
    this.storeService.getStoreById(id).subscribe({
      next: (store) => {
        this.storeForm.patchValue({
          name: store.name,
          qtbId: store.qtbId,
          merchantCode: store.merchantCode,
          payableCode: store.payableCode,
          email: store.email,
          phoneNumber: store.phoneNumber,
          address: store.address,
          city: store.city,
          state: store.state,
          country: store.country,
          isActive: store.isActive
        });
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading store:', err);
        this.error = 'Failed to load store details.';
        this.isLoading = false;
      }
    });
  }

  onSubmit(): void {
    if (this.storeForm.invalid) {
      this.storeForm.markAllAsTouched();
      return;
    }

    this.isSaving = true;
    this.error = '';

    const storeData = this.storeForm.value;

    const request = this.isEditMode && this.storeId
      ? this.storeService.updateStore(this.storeId, storeData)
      : this.storeService.createStore(storeData);

    request.subscribe({
      next: () => {
        this.router.navigate(['/stores']);
      },
      error: (err) => {
        console.error('Error saving store:', err);
        this.error = err?.error?.message || 'Failed to save store. Please try again.';
        this.isSaving = false;
      }
    });
  }

  onCancel(): void {
    this.router.navigate(['/stores']);
  }

  get f() {
    return this.storeForm.controls;
  }
}
