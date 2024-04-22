import { ComponentFixture, TestBed } from '@angular/core/testing';
import { YourItemsPage } from './your-items.page';

describe('YourItemsPage', () => {
  let component: YourItemsPage;
  let fixture: ComponentFixture<YourItemsPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(YourItemsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
