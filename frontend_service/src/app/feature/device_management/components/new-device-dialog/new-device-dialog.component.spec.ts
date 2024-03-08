import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewDeviceDialogComponent } from './new-device-dialog.component';

describe('NewDeviceDialogComponent', () => {
  let component: NewDeviceDialogComponent;
  let fixture: ComponentFixture<NewDeviceDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NewDeviceDialogComponent]
    });
    fixture = TestBed.createComponent(NewDeviceDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
