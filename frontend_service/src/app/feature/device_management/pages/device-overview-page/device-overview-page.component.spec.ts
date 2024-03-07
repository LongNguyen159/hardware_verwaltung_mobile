import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceOverviewPageComponent } from './device-overview-page.component';

describe('DeviceOverviewPageComponent', () => {
  let component: DeviceOverviewPageComponent;
  let fixture: ComponentFixture<DeviceOverviewPageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DeviceOverviewPageComponent]
    });
    fixture = TestBed.createComponent(DeviceOverviewPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
