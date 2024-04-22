import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QrCodeScanner } from './qr-code.page';

describe('Tab2Page', () => {
  let component: QrCodeScanner;
  let fixture: ComponentFixture<QrCodeScanner>;

  beforeEach(async () => {
    fixture = TestBed.createComponent(QrCodeScanner);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
