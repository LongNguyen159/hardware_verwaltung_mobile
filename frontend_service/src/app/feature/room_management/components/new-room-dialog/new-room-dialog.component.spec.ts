import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewRoomDialogComponent } from './new-room-dialog.component';

describe('NewRoomDialogComponent', () => {
  let component: NewRoomDialogComponent;
  let fixture: ComponentFixture<NewRoomDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NewRoomDialogComponent]
    });
    fixture = TestBed.createComponent(NewRoomDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
