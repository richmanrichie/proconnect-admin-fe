import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoanSettingsComponent } from './loan-settings.component';

describe('LoanSettingsComponent', () => {
  let component: LoanSettingsComponent;
  let fixture: ComponentFixture<LoanSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LoanSettingsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoanSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
