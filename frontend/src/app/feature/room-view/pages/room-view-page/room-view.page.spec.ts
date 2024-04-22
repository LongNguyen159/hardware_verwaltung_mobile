import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoomOverviewPageComponent } from './room-view.page';

describe('Tab1Page', () => {
  let component: RoomOverviewPageComponent;
  let fixture: ComponentFixture<RoomOverviewPageComponent>;

  beforeEach(async () => {
    fixture = TestBed.createComponent(RoomOverviewPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
