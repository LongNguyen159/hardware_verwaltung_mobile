import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RoomDetailsPage } from './room-details.page';

describe('RoomDetailsPage', () => {
  let component: RoomDetailsPage;
  let fixture: ComponentFixture<RoomDetailsPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(RoomDetailsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
