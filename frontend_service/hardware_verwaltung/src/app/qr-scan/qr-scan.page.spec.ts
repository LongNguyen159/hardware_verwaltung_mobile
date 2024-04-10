import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ExploreContainerComponentModule } from '../explore-container/explore-container.module';

import { QrScanPageComponent } from './qr-scan.page';

describe('Tab2Page', () => {
  let component: QrScanPageComponent;
  let fixture: ComponentFixture<QrScanPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [QrScanPageComponent],
      imports: [IonicModule.forRoot(), ExploreContainerComponentModule]
    }).compileComponents();

    fixture = TestBed.createComponent(QrScanPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
