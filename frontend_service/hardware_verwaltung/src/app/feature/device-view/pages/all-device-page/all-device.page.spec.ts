import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ExploreContainerComponentModule } from '../../../../explore-container/explore-container.module';

import { AllDevicePageComponent } from './all-device.page';

describe('Tab3Page', () => {
  let component: AllDevicePageComponent;
  let fixture: ComponentFixture<AllDevicePageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AllDevicePageComponent],
      imports: [IonicModule.forRoot(), ExploreContainerComponentModule]
    }).compileComponents();

    fixture = TestBed.createComponent(AllDevicePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
