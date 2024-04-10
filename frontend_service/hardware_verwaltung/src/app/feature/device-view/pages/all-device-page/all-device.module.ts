import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AllDevicePageComponent } from './all-device.page';
import { ExploreContainerComponentModule } from '../../../../explore-container/explore-container.module';

import { Tab3PageRoutingModule } from './all-device-routing.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ExploreContainerComponentModule,
    Tab3PageRoutingModule
  ],
  declarations: [AllDevicePageComponent]
})
export class AllDevicePageModule {}
