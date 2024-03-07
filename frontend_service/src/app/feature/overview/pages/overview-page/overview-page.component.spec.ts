import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OverviewPageComponent } from './overview-page.component';

describe('OverviewPageComponent', () => {
  let component: OverviewPageComponent;
  let fixture: ComponentFixture<OverviewPageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [OverviewPageComponent]
    });
    fixture = TestBed.createComponent(OverviewPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
